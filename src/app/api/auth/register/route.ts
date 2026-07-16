import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role, city } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists in DB
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user in Prisma
    const user = await db.user.create({
      data: {
        email,
        password, // In production, this would be hashed
        name,
        phone: phone || null,
        role: role || 'customer',
      },
    });

    // Create customer profile if role is customer
    if (role === 'customer') {
      await db.customerProfile.create({
        data: {
          userId: user.id,
          address: '',
          city: city || 'Maseru',
          country: 'Lesotho',
        },
      });
    }

    const token = `demo-token-${user.id}-${Date.now()}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            companyId: user.companyId,
            isActive: user.isActive,
          },
          token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}