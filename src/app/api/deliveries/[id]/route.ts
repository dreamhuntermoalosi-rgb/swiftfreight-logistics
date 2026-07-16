import { NextRequest, NextResponse } from 'next/server';
import { deliveries, getDeliveryTimeline } from '@/lib/mock-data';

// Context params type for Next.js 16 App Router
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const delivery = deliveries.find((d) => d.id === id);

    if (!delivery) {
      return NextResponse.json(
        { success: false, error: 'Delivery not found' },
        { status: 404 }
      );
    }

    const timeline = getDeliveryTimeline(delivery);

    return NextResponse.json({
      success: true,
      data: { delivery, timeline },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch delivery' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, driverId, vehicleId } = body as {
      status?: string;
      driverId?: string;
      vehicleId?: string;
    };

    const delivery = deliveries.find((d) => d.id === id);

    if (!delivery) {
      return NextResponse.json(
        { success: false, error: 'Delivery not found' },
        { status: 404 }
      );
    }

    // In a real app, this would update the database
    // For demo, return the updated delivery object
    const updated = {
      ...delivery,
      ...(status && { status, updatedAt: new Date().toISOString() }),
      ...(driverId && { driverId }),
      ...(vehicleId && { vehicleId }),
    };

    const timeline = getDeliveryTimeline(updated as typeof delivery);

    return NextResponse.json({
      success: true,
      data: { delivery: updated, timeline },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update delivery' },
      { status: 400 }
    );
  }
}