import { NextRequest, NextResponse } from 'next/server';
import { drivers } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const companyId = searchParams.get('companyId');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    let filtered = [...drivers];

    if (status) {
      filtered = filtered.filter((d) => d.status === status);
    }

    if (companyId) {
      filtered = filtered.filter((d) => d.companyId === companyId);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.licenseNumber.includes(q)
      );
    }

    // Sort by rating descending, then by totalDeliveries
    filtered.sort((a, b) => {
      const rDiff = (b.rating as number) - (a.rating as number);
      if (rDiff !== 0) return rDiff;
      return b.totalDeliveries - a.totalDeliveries;
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: {
        drivers: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}