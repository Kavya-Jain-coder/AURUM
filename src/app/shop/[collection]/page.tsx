'use client';

import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCollectionBySlug, getProductsByCollection } from '@/lib/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { Navbar } from '@/components/ui/Navbar';

import { useState, useEffect } from 'react';

export default function CollectionPage() {
  const params = useParams();
  const collectionSlug = params.collection as string;
  const collection = getCollectionBySlug(collectionSlug);

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

  const filteredProducts = (dbProducts.length > 0 ? dbProducts : getProductsByCollection(collectionSlug))
    .filter((p: any) => p.collection === collectionSlug);

  if (!collection) {
    notFound();
  }


  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-aurum-void pt-20">
        {/* Collection Hero */}
        <section className="px-6 md:px-12 py-12 max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase">
              Collection
            </span>
            <h1
              className="font-display font-bold italic text-aurum-cream mt-2"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}
            >
              {collection.name}
            </h1>
            <p className="font-body text-aurum-ivory-mid text-base mt-3 max-w-lg leading-relaxed">
              {collection.description}
            </p>
          </motion.div>
        </section>

        {/* Collection Products Grid */}
        <section className="px-6 md:px-12 pb-20 max-w-[1600px] mx-auto">
          <div
            className="grid gap-[2px]"
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
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-aurum-ivory-deep text-lg">
                No pieces found in this collection.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
