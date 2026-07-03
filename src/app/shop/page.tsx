'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { products, collections } from '@/lib/products';
import { collectionImages } from '@/lib/images';
import { ProductCard } from '@/components/shop/ProductCard';
import { Navbar } from '@/components/ui/Navbar';

type FilterKey = 'all' | 'rings' | 'necklaces' | 'bracelets' | 'earrings';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get('collection') as FilterKey) || 'all';
  const [activeFilter, setActiveFilter] = useState<FilterKey>(initialFilter);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setDbProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error loading products', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const col = searchParams.get('collection') as FilterKey;
    if (col && ['all', 'rings', 'necklaces', 'bracelets', 'earrings'].includes(col)) {
      setActiveFilter(col);
    }
  }, [searchParams]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All Pieces' },
    { key: 'rings', label: 'Rings' },
    { key: 'necklaces', label: 'Necklaces' },
    { key: 'bracelets', label: 'Bracelets' },
    { key: 'earrings', label: 'Earrings' },
  ];

  const filteredProducts = useMemo(() => {
    const list = dbProducts.length > 0 ? dbProducts : products;
    if (activeFilter === 'all') return list;
    return list.filter((p) => p.collection === activeFilter);
  }, [activeFilter, dbProducts]);

  const activeCollection = activeFilter !== 'all'
    ? collections.find(c => c.slug === activeFilter)
    : null;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-aurum-void">
        {/* ─── HERO SECTION ─── */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-end overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={activeCollection ? collectionImages[activeCollection.slug] : '/images/ring-hero.png'}
              alt={activeCollection?.name || 'AURUM Collection'}
              fill
              className="object-cover object-center"
              priority
              style={{ opacity: 0.35 }}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-aurum-void via-aurum-void/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-aurum-void/50 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-12 md:pb-16">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[11px] font-body tracking-[0.3em] uppercase text-aurum-gold mb-4">
                {activeCollection ? `The ${activeCollection.slug} collection` : 'The AURUM Collection'}
              </p>
              <h1
                className="font-display font-bold italic text-aurum-cream"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                {activeCollection?.name || 'Every Piece Tells a Story'}
              </h1>
              <p className="font-body text-aurum-ivory-mid text-base md:text-lg mt-4 max-w-xl leading-relaxed">
                {activeCollection?.description ||
                  'Handcrafted in 18–24 karat gold with ethically sourced diamonds and gemstones. Each piece is a testament to centuries of artisanship.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── FILTER BAR ─── */}
        <section className="sticky top-16 z-40 border-b border-aurum-mist/50 bg-aurum-void/95 backdrop-blur-xl">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className="relative py-5 px-6 text-[11px] font-body tracking-[0.2em] uppercase transition-colors duration-300 whitespace-nowrap"
                  style={{
                    color: activeFilter === filter.key
                      ? 'var(--aurum-cream)'
                      : 'var(--aurum-ivory-deep)',
                  }}
                >
                  {filter.label}
                  {/* Active underline indicator */}
                  {activeFilter === filter.key && (
                    <motion.div
                      layoutId="filter-underline"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-aurum-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}

              {/* Product Count */}
              <span className="ml-auto text-[11px] font-body tracking-[0.15em] text-aurum-ivory-deep whitespace-nowrap hidden md:block">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
          </div>
        </section>

        {/* ─── PRODUCT GRID ─── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-x-6 gap-y-10"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              }}
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(i * 0.06, 0.5),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32">
              <p className="font-display italic text-aurum-ivory-deep text-2xl">
                No pieces found
              </p>
              <p className="font-body text-aurum-ivory-deep text-sm mt-2">
                Try selecting a different collection.
              </p>
            </div>
          )}
        </section>

        {/* ─── FOOTER SEPARATOR ─── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-aurum-gold-dim/30 to-transparent" />
        </div>

        {/* ─── FOOTER ─── */}
        <footer className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="relative w-24 h-8 mb-4">
                <Image
                  src="/images/Aurum_Logo.png"
                  alt="AURUM"
                  fill
                  className="object-contain"
                  style={{ filter: 'brightness(1.3) contrast(1.1)', mixBlendMode: 'screen' }}
                />
              </div>
              <p className="font-body text-aurum-ivory-deep text-sm leading-relaxed">
                Born from stardust, shaped by master artisans. Every piece carries the weight of 4.6 billion years.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-body tracking-[0.3em] uppercase text-aurum-ivory-mid mb-4">
                Collections
              </h4>
              <ul className="space-y-2">
                {collections.map(c => (
                  <li key={c.slug}>
                    <button
                      onClick={() => setActiveFilter(c.slug as FilterKey)}
                      className="font-body text-aurum-ivory-deep text-sm hover:text-aurum-cream transition-colors"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-body tracking-[0.3em] uppercase text-aurum-ivory-mid mb-4">
                Customer Care
              </h4>
              <ul className="space-y-2 font-body text-aurum-ivory-deep text-sm">
                <li className="hover:text-aurum-cream transition-colors cursor-pointer">Shipping & Returns</li>
                <li className="hover:text-aurum-cream transition-colors cursor-pointer">Ring Size Guide</li>
                <li className="hover:text-aurum-cream transition-colors cursor-pointer">Jewellery Care</li>
                <li className="hover:text-aurum-cream transition-colors cursor-pointer">Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-body tracking-[0.3em] uppercase text-aurum-ivory-mid mb-4">
                The Maison
              </h4>
              <ul className="space-y-2 font-body text-aurum-ivory-deep text-sm">
                <li className="hover:text-aurum-cream transition-colors cursor-pointer">Our Story</li>
                <li className="hover:text-aurum-cream transition-colors cursor-pointer">Craftsmanship</li>
                <li className="hover:text-aurum-cream transition-colors cursor-pointer">Sustainability</li>
                <li className="hover:text-aurum-cream transition-colors cursor-pointer">Press</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-aurum-mist/30 flex items-center justify-between">
            <p className="font-body text-aurum-ivory-deep text-xs">
              © 2025 AURUM. All rights reserved.
            </p>
            <p className="font-body text-aurum-ivory-deep text-xs">
              Crafted with intention.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
