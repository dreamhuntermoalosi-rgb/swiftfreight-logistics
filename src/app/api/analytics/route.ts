import { NextRequest, NextResponse } from 'next/server';
import { analyticsData } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    // In a real app, companyId would filter analytics for that specific company
    // For demo, we return the same analyticsData (could be modified per company)

    const data = companyId
      ? { ...analyticsData }
      : analyticsData;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}