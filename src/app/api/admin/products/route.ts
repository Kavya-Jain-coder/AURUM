import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/schema';
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

    if (!name || !slug || !collection || !price) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = {
      id: `${collection}-${Date.now()}`,
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      collection,
      price: Math.round(Number(price)),
      description: description || '',
      story: story || '',
      imagePath: imagePath || '/images/ring-hero.png', // fallback
      modelPath: collection === 'rings' ? '/models/ring-solitaire.glb' : '/models/earrings-studs.glb', // default placeholders
      materialsMetal: materialsMetal || 'Yellow Gold',
      materialsStone: materialsStone || 'Diamond',
      materialsWeight: materialsWeight || '4.5g',
      materialsPurity: materialsPurity || '18 Karat',
      inStock: inStock !== false,
      rating: 5,
      reviewCount: 0,
      isNew: !!isNew,
      isBestseller: !!isBestseller,
    };

    await db.insert(productsTable).values(newProduct);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
