export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: 'rings' | 'necklaces' | 'bracelets' | 'earrings';
  price: number;           // in paise (₹1 = 100 paise)
  description: string;
  story: string;
  modelPath: string;
  images: string[];
  materials: {
    metal: string;
    stone: string;
    weight: string;
    purity: string;
  };
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  metalType?: string;
  metalWeightGrams?: string;
  gemstoneType?: string;
  gemstoneCarat?: string;
  makingCharges?: number;
  gemstoneVariants?: any[];
  baseSize?: number;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceRange: string;
  gemAccent: string;  // CSS color for gemstone accent
}

export const collections: Collection[] = [
  {
    slug: 'rings',
    name: 'THE STELLAR RING',
    tagline: 'Forged from stardust. Set with conflict-free diamonds.',
    description: 'Each Stellar Ring captures the moment a neutron star collision scattered gold across the cosmos. 18–24 karat gold, hand-set with ethically sourced diamonds.',
    priceRange: '₹45,000 – ₹2,50,000',
    gemAccent: '#E8F0F8',
  },
  {
    slug: 'necklaces',
    name: 'THE AURORA NECKLACE',
    tagline: 'The Northern Lights. Captured in 18-carat gold chain.',
    description: 'Inspired by the aurora borealis — light that has traveled 150 million kilometres to reach your skin. Italian-link chains with hand-finished clasps.',
    priceRange: '₹28,000 – ₹1,80,000',
    gemAccent: '#0D4C3C',
  },
  {
    slug: 'bracelets',
    name: 'THE MERIDIAN BRACELET',
    tagline: 'Worn by women who know exactly where they\'re going.',
    description: 'A continuous circle of brilliance. Each Meridian bracelet features 40+ individual stones, channel-set by hand into a seamless gold band.',
    priceRange: '₹18,000 – ₹95,000',
    gemAccent: '#1A3A6B',
  },
  {
    slug: 'earrings',
    name: 'THE SOLSTICE EARRINGS',
    tagline: 'The longest night. The brightest light.',
    description: 'Designed to catch every photon in the room. Solstice studs feature a proprietary light-trap setting that maximises brilliance from every angle.',
    priceRange: '₹12,000 – ₹60,000',
    gemAccent: '#8B1A2E',
  },
];

// Format price from paise to display string
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return '₹' + rupees.toLocaleString('en-IN');
}

// Format EMI
export function formatEmi(paise: number, months: number = 12): string {
  const monthly = Math.round(paise / months / 100);
  return '₹' + monthly.toLocaleString('en-IN') + '/month';
}

export const products: Product[] = [
  // === RINGS ===
  {
    id: 'ring-001',
    name: 'Stellar Solitaire',
    slug: 'stellar-solitaire',
    collection: 'rings',
    price: 14500000,
    description: 'A single diamond, held by six prongs of 22-karat gold. The Stellar Solitaire is our signature piece — minimal, eternal, unforgettable.',
    story: 'Every atom of gold in this ring was forged in a dying star 4.6 billion years ago. A supernova explosion scattered it across the cosmos. It waited — through the formation of our solar system, through the cooling of Earth, through the rise of civilisation — for you.',
    modelPath: '/models/ring-solitaire.glb',
    images: ['/images/ring-solitaire-1.jpg', '/images/ring-solitaire-2.jpg'],
    materials: { metal: 'Yellow Gold', stone: 'Diamond (1.2ct)', weight: '4.8g', purity: '22 Karat' },
    inStock: true,
    rating: 4.9,
    reviewCount: 87,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 'ring-002',
    name: 'Stellar Halo',
    slug: 'stellar-halo',
    collection: 'rings',
    price: 24500000,
    description: 'A radiant centre stone surrounded by a halo of 16 micro-pavé diamonds. The Stellar Halo commands attention from every angle.',
    story: 'This ring carries the memory of the first light — the photons released when the universe cooled enough for atoms to form. Each micro-diamond refracts that ancient light into new spectra.',
    modelPath: '/models/ring-solitaire.glb',
    images: ['/images/ring-halo-1.jpg'],
    materials: { metal: 'White Gold', stone: 'Diamond (1.8ct + Halo)', weight: '5.6g', purity: '18 Karat' },
    inStock: true,
    rating: 4.8,
    reviewCount: 42,
    isNew: true,
    isBestseller: false,
  },
  {
    id: 'ring-003',
    name: 'Stellar Eternity',
    slug: 'stellar-eternity',
    collection: 'rings',
    price: 9500000,
    description: 'A continuous band of channel-set diamonds. No beginning. No end. The Stellar Eternity is a promise made visible.',
    story: 'Like the orbit of a planet around its star — unbroken, inevitable, beautiful. Each diamond in the Eternity band represents a year of the cosmos.',
    modelPath: '/models/ring-solitaire.glb',
    images: ['/images/ring-eternity-1.jpg'],
    materials: { metal: 'Rose Gold', stone: 'Diamond (2.4ct total)', weight: '3.9g', purity: '18 Karat' },
    inStock: true,
    rating: 4.7,
    reviewCount: 63,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 'ring-004',
    name: 'Stellar Ruby',
    slug: 'stellar-ruby',
    collection: 'rings',
    price: 18500000,
    description: 'A blood-red Burmese ruby set in 22-karat gold. The Stellar Ruby is for those who wear their passion on their finger.',
    story: 'Rubies form at the collision of tectonic plates — where immense heat and pressure transform ordinary corundum into something extraordinary. Like you.',
    modelPath: '/models/ring-solitaire.glb',
    images: ['/images/ring-ruby-1.jpg'],
    materials: { metal: 'Yellow Gold', stone: 'Ruby (1.5ct)', weight: '5.2g', purity: '22 Karat' },
    inStock: true,
    rating: 4.9,
    reviewCount: 31,
    isNew: true,
    isBestseller: false,
  },
  // === NECKLACES ===
  {
    id: 'necklace-001',
    name: 'Aurora Chain',
    slug: 'aurora-chain',
    collection: 'necklaces',
    price: 5800000,
    description: 'A delicate Italian-link chain in 18-karat gold. The Aurora Chain catches light like the northern sky — subtle, mesmerising, impossible to ignore.',
    story: 'The Aurora Borealis occurs when solar particles collide with our atmosphere 100km above the Earth. This chain was designed to sit against your collarbone at the same angle the aurora meets the horizon — 23.5 degrees.',
    modelPath: '/models/necklace-chain.glb',
    images: ['/images/necklace-chain-1.jpg'],
    materials: { metal: 'Yellow Gold', stone: 'None', weight: '8.2g', purity: '18 Karat' },
    inStock: true,
    rating: 4.8,
    reviewCount: 112,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 'necklace-002',
    name: 'Aurora Pendant',
    slug: 'aurora-pendant',
    collection: 'necklaces',
    price: 12800000,
    description: 'A teardrop pendant set with a 0.8ct diamond on a fine Italian chain. The Aurora Pendant is elegance distilled to its simplest form.',
    story: 'A single teardrop of light, falling through 150 million kilometres of space to reach your skin. This pendant captures that journey in 18-karat gold.',
    modelPath: '/models/pendant-hero.glb',
    images: ['/images/necklace-pendant-1.jpg'],
    materials: { metal: 'White Gold', stone: 'Diamond (0.8ct)', weight: '6.4g', purity: '18 Karat' },
    inStock: true,
    rating: 4.9,
    reviewCount: 74,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 'necklace-003',
    name: 'Aurora Emerald Drop',
    slug: 'aurora-emerald-drop',
    collection: 'necklaces',
    price: 16500000,
    description: 'A Colombian emerald suspended from a diamond-studded bail. The Emerald Drop is the centrepiece of the Aurora collection.',
    story: 'Emeralds are born in hydrothermal veins — places where superheated water carries dissolved beryllium through cracks in the Earth. This stone traveled 3,000 metres through solid rock to reach the surface.',
    modelPath: '/models/pendant-hero.glb',
    images: ['/images/necklace-emerald-1.jpg'],
    materials: { metal: 'Yellow Gold', stone: 'Emerald (1.2ct)', weight: '7.8g', purity: '22 Karat' },
    inStock: true,
    rating: 4.7,
    reviewCount: 28,
    isNew: true,
    isBestseller: false,
  },
  // === BRACELETS ===
  {
    id: 'bracelet-001',
    name: 'Meridian Tennis',
    slug: 'meridian-tennis',
    collection: 'bracelets',
    price: 8500000,
    description: '42 round-cut diamonds channel-set into an 18-karat gold band. The Meridian Tennis is a continuous circle of brilliance.',
    story: 'The prime meridian divides the world into two hemispheres. This bracelet circles your wrist at the exact point where pulse meets gold — the meridian of the body.',
    modelPath: '/models/bracelet-tennis.glb',
    images: ['/images/bracelet-tennis-1.jpg'],
    materials: { metal: 'White Gold', stone: 'Diamond (3.6ct total)', weight: '12.4g', purity: '18 Karat' },
    inStock: true,
    rating: 4.8,
    reviewCount: 56,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 'bracelet-002',
    name: 'Meridian Cuff',
    slug: 'meridian-cuff',
    collection: 'bracelets',
    price: 4500000,
    description: 'A slim 18-karat gold cuff with a satin finish. The Meridian Cuff is understated power — felt before it is seen.',
    story: 'The equatorial circumference of the Earth is 40,075 kilometres. This cuff circumference is 165mm. Both are perfect circles on imperfect worlds.',
    modelPath: '/models/bracelet-tennis.glb',
    images: ['/images/bracelet-cuff-1.jpg'],
    materials: { metal: 'Yellow Gold', stone: 'None', weight: '18.6g', purity: '18 Karat' },
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 'bracelet-003',
    name: 'Meridian Sapphire Line',
    slug: 'meridian-sapphire-line',
    collection: 'bracelets',
    price: 9500000,
    description: 'Alternating sapphires and diamonds in an 18-karat white gold setting. The Sapphire Line is the ocean meeting the stars.',
    story: 'The deepest blue sapphires form at depths where the Earth\'s crust begins to melt — the twilight zone between solid and liquid, between planet and magma.',
    modelPath: '/models/bracelet-tennis.glb',
    images: ['/images/bracelet-sapphire-1.jpg'],
    materials: { metal: 'White Gold', stone: 'Sapphire & Diamond', weight: '14.2g', purity: '18 Karat' },
    inStock: true,
    rating: 4.9,
    reviewCount: 19,
    isNew: true,
    isBestseller: false,
  },
  // === EARRINGS ===
  {
    id: 'earring-001',
    name: 'Solstice Studs',
    slug: 'solstice-studs',
    collection: 'earrings',
    price: 2800000,
    description: 'Classic diamond studs in a proprietary light-trap setting. The Solstice Studs maximise brilliance from every angle.',
    story: 'On the summer solstice, the sun hangs at its highest point for what feels like an eternity. These studs are designed to hold light the same way — catching it, trapping it, refusing to let it leave.',
    modelPath: '/models/earrings-studs.glb',
    images: ['/images/earring-studs-1.jpg'],
    materials: { metal: 'Yellow Gold', stone: 'Diamond (0.5ct each)', weight: '2.4g', purity: '18 Karat' },
    inStock: true,
    rating: 4.8,
    reviewCount: 134,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 'earring-002',
    name: 'Solstice Drops',
    slug: 'solstice-drops',
    collection: 'earrings',
    price: 4200000,
    description: 'Cascading drops of gold and diamond. The Solstice Drops move with you — each step releases a new angle of light.',
    story: 'The winter solstice is the longest night. But it is also the moment the light begins its return. These drops are designed to move like light returning — falling, swinging, brightening.',
    modelPath: '/models/earrings-studs.glb',
    images: ['/images/earring-drops-1.jpg'],
    materials: { metal: 'Rose Gold', stone: 'Diamond (0.8ct total)', weight: '3.8g', purity: '18 Karat' },
    inStock: true,
    rating: 4.7,
    reviewCount: 48,
    isNew: true,
    isBestseller: false,
  },
  {
    id: 'earring-003',
    name: 'Solstice Hoops',
    slug: 'solstice-hoops',
    collection: 'earrings',
    price: 3500000,
    description: 'Slim gold hoops with micro-pavé diamonds along the front face. The Solstice Hoops are the everyday luxury.',
    story: 'The Earth\'s orbit around the sun is not a circle — it is an ellipse. These hoops follow that same geometry, slightly elongated, perfectly imperfect.',
    modelPath: '/models/earrings-studs.glb',
    images: ['/images/earring-hoops-1.jpg'],
    materials: { metal: 'Yellow Gold', stone: 'Diamond (0.4ct total)', weight: '4.2g', purity: '18 Karat' },
    inStock: true,
    rating: 4.9,
    reviewCount: 96,
    isNew: false,
    isBestseller: true,
  },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collection: string): Product[] {
  return products.filter((p) => p.collection === collection);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getProductsUnderPrice(maxPaise: number): Product[] {
  return products.filter((p) => p.price <= maxPaise);
}
