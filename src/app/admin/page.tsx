'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/products';
import { getProductImage } from '@/lib/images';

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error fetching products from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this piece from the collection?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Product successfully deleted');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete product');
      }
    } catch (err) {
      setError('Error connecting to deletion endpoint');
    }
  };

  // Stats calculation
  const totalProducts = products.length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * 12), 0); // Simulated revenue

  return (
    <div className="space-y-10">
      {/* Messages */}
      {error && (
        <div className="bg-aurum-ruby/10 border border-aurum-ruby/30 text-aurum-ivory-deep text-xs py-4 px-6 relative">
          <span>{error}</span>
          <button onClick={() => setError('')} className="absolute right-4 top-4 text-sm">×</button>
        </div>
      )}
      {success && (
        <div className="bg-aurum-emerald/10 border border-aurum-emerald/30 text-aurum-cream text-xs py-4 px-6 relative">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="absolute right-4 top-4 text-sm">×</button>
        </div>
      )}

      {/* ─── STATISTICS OVERVIEW ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-aurum-shadow/50 border border-aurum-mist/80 p-6 flex flex-col justify-between"
        >
          <span className="text-[10px] font-body tracking-[0.2em] uppercase text-aurum-ivory-deep">
            Total Collection Pieces
          </span>
          <span className="font-display font-medium text-4xl text-aurum-gold italic mt-4">
            {totalProducts}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-aurum-shadow/50 border border-aurum-mist/80 p-6 flex flex-col justify-between"
        >
          <span className="text-[10px] font-body tracking-[0.2em] uppercase text-aurum-ivory-deep">
            Simulated Revenue (paise)
          </span>
          <span className="font-display font-medium text-3xl text-aurum-gold italic mt-4">
            {formatPrice(totalRevenue)}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-aurum-shadow/50 border border-aurum-mist/80 p-6 flex flex-col justify-between"
        >
          <span className="text-[10px] font-body tracking-[0.2em] uppercase text-aurum-ivory-deep">
            Maison Account Status
          </span>
          <span className="font-display font-medium text-xl text-aurum-cream mt-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-aurum-gold animate-pulse" />
            Active Merchant
          </span>
        </motion.div>
      </section>

      {/* ─── PRODUCT LIST ─── */}
      <section className="bg-aurum-shadow/30 border border-aurum-mist/50 p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-medium italic text-aurum-cream text-xl">
              Active Catalogue
            </h2>
            <p className="text-xs font-body text-aurum-ivory-deep mt-1">
              Add, modify or archive fine jewellery pieces.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="btn-outline-gold text-[10px] px-6 py-2.5 font-body tracking-[0.15em]"
          >
            Add Piece +
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-aurum-gold-dim border-t-aurum-gold animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-aurum-mist/50">
            <p className="font-display italic text-aurum-ivory-deep text-lg">No pieces found</p>
            <p className="text-xs font-body text-aurum-ivory-deep mt-2">Start by creating the first product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-aurum-mist/80 text-[10px] font-body tracking-[0.15em] uppercase text-aurum-ivory-deep">
                  <th className="py-4 font-medium">Piece</th>
                  <th className="py-4 font-medium">Collection</th>
                  <th className="py-4 font-medium">Price</th>
                  <th className="py-4 font-medium">Details</th>
                  <th className="py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aurum-mist/30">
                {products.map((p) => {
                  const clientImage = getProductImage(p.collection);
                  return (
                    <tr key={p.id} className="text-sm hover:bg-aurum-shadow/40 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-16 bg-aurum-obsidian flex items-center justify-center overflow-hidden shrink-0 border border-aurum-mist/20">
                            <Image
                              src={clientImage}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <span className="font-display font-medium text-aurum-cream text-base block">
                              {p.name}
                            </span>
                            <span className="font-body text-[10px] text-aurum-ivory-deep uppercase block">
                              {p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-body tracking-[0.1em] uppercase text-aurum-ivory-deep">
                        {p.collection}
                      </td>
                      <td className="py-4 font-body text-aurum-gold font-medium">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {p.isNew && (
                            <span className="text-[9px] font-body tracking-[0.1em] uppercase text-aurum-gold border border-aurum-gold/30 bg-aurum-gold/5 px-2 py-0.5">
                              New
                            </span>
                          )}
                          {p.isBestseller && (
                            <span className="text-[9px] font-body tracking-[0.1em] uppercase text-aurum-ivory-mid border border-aurum-ivory-mid/30 bg-aurum-ivory-mid/5 px-2 py-0.5">
                              Bestseller
                            </span>
                          )}
                          {!p.inStock && (
                            <span className="text-[9px] font-body tracking-[0.1em] uppercase text-aurum-ruby border border-aurum-ruby/30 bg-aurum-ruby/5 px-2 py-0.5">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-xs font-body text-aurum-ivory hover:text-aurum-gold transition-colors py-1 px-2.5 border border-aurum-mist/50 hover:border-aurum-gold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs font-body text-aurum-ruby/80 hover:text-aurum-ruby transition-colors py-1 px-2.5 border border-aurum-ruby/10 hover:border-aurum-ruby/40"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
