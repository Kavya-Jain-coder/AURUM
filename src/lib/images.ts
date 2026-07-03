/** Maps product collection slug to a hero product image */
export const collectionImages: Record<string, string> = {
  rings: '/images/ring-hero.png',
  necklaces: '/images/necklace-hero.png',
  bracelets: '/images/bracelet-hero.png',
  earrings: '/images/earrings-hero.png',
};

/** Maps individual product slugs to unique product images for variety */
const productImages: Record<string, string> = {
  // Rings — 4 products
  'stellar-solitaire': '/images/ring-solitaire.png',
  'stellar-halo': '/images/ring-hero.png',
  'stellar-eternity': '/images/ring-eternity.png',
  'stellar-ruby': '/images/ring-solitaire.png',
  // Necklaces — 3 products
  'aurora-chain': '/images/necklace-hero.png',
  'aurora-pendant': '/images/necklace-pendant.png',
  'aurora-emerald-drop': '/images/necklace-pendant.png',
  // Bracelets — 3 products
  'meridian-tennis': '/images/bracelet-tennis.png',
  'meridian-cuff': '/images/bracelet-hero.png',
  'meridian-sapphire-line': '/images/bracelet-tennis.png',
  // Earrings — 3 products
  'solstice-studs': '/images/earrings-hero.png',
  'solstice-drops': '/images/earrings-hero.png',
  'solstice-hoops': '/images/earrings-hero.png',
};

/** Get product image — tries slug-specific first, falls back to collection */
export function getProductImage(collectionOrSlug: string, slug?: string): string {
  // If a slug is provided, try the per-product map first
  if (slug && productImages[slug]) {
    return productImages[slug];
  }
  // If the first arg itself is a slug, try that
  if (productImages[collectionOrSlug]) {
    return productImages[collectionOrSlug];
  }
  // Fallback to collection image
  return collectionImages[collectionOrSlug] || '/images/ring-hero.png';
}
