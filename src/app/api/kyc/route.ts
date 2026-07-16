import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, field, value } = body;

    if (!userId || !field) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, field' },
        { status: 400 }
      );
    }

    const validFields = [
      'phoneVerified', 'emailVerified', 'nationalIdVerified',
      'selfieVerified', 'proofOfAddressVerified', 'verificationLevel',
      'badge', 'nationalId', 'proofOfAddress',
    ] as const;

    if (!validFields.includes(field)) {
      return NextResponse.json(
        { error: `Invalid field: ${field}. Must be one of: ${validFields.join(', ')}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (field === 'phoneVerified' && value === true) {
      updateData.phoneVerified = true;
      updateData.phoneVerifiedAt = new Date();
    } else if (field === 'emailVerified' && value === true) {
      updateData.emailVerified = true;
      updateData.emailVerifiedAt = new Date();
    } else if (field === 'nationalId') {
      updateData.nationalId = value;
    } else if (field === 'proofOfAddress') {
      updateData.proofOfAddress = value;
    } else {
      updateData[field] = value;
    }

    const kyc = await db.kycVerification.upsert({
      where: { userId },
      create: {
        userId,
        ...updateData,
      },
      update: updateData,
    });

    return NextResponse.json(kyc);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: userId' },
        { status: 400 }
      );
    }

    const kyc = await db.kycVerification.findUnique({
      where: { userId },
    });

    if (!kyc) {
      return NextResponse.json({
        userId,
        phoneVerified: false,
        emailVerified: false,
        nationalIdVerified: false,
        selfieVerified: false,
        proofOfAddressVerified: false,
        verificationLevel: 'none',
        badge: 'none',
      });
    }

    return NextResponse.json(kyc);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}