import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Complaint from '@/lib/models/Complaint';
import { requireAuth } from '@/lib/auth';
import { ApiResponse, Complaint as ComplaintType } from '@/types';

// GET - Retrieve user's own complaints (requires user authentication)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (user instanceof NextResponse) return user;

    await connectDB();

    // Get complaints for the authenticated user
    const complaints = await Complaint.find({ userId: user._id })
      .sort({ dateSubmitted: -1 });

    const response: ApiResponse<ComplaintType[]> = {
      success: true,
      data: complaints,
      message: 'User complaints retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get user complaints error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
