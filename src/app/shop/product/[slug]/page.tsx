'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductBySlug, formatPrice, formatEmi } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Navbar } from '@/components/ui/Navbar';
import { AurumCursor } from '@/components/ui/AurumCursor';
import Link from 'next/link';

const materials = [
  { key: 'yellow-gold', label: 'Yellow Gold', color: '#C69B3C' },
  { key: 'white-gold', label: 'White Gold', color: '#E8E8E8' },
  { key: 'rose-gold', label: 'Rose Gold', color: '#D4A0A0' },
  { key: 'platinum', label: 'Platinum', color: '#D8D8D8' },
];

const stones = [
  { key: 'diamond', label: 'Diamond', color: '#E8F0F8' },
  { key: 'ruby', label: 'Ruby', color: '#8B1A2E' },
  { key: 'sapphire', label: 'Sapphire', color: '#1A3A6B' },
  { key: 'emerald', label: 'Emerald', color: '#0D4C3C' },
];

const sizes = ['5', '6', '7', '8', '9', '10'];

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-aurum-mist">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-body text-aurum-ivory text-sm tracking-comfortable">
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-aurum-ivory-deep text-lg"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-aurum-ivory-mid text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  const [selectedMaterial, setSelectedMaterial] = useState('yellow-gold');
  const [selectedStone, setSelectedStone] = useState('diamond');
  const [selectedSize, setSelectedSize] = useState('7');
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const hasWishlistItem = useWishlistStore((s) => s.items.includes(product?.id || ''));

  if (!product) {
    return (
      <div className="min-h-screen bg-aurum-void flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-aurum-gold text-4xl italic">Piece not found</h1>
          <Link href="/shop" className="btn-outline-gold mt-6 inline-block text-sm px-8 py-3">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      material: selectedMaterial,
      stone: selectedStone,
      size: selectedSize,
      imagePath: product.images[0] || '',
      modelPath: product.modelPath,
    });
  };

  const collectionName = product.collection.charAt(0).toUpperCase() + product.collection.slice(1);

  return (
    <>
      <AurumCursor />
      <Navbar />

      <main className="min-h-screen bg-aurum-void pt-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-0 min-h-[calc(100vh-5rem)]">
            {/* LEFT — 3D Viewer Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-aurum-obsidian flex items-center justify-center min-h-[50vh] lg:min-h-full"
            >
              {/* Placeholder with jewellery silhouette */}
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-aurum-gold/5 flex items-center justify-center">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-40">
                    <circle cx="60" cy="60" r="30" fill="none" stroke="#C69B3C" strokeWidth="2" />
                    <circle cx="60" cy="30" r="8" fill="none" stroke="#E8F0F8" strokeWidth="1.5" />
                  </svg>
                </div>
                {/* Material color indicator */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full opacity-50 transition-colors duration-400"
                  style={{ background: materials.find(m => m.key === selectedMaterial)?.color }}
                />
              </div>

              {/* Interaction hint */}
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-aurum-ivory-deep text-xs font-body tracking-label uppercase opacity-50">
                Tap and drag to explore
              </p>

              {/* Material selector */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
                {materials.map((mat) => (
                  <button
                    key={mat.key}
                    onClick={() => setSelectedMaterial(mat.key)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      selectedMaterial === mat.key
                        ? 'border-aurum-cream scale-110'
                        : 'border-aurum-mist hover:border-aurum-ivory-deep'
                    }`}
                    style={{ background: mat.color }}
                    title={mat.label}
                  />
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="py-8 lg:py-12 lg:pl-12"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs font-body text-aurum-ivory-deep mb-6">
                <Link href="/shop" className="hover:text-aurum-ivory-mid transition-colors">Collections</Link>
                <span>/</span>
                <Link href={`/shop/${product.collection}`} className="hover:text-aurum-ivory-mid transition-colors">{collectionName}</Link>
                <span>/</span>
                <span className="text-aurum-ivory-mid">{product.name}</span>
              </div>

              {/* Product name */}
              <h1
                className="font-display font-bold italic text-aurum-ivory"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', letterSpacing: '-0.02em' }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4">
                <span className="font-accent text-aurum-gold text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
                <p className="font-body text-aurum-ivory-deep text-sm mt-1">
                  Or {formatEmi(product.price)} with no-cost EMI →
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.round(product.rating) ? 'text-aurum-gold' : 'text-aurum-mist'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-accent text-aurum-ivory-deep text-xs">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Stone selector */}
              <div className="mt-8">
                <label className="font-body text-aurum-ivory-mid text-xs tracking-label uppercase block mb-3">
                  Stone
                </label>
                <div className="flex gap-2">
                  {stones.map((stone) => (
                    <button
                      key={stone.key}
                      onClick={() => setSelectedStone(stone.key)}
                      className={`px-4 py-2 text-xs font-body tracking-comfortable rounded border transition-all duration-300 ${
                        selectedStone === stone.key
                          ? 'border-aurum-gold text-aurum-gold bg-aurum-gold/5'
                          : 'border-aurum-mist text-aurum-ivory-deep hover:border-aurum-gold-dim'
                      }`}
                    >
                      {stone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              {product.collection === 'rings' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-body text-aurum-ivory-mid text-xs tracking-label uppercase">
                      Size
                    </label>
                    <button className="font-body text-aurum-gold-dim text-xs hover:text-aurum-gold transition-colors">
                      Size guide →
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 flex items-center justify-center text-xs font-accent rounded-full border transition-all duration-300 ${
                          selectedSize === size
                            ? 'border-aurum-gold text-aurum-gold bg-aurum-gold/5'
                            : 'border-aurum-mist text-aurum-ivory-deep hover:border-aurum-gold-dim'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6">
                <label className="font-body text-aurum-ivory-mid text-xs tracking-label uppercase block mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-0 border border-aurum-mist inline-flex">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-aurum-ivory-mid hover:text-aurum-cream transition-colors border-r border-aurum-mist"
                  >
                    −
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-accent text-aurum-ivory text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-aurum-ivory-mid hover:text-aurum-cream transition-colors border-l border-aurum-mist"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="btn-gold w-full text-sm py-4"
                  style={{ height: '52px' }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="btn-outline-gold w-full text-sm py-4 flex items-center justify-center gap-2"
                >
                  <span>{hasWishlistItem ? '♥' : '♡'}</span>
                  {hasWishlistItem ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Accordion details */}
              <div className="mt-10">
                <AccordionItem title="The Story" defaultOpen>
                  <p>{product.story}</p>
                </AccordionItem>
                <AccordionItem title="Materials & Craftsmanship">
                  <ul className="space-y-2">
                    <li><span className="text-aurum-ivory-deep">Metal:</span> {product.materials.metal}</li>
                    <li><span className="text-aurum-ivory-deep">Stone:</span> {product.materials.stone}</li>
                    <li><span className="text-aurum-ivory-deep">Weight:</span> {product.materials.weight}</li>
                    <li><span className="text-aurum-ivory-deep">Purity:</span> {product.materials.purity}</li>
                  </ul>
                </AccordionItem>
                <AccordionItem title="Sizing & Fit">
                  <p>Each AURUM ring is handcrafted to your exact size. We recommend visiting a local jeweller for precise measurement, or use our printable ring sizer (available upon request).</p>
                </AccordionItem>
                <AccordionItem title="Delivery & Returns">
                  <p>Free insured delivery on all orders above ₹5,000. Your piece arrives in our signature black velvet box within 7–10 business days. 30-day returns for unworn pieces.</p>
                </AccordionItem>
                <AccordionItem title="Certificate of Authenticity">
                  <p>Every AURUM piece ships with a Certificate of Authenticity, including a unique serial number, gemstone certification (GIA for diamonds), and metal hallmark verification.</p>
                </AccordionItem>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
