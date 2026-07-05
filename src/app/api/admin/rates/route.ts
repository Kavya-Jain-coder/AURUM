import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { marketRates } from '@/lib/schema';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // 1. Authenticate & authorize admin
    const session = await auth();
    // @ts-ignore
    const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'admin@aurum.com';
    
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { rates } = body; // Expecting an array of objects: { materialType, materialName, ratePerUnit }

    if (!Array.isArray(rates) || rates.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid rates data' }, { status: 400 });
    }

    // Insert all new rates with current timestamp
    await db.insert(marketRates).values(
      rates.map((r: any) => ({
        materialType: r.materialType,
        materialName: r.materialName,
        ratePerUnit: r.ratePerUnit,
        effectiveDate: new Date(),
      }))
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving rates:', error);
    return NextResponse.json({ success: false, error: 'Failed to save rates' }, { status: 500 });
  }
}
