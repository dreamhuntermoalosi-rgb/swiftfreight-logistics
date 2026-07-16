import { NextRequest, NextResponse } from 'next/server';
import { deliveries, getDeliveryTimeline } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'trackingNumber query parameter is required' },
        { status: 400 }
      );
    }

    // Support partial match or exact match
    const delivery = deliveries.find(
      (d) => d.trackingNumber === trackingNumber
    );

    if (!delivery) {
      return NextResponse.json(
        { success: false, error: 'No delivery found with this tracking number' },
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
      { success: false, error: 'Failed to track delivery' },
      { status: 500 }
    );
  }
}