import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/lib/models/Complaint';
import { requireAdmin } from '@/lib/auth';
import { sendStatusUpdateEmail } from '@/lib/email';
import { ApiResponse, Complaint as ComplaintType } from '@/types';

// PATCH - Update complaint status (requires admin authentication)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request);
    if (user instanceof NextResponse) return user;

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required' },
        { status: 400 }
      );
    }

    // Find complaint and get old status
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const oldStatus = complaint.status;

    // Update complaint status
    complaint.status = status;
    await complaint.save();

    // Send email notification about status update
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    try {
      await sendStatusUpdateEmail(complaint, adminEmail, oldStatus);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }

    const response: ApiResponse<ComplaintType> = {
      success: true,
      data: complaint,
      message: 'Complaint status updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update complaint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete complaint (requires admin authentication)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request);
    if (user instanceof NextResponse) return user;

    await connectDB();

    const { id } = await params;

    // Find and delete complaint
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Complaint deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Delete complaint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
