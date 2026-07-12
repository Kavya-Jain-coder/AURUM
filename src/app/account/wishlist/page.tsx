'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/products';
import { getProductImage } from '@/lib/images';
import { Navbar } from '@/components/ui/Navbar';

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  images: string[];
  modelPath: string;
  metalType: string;
  gemstoneType: string;
  rating: number;
  isNew: boolean;
}

export default function WishlistPage() {
  const wishlistIds = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);

  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          const wishlisted = data.products.filter((p: WishlistProduct) =>
            wishlistIds.includes(p.id)
          );
          setProducts(wishlisted);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist products', err);
      } finally {
        setLoading(false);
      }
    };

    if (wishlistIds.length > 0) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [hydrated, wishlistIds]);

  const handleAddToCart = (product: WishlistProduct) => {
    const image = (product.images && product.images.length > 0)
      ? product.images[0]
      : getProductImage(product.collection, product.slug);

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      material: 'yellow-gold',
      stone: product.gemstoneType || 'Diamond VS-GH',
      size: '7',
      imagePath: image,
      modelPath: product.modelPath || '',
    });

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-aurum-void pt-32 pb-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border border-aurum-gold-dim border-t-aurum-gold animate-spin" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-aurum-void pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-aurum-gold" />
              <span className="text-[10px] font-body tracking-[0.25em] uppercase text-aurum-gold">
                Your Favourites
              </span>
            </div>
            <h1
              className="font-display font-bold italic text-aurum-cream"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
            >
              Wishlist
            </h1>
            <p className="font-body text-aurum-ivory-deep text-sm mt-3">
              {wishlistIds.length} {wishlistIds.length === 1 ? 'piece' : 'pieces'} you&apos;ve set your heart on.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border border-aurum-gold-dim border-t-aurum-gold animate-spin" />
            </div>
          ) : wishlistIds.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border border-dashed border-aurum-mist/40"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-aurum-ivory-deep/40 mb-6">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <p className="font-display italic text-aurum-ivory-mid text-xl mb-2">
                Your wishlist is empty
              </p>
              <p className="font-body text-aurum-ivory-deep text-sm mb-10 max-w-md mx-auto">
                Explore our curated collection and save the pieces that speak to you. They&apos;ll be waiting here.
              </p>
              <Link href="/shop" className="btn-outline-gold text-[10px] px-10 py-3 font-body tracking-[0.15em] uppercase">
                Explore the Collection
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-0">
              <AnimatePresence mode="popLayout">
                {products.map((product, i) => {
                  const productImage = (product.images && product.images.length > 0)
                    ? product.images[0]
                    : getProductImage(product.collection, product.slug);

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="group flex flex-col sm:flex-row gap-6 sm:gap-8 py-8 border-b border-aurum-mist/30 hover:bg-aurum-shadow/20 transition-colors duration-300 px-2 sm:px-4 -mx-2 sm:-mx-4"
                    >
                      {/* Image */}
                      <Link href={`/shop/product/${product.slug}`} className="shrink-0">
                        <div className="relative w-full sm:w-44 h-44 bg-aurum-obsidian overflow-hidden border border-aurum-mist/20 group-hover:border-aurum-gold/30 transition-colors duration-500">
                          <Image
                            src={productImage}
                            alt={product.name}
                            fill
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          {product.isNew && (
                            <span className="absolute top-2 left-2 text-[8px] font-body tracking-[0.15em] uppercase text-aurum-gold bg-aurum-gold/10 border border-aurum-gold/30 px-2 py-0.5">
                              New
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="text-[9px] font-body tracking-[0.2em] uppercase text-aurum-ivory-deep mb-1.5">
                            {product.collection}
                          </p>
                          <Link href={`/shop/product/${product.slug}`}>
                            <h3 className="font-display font-medium italic text-aurum-cream text-xl group-hover:text-aurum-gold transition-colors duration-300">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <span key={j} className={`text-[10px] ${j < Math.round(product.rating || 5) ? 'text-aurum-gold' : 'text-aurum-mist'}`}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <span className="font-accent text-aurum-gold text-lg font-bold">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 sm:w-48">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full text-[10px] py-3 font-body tracking-[0.12em] uppercase transition-all duration-300 ${
                            addedId === product.id
                              ? 'bg-aurum-emerald/90 text-aurum-cream border border-aurum-emerald'
                              : 'btn-gold'
                          }`}
                        >
                          {addedId === product.id ? '✓ Added to Cart' : 'Move to Cart'}
                        </button>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="w-full text-[10px] py-3 font-body tracking-[0.12em] uppercase text-aurum-ivory-deep hover:text-aurum-ruby border border-aurum-mist/30 hover:border-aurum-ruby/40 transition-all duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <Link
                  href="/shop"
                  className="font-body text-aurum-ivory-deep text-xs hover:text-aurum-gold transition-colors tracking-[0.1em] uppercase flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
