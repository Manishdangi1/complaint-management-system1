import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/lib/models/Complaint';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { sendNewComplaintEmail } from '@/lib/email';
import { Complaint as ComplaintType, ApiResponse, ComplaintFilters, ComplaintStatus, ComplaintPriority, ComplaintCategory } from '@/types';

// POST - Create new complaint (requires user authentication)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    await connectDB();

    const body = await request.json();
    const { title, description, category, priority } = body;

    // Validate required fields
    if (!title || !description || !category || !priority) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create new complaint
    const complaint = new Complaint({
      title,
      description,
      category,
      priority,
      status: 'Pending',
      dateSubmitted: new Date(),
      userId: (user as { id?: string; _id?: string }).id || user._id,
    });

    await complaint.save();

    // Send email notification to admin (you can configure admin email in env)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    try {
      await sendNewComplaintEmail(complaint, adminEmail);
    } catch (emailError) {
      console.error('Failed to send complaint notification email:', emailError);
    }

    const response: ApiResponse<ComplaintType> = {
      success: true,
      data: complaint,
      message: 'Complaint submitted successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Create complaint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve all complaints (requires admin authentication)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (user instanceof NextResponse) return user;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');

    // Build filter object
    const filters: ComplaintFilters = {};
    if (status) filters.status = status as ComplaintStatus;
    if (priority) filters.priority = priority as ComplaintPriority;
    if (category) filters.category = category as ComplaintCategory;

    // Get complaints with filters
    const complaints = await Complaint.find(filters)
      .populate('userId', 'name email')
      .sort({ dateSubmitted: -1 });

    const response: ApiResponse<ComplaintType[]> = {
      success: true,
      data: complaints,
      message: 'Complaints retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get complaints error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
