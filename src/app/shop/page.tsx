'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { Navbar } from '@/components/ui/Navbar';
import { AurumCursor } from '@/components/ui/AurumCursor';

type FilterKey = 'all' | 'rings' | 'necklaces' | 'bracelets' | 'earrings' | 'under50k' | 'new';

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'rings', label: 'Rings' },
    { key: 'necklaces', label: 'Necklaces' },
    { key: 'bracelets', label: 'Bracelets' },
    { key: 'earrings', label: 'Earrings' },
    { key: 'under50k', label: 'Under ₹50K' },
    { key: 'new', label: 'New Arrivals' },
  ];

  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case 'rings':
      case 'necklaces':
      case 'bracelets':
      case 'earrings':
        return products.filter((p) => p.collection === activeFilter);
      case 'under50k':
        return products.filter((p) => p.price <= 5000000);
      case 'new':
        return products.filter((p) => p.isNew);
      default:
        return products;
    }
  }, [activeFilter]);

  return (
    <>
      <AurumCursor />
      <Navbar />

      <main className="min-h-screen bg-aurum-void pt-20">
        {/* Hero section */}
        <section className="px-6 md:px-12 py-12 max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase">
              The Collection
            </span>
            <h1
              className="font-display font-bold italic text-aurum-cream mt-2"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}
            >
              Every Piece Has a Story
            </h1>
            <p className="font-body text-aurum-ivory-mid text-base mt-3 max-w-lg leading-relaxed">
              87 pieces across four collections. Handcrafted in 18–24 karat gold with ethically sourced diamonds and gemstones.
            </p>
          </motion.div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-2 mt-8"
          >
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-5 py-2 text-xs font-body tracking-label uppercase rounded-full border transition-all duration-400 ${
                  activeFilter === filter.key
                    ? 'border-aurum-gold text-aurum-gold bg-aurum-gold/5'
                    : 'border-aurum-mist text-aurum-ivory-deep hover:border-aurum-gold-dim hover:text-aurum-ivory-mid'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Product grid */}
        <section className="px-6 md:px-12 pb-20 max-w-[1600px] mx-auto">
          <motion.div
            layout
            className="grid gap-[2px]"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}
          >
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-aurum-ivory-deep text-lg">
                No pieces found in this category.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
