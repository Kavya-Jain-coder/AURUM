'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlistStore';
import { products, formatPrice } from '@/lib/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { Navbar } from '@/components/ui/Navbar';

type Tab = 'profile' | 'orders' | 'wishlist';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const wishlistItems = useWishlistStore((s) => s.items);

  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

  // Mock orders list
  const mockOrders = [
    {
      id: 'AURUM-2026-00847',
      date: 'June 28, 2026',
      total: 14985000,
      status: 'In Transit',
      items: [
        { name: 'Stellar Solitaire Ring', material: 'Yellow Gold', stone: 'Diamond', price: 14500000, quantity: 1 }
      ]
    }
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-aurum-void pt-20 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="border-b border-aurum-mist pb-8"
          >
            <h1
              className="font-display font-bold italic text-aurum-cream"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              My Account
            </h1>
            <p className="font-body text-aurum-ivory-deep text-sm mt-2">
              Manage your orders, profile, and curated wishlist.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 mt-10">
            {/* Sidebar Tabs */}
            <div className="flex flex-col gap-2">
              {(['profile', 'orders', 'wishlist'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left py-3 px-4 text-xs font-body tracking-label uppercase border transition-all duration-300 ${
                    activeTab === tab
                      ? 'border-aurum-gold text-aurum-gold bg-aurum-gold/5'
                      : 'border-transparent text-aurum-ivory-deep hover:text-aurum-cream'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div>
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 max-w-md"
                >
                  <h2 className="font-body text-aurum-ivory text-sm font-medium tracking-label uppercase">
                    Profile Details
                  </h2>
                  <div>
                    <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">Email Address</label>
                    <input
                      type="text"
                      disabled
                      value="guest.user@aurum.com"
                      className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory-deep font-body text-sm px-4 py-3 outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">Preferred Metal</label>
                    <select className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold">
                      <option>Yellow Gold</option>
                      <option>White Gold</option>
                      <option>Rose Gold</option>
                      <option>Platinum</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="font-body text-aurum-ivory text-sm font-medium tracking-label uppercase mb-4">
                    Order History
                  </h2>
                  {mockOrders.map((order) => (
                    <div key={order.id} className="bg-aurum-shadow border border-aurum-mist p-6 space-y-4">
                      <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-accent border-b border-aurum-mist pb-4">
                        <div>
                          <span className="text-aurum-ivory-deep">Order ID: </span>
                          <span className="text-aurum-gold-pale">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-aurum-ivory-deep">Placed: </span>
                          <span className="text-aurum-ivory">{order.date}</span>
                        </div>
                        <div>
                          <span className="text-aurum-ivory-deep">Status: </span>
                          <span className="text-aurum-gold font-bold">{order.status}</span>
                        </div>
                      </div>

                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <p className="font-body text-aurum-ivory font-medium">{item.name}</p>
                            <p className="font-body text-aurum-ivory-deep text-xs mt-1">{item.material} · {item.stone}</p>
                          </div>
                          <span className="font-accent text-aurum-gold-pale">{formatPrice(item.price)}</span>
                        </div>
                      ))}

                      <div className="border-t border-aurum-mist pt-4 flex justify-between text-sm font-medium">
                        <span className="font-body text-aurum-cream">Total Paid</span>
                        <span className="font-accent text-aurum-gold">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="font-body text-aurum-ivory text-sm font-medium tracking-label uppercase mb-4">
                    My Saved Pieces ({wishlistProducts.length})
                  </h2>

                  {wishlistProducts.length === 0 ? (
                    <p className="font-body text-aurum-ivory-deep text-sm">
                      You haven&apos;t saved any pieces yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
