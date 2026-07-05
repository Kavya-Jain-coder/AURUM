import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { inArray } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    // 1. Authenticate & authorize admin
    const session = await auth();
    // @ts-ignore
    const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'admin@aurum.com';
    
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 503 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No product IDs provided' }, { status: 400 });
    }

    // 3. Delete products
    await db.delete(productsTable).where(inArray(productsTable.id, ids));

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error: any) {
    console.error('Error bulk deleting products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
