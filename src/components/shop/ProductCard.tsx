'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice, type Product } from '@/lib/products';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const hasItem = useWishlistStore((s) => s.items.includes(product.id));
  const addToCart = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      material: 'yellow-gold',
      stone: 'diamond',
      imagePath: product.images[0] || '',
      modelPath: product.modelPath,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/shop/product/${product.slug}`}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative bg-aurum-obsidian overflow-hidden group"
        style={{ aspectRatio: '3/4' }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Product image area — gradient placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-32 h-32 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${
                product.collection === 'rings' ? '#E8F0F8' :
                product.collection === 'necklaces' ? '#0D4C3C' :
                product.collection === 'bracelets' ? '#1A3A6B' : '#8B1A2E'
              }22, transparent)`,
            }}
          />
          {/* Gold jewellery silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-30">
              {product.collection === 'rings' && (
                <circle cx="40" cy="40" r="20" fill="none" stroke="#C69B3C" strokeWidth="2" />
              )}
              {product.collection === 'necklaces' && (
                <path d="M15 25 Q40 50 65 25" fill="none" stroke="#C69B3C" strokeWidth="2" />
              )}
              {product.collection === 'bracelets' && (
                <ellipse cx="40" cy="40" rx="25" ry="15" fill="none" stroke="#C69B3C" strokeWidth="2" />
              )}
              {product.collection === 'earrings' && (
                <>
                  <circle cx="28" cy="35" r="8" fill="none" stroke="#C69B3C" strokeWidth="2" />
                  <circle cx="52" cy="35" r="8" fill="none" stroke="#C69B3C" strokeWidth="2" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-10 text-aurum-ivory-deep hover:text-aurum-gold transition-all duration-300"
          aria-label={hasItem ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={hasItem ? '#C69B3C' : 'none'}
            stroke={hasItem ? '#C69B3C' : 'currentColor'}
            strokeWidth="1.5"
            animate={hasItem ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </motion.svg>
        </button>

        {/* New badge */}
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-aurum-gold text-aurum-void text-[10px] font-accent font-bold px-2 py-1 tracking-label uppercase">
            New
          </span>
        )}

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-aurum-obsidian/90 to-transparent">
          <h3 className="font-body text-aurum-ivory text-sm font-medium">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="font-accent text-aurum-gold-pale text-sm">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-aurum-gold text-xs">★</span>
              <span className="font-accent text-aurum-ivory-deep text-xs">
                {product.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Add button — slides up on hover */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: hovered ? 0 : '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 right-0"
        >
          <button
            onClick={handleQuickAdd}
            className="w-full py-3 bg-aurum-gold text-aurum-void font-body text-xs font-medium tracking-label uppercase transition-colors duration-300 hover:bg-aurum-gold-glow"
          >
            Quick Add
          </button>
        </motion.div>
      </motion.div>
    </Link>
  );
}
