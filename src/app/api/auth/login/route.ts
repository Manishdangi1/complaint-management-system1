import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';
import { LoginRequest, ApiResponse, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt,
    });

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
      message: 'Login successful',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
