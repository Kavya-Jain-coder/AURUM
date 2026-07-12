'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/products';
import { Navbar } from '@/components/ui/Navbar';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);

  // Fix hydration mismatch with persisted Zustand store
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const total = getTotal();
  const deliveryFee = total >= 500000 ? 0 : 50000; // Free above ₹5,000
  const insurance = 50000; // ₹500
  const gst = Math.round(total * 0.03); // 3%
  const grandTotal = total + deliveryFee + insurance + gst;

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-aurum-void pt-20 pb-20">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border border-aurum-gold-dim border-t-aurum-gold animate-spin" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-aurum-void pt-20 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="font-display font-bold italic text-aurum-cream"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              Your Collection
            </h1>
            <p className="font-body text-aurum-ivory-deep text-sm mt-2">
              {items.length} {items.length === 1 ? 'piece' : 'pieces'} selected
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-display italic text-aurum-ivory-mid text-xl mb-6">
                Your collection is empty.
              </p>
              <Link href="/shop" className="btn-gold text-sm px-10 py-3 inline-block">
                Explore the Collection
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 mt-10">
              {/* Cart items */}
              <div className="space-y-0">
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.productId}-${item.material}-${item.stone}-${item.size || ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 py-6 border-b border-aurum-mist"
                  >
                    {/* Item image */}
                    <div className="relative w-24 h-24 bg-aurum-obsidian flex-shrink-0 border border-aurum-mist/20 overflow-hidden">
                      {item.imagePath ? (
                        <Image
                          src={item.imagePath}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg width="40" height="40" viewBox="0 0 40 40" className="opacity-30">
                            <circle cx="20" cy="20" r="10" fill="none" stroke="#C69B3C" strokeWidth="1" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Item details */}
                    <div className="flex-1">
                      <h3 className="font-body text-aurum-ivory text-sm font-medium">
                        {item.name}
                      </h3>
                      <p className="font-body text-aurum-ivory-deep text-xs mt-1">
                        {item.material.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} · {item.stone.replace(/\b\w/g, l => l.toUpperCase())}
                        {item.size && ` · Size ${item.size}`}
                      </p>
                      <p className="font-accent text-aurum-gold-pale text-sm mt-2">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-aurum-mist">
                          <button
                            onClick={() => updateQuantity(item.productId, item.material, item.stone, item.size, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-aurum-ivory-mid hover:text-aurum-cream text-xs"
                          >
                            −
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center font-accent text-aurum-ivory text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.material, item.stone, item.size, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-aurum-ivory-mid hover:text-aurum-cream text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.productId, item.material, item.stone, item.size)}
                          className="font-body text-aurum-ivory-deep text-xs hover:text-aurum-gold transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                      <span className="font-accent text-aurum-ivory text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-aurum-shadow border border-aurum-mist p-6">
                  <h2 className="font-body text-aurum-ivory text-sm font-medium tracking-label uppercase mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-body text-aurum-ivory-mid">Subtotal</span>
                      <span className="font-accent text-aurum-ivory">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-aurum-ivory-mid">Delivery</span>
                      <span className="font-accent text-aurum-ivory">
                        {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-aurum-ivory-mid">Insurance</span>
                      <span className="font-accent text-aurum-ivory">{formatPrice(insurance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-aurum-ivory-mid">GST (3%)</span>
                      <span className="font-accent text-aurum-ivory">{formatPrice(gst)}</span>
                    </div>
                    <div className="border-t border-aurum-mist pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-body text-aurum-cream font-medium">Total</span>
                        <span className="font-accent text-aurum-gold text-lg font-bold">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="btn-gold w-full text-center text-sm py-4 mt-6 block"
                  >
                    Proceed to Checkout
                  </Link>

                  <p className="font-body text-aurum-ivory-deep text-xs text-center mt-4">
                    Free insured delivery on orders above ₹5,000
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
