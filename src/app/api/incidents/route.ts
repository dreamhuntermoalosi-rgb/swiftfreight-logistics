import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deliveryId, incidentType, description, reporterRole, reporterId, priority } = body;

    if (!incidentType || !description || !reporterRole || !reporterId) {
      return NextResponse.json(
        { error: 'Missing required fields: incidentType, description, reporterRole, reporterId' },
        { status: 400 }
      );
    }

    const incident = await db.incidentReport.create({
      data: {
        deliveryId: deliveryId || null,
        reporterId,
        reporterRole,
        incidentType,
        description,
        priority: priority || 'medium',
      },
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deliveryId = searchParams.get('deliveryId');
    const reporterId = searchParams.get('reporterId');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (deliveryId) where.deliveryId = deliveryId;
    if (reporterId) where.reporterId = reporterId;
    if (status) where.status = status;

    const incidents = await db.incidentReport.findMany({
      where,
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        delivery: deliveryId ? {
          select: { id: true, trackingNumber: true },
        } : false,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(incidents);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}