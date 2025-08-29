import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/email';
import { RegisterRequest, ApiResponse, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RegisterRequest = await request.json();
    const { email, password, name } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role: 'user',
    });

    await user.save();

    // Generate token
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt,
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
      message: 'User registered successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
