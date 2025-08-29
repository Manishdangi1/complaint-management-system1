import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './jwt';
import { User } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  user?: Omit<User, 'password'>;
}

export async function authenticateUser(request: NextRequest): Promise<NextResponse | Omit<User, 'password'>> {
  const token = extractTokenFromHeader(request.headers.get('authorization') || undefined);
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Access token required' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  return decoded as Omit<User, 'password'>;
}

export async function requireAuth(request: NextRequest): Promise<NextResponse | Omit<User, 'password'>> {
  const authResult = await authenticateUser(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  return authResult;
}

export async function requireAdmin(request: NextRequest): Promise<NextResponse | Omit<User, 'password'>> {
  const authResult = await authenticateUser(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  if (authResult.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Admin access required' },
      { status: 403 }
    );
  }
  
  return authResult;
}
