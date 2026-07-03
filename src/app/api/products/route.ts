import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/schema';
import { products as staticProducts } from '@/lib/products';
import { mapDbProductToClient } from '@/lib/db-helpers';

export async function GET() {

  try {
    if (!db) {
      console.log('Database not configured. Falling back to static products.');
      return NextResponse.json({ success: true, products: staticProducts });
    }

    // Fetch products from database
    let dbProducts = await db.select().from(productsTable);

    // Auto-seed if database is empty
    if (dbProducts.length === 0) {
      console.log('Products table is empty. Seeding initial data...');
      
      const seedData = staticProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        collection: p.collection,
        price: p.price,
        description: p.description,
        story: p.story,
        imagePath: p.images[0] || '',
        modelPath: p.modelPath,
        materialsMetal: p.materials.metal,
        materialsStone: p.materials.stone,
        materialsWeight: p.materials.weight,
        materialsPurity: p.materials.purity,
        inStock: p.inStock,
        rating: Math.round(p.rating),
        reviewCount: p.reviewCount,
        isNew: p.isNew,
        isBestseller: p.isBestseller,
      }));

      // Insert all
      for (const row of seedData) {
        await db.insert(productsTable).values(row);
      }

      // Re-fetch
      dbProducts = await db.select().from(productsTable);
    }

    const mapped = dbProducts.map(mapDbProductToClient);
    return NextResponse.json({ success: true, products: mapped });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    // Graceful fallback to static products on error
    return NextResponse.json({ success: true, products: staticProducts, fallback: true });
  }
}
