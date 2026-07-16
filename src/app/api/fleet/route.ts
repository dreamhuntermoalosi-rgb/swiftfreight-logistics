import { NextRequest, NextResponse } from 'next/server';
import { vehicles } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const companyId = searchParams.get('companyId');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    let filtered = [...vehicles];

    if (type) {
      filtered = filtered.filter((v) => v.type === type);
    }

    if (status) {
      filtered = filtered.filter((v) => v.status === status);
    }

    if (companyId) {
      filtered = filtered.filter((v) => v.companyId === companyId);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.plateNumber.toLowerCase().includes(q) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.color.toLowerCase().includes(q)
      );
    }

    // Sort by status (available first), then by year descending
    const statusOrder: Record<string, number> = { available: 0, in_use: 1, maintenance: 2, out_of_service: 3 };
    filtered.sort((a, b) => {
      const sDiff = (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4);
      if (sDiff !== 0) return sDiff;
      return b.year - a.year;
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: {
        vehicles: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fleet' },
      { status: 500 }
    );
  }
}