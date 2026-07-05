import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productsTable } from '@/lib/schema';
import { products as staticProducts } from '@/lib/products';
import { mapDbProductToClient } from '@/lib/db-helpers';
import { getLatestRates, calculateProductPrice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export async function GET() {

  try {
    if (!db) {
      console.log('Database not configured. Falling back to static products.');
      return NextResponse.json({ success: true, products: staticProducts });
    }

    // Fetch products from database
    let dbProducts = await db.select().from(productsTable);
    console.log(`Fetched ${dbProducts.length} products from DB.`);

    // Auto-seed if database is empty
    if (dbProducts.length === 0) {
      console.log('Products table is empty. Seeding initial data...');
      
      const seedData = staticProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        collection: p.collection,
        metalType: '18K Gold',
        metalWeightGrams: '5.000',
        gemstoneType: p.materials.stone.includes('Diamond') ? 'Diamond VS-GH' : 'None',
        gemstoneCarat: p.materials.stone.includes('Diamond') ? '0.500' : null,
        gemstoneVariants: p.collection === 'rings' ? [
          { type: 'Diamond VS-GH', baseCarat: 0.50, color: '#E8F0F8', imagePath: p.images[0] },
          { type: 'Ruby', baseCarat: 0.60, color: '#8B1A2E', imagePath: '/images/ruby-variant.png' },
          { type: 'Sapphire', baseCarat: 0.65, color: '#1A3A6B', imagePath: '/images/sapphire-variant.png' },
          { type: 'Emerald', baseCarat: 0.55, color: '#0D4C3C', imagePath: '/images/emerald-variant.png' },
        ] : null,
        makingCharges: 1500000, // 15000 INR in paise
        baseSize: 7,
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

      await db.insert(productsTable).values(seedData);
      dbProducts = await db.select().from(productsTable);
      console.log(`After seed, fetched ${dbProducts.length} products from DB.`);
    }

    // Fetch latest market rates
    const rates = await getLatestRates();
    console.log(`Fetched rates:`, rates);

    // Compute live prices
    const clientProducts = dbProducts.map(p => {
      const computedPrice = calculateProductPrice({
        metalType: p.metalType,
        metalWeightGrams: p.metalWeightGrams,
        gemstoneType: p.gemstoneType,
        gemstoneCarat: p.gemstoneCarat,
        makingCharges: p.makingCharges,
      }, rates);

      return {
        ...mapDbProductToClient(p),
        price: computedPrice, // Overwrite with dynamic live price
      };
    });

    console.log(`Returning ${clientProducts.length} client products`);
    return NextResponse.json({ success: true, products: clientProducts, rates });
  } catch (error: any) {
    console.error('Error fetching products:', error.message || error);
    // Graceful fallback to static products on error
    return NextResponse.json({ success: true, products: staticProducts, fallback: true, rates: {} });
  }
}
