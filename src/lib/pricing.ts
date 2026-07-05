import { db } from './db';
import { marketRates } from './schema';
import { desc } from 'drizzle-orm';

export interface ProductComposition {
  metalType: string;
  metalWeightGrams: string | number; // Decimal string from DB or number
  gemstoneType: string | null;
  gemstoneCarat: string | number | null;
  makingCharges: number;
}

export interface RatesMap {
  [materialName: string]: number; // rate per unit in paise
}

/**
 * Fetches the most recent market rates from the database.
 * Returns a map of materialName -> ratePerUnit
 */
export async function getLatestRates(): Promise<RatesMap> {
  // Fetch all rates, ordered by effectiveDate descending
  // Since we want the latest for *each* material, we can fetch the recent ones and build a map.
  // Assuming the admin inserts rows daily, we can just grab the last 50 rows which should cover all latest types.
  // For a robust implementation, we'd use a DISTINCT ON (material_name) query, but since drizzle doesn't natively support it easily across all dialects, we'll fetch ordered and keep the first seen.
  
  let allRates = await db.select().from(marketRates).orderBy(desc(marketRates.effectiveDate), desc(marketRates.id)).limit(100);
  
  if (allRates.length === 0) {
    console.log('Market rates table is empty. Seeding initial rates...');
    const defaultRates = [
      { materialType: 'metal', materialName: '22K Gold', ratePerUnit: 1340000 },
      { materialType: 'metal', materialName: '18K Gold', ratePerUnit: 1096000 },
      { materialType: 'gemstone', materialName: 'Diamond VVS-EF', ratePerUnit: 15000000 },
      { materialType: 'gemstone', materialName: 'Diamond VS-GH', ratePerUnit: 11000000 },
      { materialType: 'gemstone', materialName: 'Ruby', ratePerUnit: 20000000 },
      { materialType: 'gemstone', materialName: 'Sapphire', ratePerUnit: 15000000 },
      { materialType: 'gemstone', materialName: 'Emerald', ratePerUnit: 18000000 },
      { materialType: 'metal', materialName: 'Silver 925', ratePerUnit: 12000 },
      { materialType: 'metal', materialName: 'Platinum 950', ratePerUnit: 650000 },
    ];
    await db.insert(marketRates).values(defaultRates);
    allRates = await db.select().from(marketRates).orderBy(desc(marketRates.effectiveDate), desc(marketRates.id)).limit(100);
  }

  const ratesMap: RatesMap = {};
  for (const rate of allRates) {
    if (ratesMap[rate.materialName] === undefined) {
      ratesMap[rate.materialName] = rate.ratePerUnit;
    }
  }
  
  return ratesMap;
}

/**
 * Calculates the live price of a product based on its composition and current rates.
 * Returns the final price in paise (including 3% GST).
 */
export function calculateProductPrice(product: ProductComposition, rates: RatesMap): number {
  let totalPaise = 0;

  // 1. Metal Price
  const metalRate = rates[product.metalType] || 0;
  const metalWeight = typeof product.metalWeightGrams === 'string' ? parseFloat(product.metalWeightGrams) : product.metalWeightGrams;
  totalPaise += metalWeight * metalRate;

  // 2. Gemstone Price
  if (product.gemstoneType && product.gemstoneCarat) {
    const gemstoneRate = rates[product.gemstoneType] || 0;
    const gemstoneCarat = typeof product.gemstoneCarat === 'string' ? parseFloat(product.gemstoneCarat) : product.gemstoneCarat;
    totalPaise += gemstoneCarat * gemstoneRate;
  }

  // 3. Making Charges
  totalPaise += product.makingCharges;

  // 4. GST (3% on jewelry in India)
  const gst = totalPaise * 0.03;
  const finalPrice = Math.round(totalPaise + gst);

  return finalPrice;
}
