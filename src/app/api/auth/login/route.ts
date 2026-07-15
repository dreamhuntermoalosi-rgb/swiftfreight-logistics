import { NextRequest, NextResponse } from 'next/server';
import { demoUsers } from '@/lib/mock-data';

// Demo credentials mapping (email -> password)
const DEMO_PASSWORDS: Record<string, string> = {
  'admin@swiftfreight.com': 'admin123',
  'thabo@mountainexpress.co.ls': 'thabo123',
  'mpheleki@mountainexpress.co.ls': 'mpheleki123',
  'kmosotho@mountainexpress.co.ls': 'kekets0123',
  'tnkoe@mountainexpress.co.ls': 'tumel0123',
  'lmosotho@mountainexpress.co.ls': 'lebo123',
  'mampho@email.co.ls': 'mampho123',
  'teboho@email.co.ls': 'teboho123',
  'palesa@sourcing.ls': 'palesa123',
  'warehouse@highlandhaulage.co.ls': 'warehouse123',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = demoUsers.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const expectedPassword = DEMO_PASSWORDS[email];
    if (!expectedPassword || expectedPassword !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In production, this would be a real JWT token
    const token = `demo-token-${user.id}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          avatar: user.avatar,
          isActive: user.isActive,
        },
        token,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}