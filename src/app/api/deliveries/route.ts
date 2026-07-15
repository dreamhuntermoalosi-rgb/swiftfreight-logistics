import { NextRequest, NextResponse } from 'next/server';
import { deliveries, getDeliveryTimeline } from '@/lib/mock-data';

function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const companyId = searchParams.get('companyId');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    let filtered = [...deliveries];

    if (status) {
      filtered = filtered.filter((d) => d.status === status);
    }
    if (priority) {
      filtered = filtered.filter((d) => d.priority === priority);
    }
    if (companyId) {
      filtered = filtered.filter((d) => d.companyId === companyId);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.trackingNumber.toLowerCase().includes(q) ||
          d.customerName.toLowerCase().includes(q) ||
          d.packageDescription.toLowerCase().includes(q) ||
          d.destination.city.toLowerCase().includes(q) ||
          d.pickup.city.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const paginated = paginate(filtered, page, limit);

    return NextResponse.json({
      success: true,
      data: {
        deliveries: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerId,
      companyId,
      priority = 'standard',
      pickupName,
      pickupPhone,
      pickupAddress,
      pickupCity,
      pickupCountry = 'South Africa',
      destName,
      destPhone,
      destAddress,
      destCity,
      destCountry = 'Lesotho',
      packageDesc,
      packageWeight,
      declaredValue,
      notes,
    } = body;

    if (!customerName || !pickupAddress || !destAddress || !packageDesc) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerName, pickupAddress, destAddress, packageDesc' },
        { status: 400 }
      );
    }

    // Generate a tracking number
    const seq = String(deliveries.length + 1).padStart(8, '0');
    const trackingNumber = `SF${2025000 + deliveries.length}${seq.slice(4)}LS`;

    const now = new Date().toISOString();

    const newDelivery = {
      id: `del-new-${Date.now()}`,
      trackingNumber,
      status: 'request_received' as const,
      priority,
      customerId: customerId || 'cust-new',
      customerName,
      companyId: companyId || 'comp-001',
      companyName: '',
      pickup: {
        name: pickupName || customerName,
        phone: pickupPhone || '',
        address: pickupAddress,
        city: pickupCity,
        country: pickupCountry,
      },
      destination: {
        name: destName || customerName,
        phone: destPhone || '',
        address: destAddress,
        city: destCity,
        country: destCountry,
      },
      packageDescription: packageDesc,
      packageWeight: packageWeight || 1,
      declaredValue,
      quotedAmount: null,
      paidAmount: null,
      createdAt: now,
      updatedAt: now,
      notes,
    };

    return NextResponse.json(
      {
        success: true,
        data: { delivery: newDelivery },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create delivery' },
      { status: 400 }
    );
  }
}