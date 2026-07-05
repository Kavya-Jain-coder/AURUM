import { NextResponse } from 'next/server';
import { getLatestRates } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rates = await getLatestRates();
    return NextResponse.json({ success: true, rates });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch rates' }, { status: 500 });
  }
}
