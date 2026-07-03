import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { mapDbProductToClient } from '@/lib/db-helpers';

export async function GET(req: Request, { params }: { params: { id: string } }) {

  try {
    const { id } = params;

    if (!db) {
      return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 503 });
    }

    const [dbProd] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!dbProd) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 444 });
    }

    const clientProduct = mapDbProductToClient(dbProd);
    return NextResponse.json({ success: true, product: clientProduct });
  } catch (error: any) {
    console.error('Error fetching single product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

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
    const {
      name,
      slug,
      collection,
      price,
      description,
      story,
      imagePath,
      materialsMetal,
      materialsStone,
      materialsWeight,
      materialsPurity,
      inStock,
      isNew,
      isBestseller,
    } = body;

    const updatedData: any = {};
    if (name !== undefined) updatedData.name = name;
    if (slug !== undefined) updatedData.slug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (collection !== undefined) updatedData.collection = collection;
    if (price !== undefined) updatedData.price = Math.round(Number(price));
    if (description !== undefined) updatedData.description = description;
    if (story !== undefined) updatedData.story = story;
    if (imagePath !== undefined) updatedData.imagePath = imagePath;
    if (materialsMetal !== undefined) updatedData.materialsMetal = materialsMetal;
    if (materialsStone !== undefined) updatedData.materialsStone = materialsStone;
    if (materialsWeight !== undefined) updatedData.materialsWeight = materialsWeight;
    if (materialsPurity !== undefined) updatedData.materialsPurity = materialsPurity;
    if (inStock !== undefined) updatedData.inStock = !!inStock;
    if (isNew !== undefined) updatedData.isNew = !!isNew;
    if (isBestseller !== undefined) updatedData.isBestseller = !!isBestseller;

    await db.update(productsTable).set(updatedData).where(eq(productsTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

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

    await db.delete(productsTable).where(eq(productsTable.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
