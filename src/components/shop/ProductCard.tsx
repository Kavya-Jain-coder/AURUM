'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice, type Product } from '@/lib/products';
import { getProductImage } from '@/lib/images';
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

  const productImage = getProductImage(product.collection, product.slug);

  return (
    <Link href={`/shop/product/${product.slug}`}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative"
      >
        {/* Image Container */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: '3/4', backgroundColor: '#0D0B09' }}
        >
          {/* Product Image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              animate={{
                scale: hovered ? 1.08 : 1,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full"
            >
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </motion.div>
          </div>

          {/* Subtle warm gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'radial-gradient(ellipse at center bottom, rgba(198,155,60,0.06), transparent 70%)',
            }}
          />

          {/* Wishlist heart — top right */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-aurum-ivory-mid hover:text-aurum-gold hover:bg-black/60 transition-all duration-300"
            aria-label={hasItem ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <motion.svg
              width="16"
              height="16"
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
            <span className="absolute top-4 left-4 z-10 text-[10px] font-body font-medium tracking-[0.2em] uppercase text-aurum-gold border border-aurum-gold/30 bg-black/50 backdrop-blur-sm px-3 py-1">
              New
            </span>
          )}

          {/* Bestseller badge */}
          {product.isBestseller && !product.isNew && (
            <span className="absolute top-4 left-4 z-10 text-[10px] font-body font-medium tracking-[0.2em] uppercase text-aurum-ivory-mid border border-aurum-ivory-mid/20 bg-black/50 backdrop-blur-sm px-3 py-1">
              Bestseller
            </span>
          )}

          {/* Quick Add — slides up on hover */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: hovered ? 0 : '100%', opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 p-4"
          >
            <button
              onClick={handleQuickAdd}
              className="w-full py-3 text-[11px] font-body font-medium tracking-[0.15em] uppercase bg-aurum-gold text-aurum-void transition-colors duration-300 hover:bg-aurum-gold-glow"
            >
              Add to Bag
            </button>
          </motion.div>
        </div>

        {/* Product Info — clean, below the image */}
        <div className="pt-4 pb-6">
          <p className="text-[10px] font-body tracking-[0.2em] uppercase text-aurum-ivory-deep mb-1">
            {product.collection}
          </p>
          <h3 className="font-display text-aurum-cream text-base font-medium leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-aurum-gold text-sm">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-aurum-gold text-[10px]">★</span>
              <span className="font-body text-aurum-ivory-deep text-xs">
                {product.rating}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
