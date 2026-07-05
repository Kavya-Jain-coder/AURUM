/**
 * DB Helper functions for mapping database objects to client-facing interfaces
 */

export function mapDbProductToClient(dbProd: any) {
  return {
    id: dbProd.id,
    name: dbProd.name,
    slug: dbProd.slug,
    collection: dbProd.collection,
    price: dbProd.price,
    description: dbProd.description || '',
    story: dbProd.story || '',
    modelPath: dbProd.modelPath || '',
    images: dbProd.imagePath ? [dbProd.imagePath] : [],
    materials: {
      metal: dbProd.materialsMetal || '',
      stone: dbProd.materialsStone || '',
      weight: dbProd.materialsWeight || '',
      purity: dbProd.materialsPurity || '',
    },
    inStock: dbProd.inStock,
    rating: Number(dbProd.rating),
    reviewCount: dbProd.reviewCount,
    isNew: dbProd.isNew,
    isBestseller: dbProd.isBestseller,
    metalType: dbProd.metalType,
    metalWeightGrams: dbProd.metalWeightGrams,
    gemstoneType: dbProd.gemstoneType,
    gemstoneCarat: dbProd.gemstoneCarat,
    makingCharges: dbProd.makingCharges,
    gemstoneVariants: dbProd.gemstoneVariants,
    baseSize: dbProd.baseSize,
  };
}
