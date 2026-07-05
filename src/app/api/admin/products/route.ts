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
      metalType,
      metalWeightGrams,
      gemstoneType,
      gemstoneCarat,
      makingCharges,
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
      modelPath,
    } = body;

    if (!name || !slug || !collection) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = {
      id: Math.random().toString(36).substring(2, 15),
      name,
      slug,
      collection,
      metalType,
      metalWeightGrams: metalWeightGrams.toString(),
      gemstoneType,
      gemstoneCarat: gemstoneCarat ? gemstoneCarat.toString() : null,
      makingCharges,
      description: description || '',
      story: story || '',
      imagePath: imagePath || '/images/ring-hero.png',
      modelPath: modelPath || '/models/ring.glb',
      materialsMetal: materialsMetal || metalType,
      materialsStone: materialsStone || gemstoneType || 'None',
      materialsWeight: materialsWeight || `${metalWeightGrams}g`,
      materialsPurity: materialsPurity || metalType.split(' ')[0],
      inStock: inStock ?? true,
      isNew: isNew ?? true,
      isBestseller: isBestseller ?? false,
    };

    await db.insert(productsTable).values(newProduct);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
