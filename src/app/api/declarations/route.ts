import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      deliveryId,
      packageCategory,
      description,
      estimatedValue,
      weight,
      dimensions,
      isDangerousGoods,
      isFragile,
      isElectronics,
      isLiquids,
      isDocuments,
      declarationText,
    } = body;

    if (!deliveryId || !packageCategory || !description || estimatedValue === undefined || weight === undefined || !declarationText) {
      return NextResponse.json(
        { error: 'Missing required fields: deliveryId, packageCategory, description, estimatedValue, weight, declarationText' },
        { status: 400 }
      );
    }

    const declaration = await db.packageDeclaration.create({
      data: {
        deliveryId,
        packageCategory,
        description,
        estimatedValue: parseFloat(estimatedValue),
        weight: parseFloat(weight),
        dimensions: dimensions || null,
        isDangerousGoods: Boolean(isDangerousGoods),
        isFragile: Boolean(isFragile),
        isElectronics: Boolean(isElectronics),
        isLiquids: Boolean(isLiquids),
        isDocuments: Boolean(isDocuments),
        declarationText,
        ipAddress: request.headers.get('x-forwarded-for') || null,
      },
    });

    return NextResponse.json(declaration, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}