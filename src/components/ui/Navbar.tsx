'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUiStore } from '@/store/uiStore';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const isShopMode = pathname !== '/';
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [searchOpen, setSearchOpen] = useState(false);

  // Don't show on scrollytelling homepage unless user has scrolled past chapter 5
  const scrollProgress = useUiStore((s) => s.scrollProgress);
  const showOnHome = scrollProgress > 0.85;

  if (pathname === '/' && !showOnHome) return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: '1px solid rgba(198, 155, 60, 0.1)' }}
    >
      <nav className="flex items-center justify-between h-16 px-6 md:px-12 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link href="/" className="scroll-chapter-content mr-8 flex items-center">
          <div className="relative w-48 h-12 select-none pointer-events-none" style={{ transform: 'scale(3.5)', transformOrigin: 'left center' }}>
            <Image
              src="/images/Aurum_Logo.png"
              alt="AURUM Logo"
              fill
              className="object-contain"
              style={{ filter: 'brightness(1.3) contrast(1.1)', mixBlendMode: 'screen' }}
            />
          </div>
        </Link>

        {/* Center: Nav links (desktop) + Search */}
        <div className="hidden md:flex items-center gap-8">
          {isShopMode && (
            <>
              <Link href="/shop" className="nav-link text-sm tracking-label uppercase font-body">
                Shop
              </Link>
              <Link href="/shop/rings" className="nav-link text-sm tracking-label uppercase font-body">
                Rings
              </Link>
              <Link href="/shop/necklaces" className="nav-link text-sm tracking-label uppercase font-body">
                Necklaces
              </Link>
              <Link href="/shop/bracelets" className="nav-link text-sm tracking-label uppercase font-body">
                Bracelets
              </Link>
              <Link href="/shop/earrings" className="nav-link text-sm tracking-label uppercase font-body">
                Earrings
              </Link>
            </>
          )}
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="scroll-chapter-content relative text-aurum-ivory-mid hover:text-aurum-cream transition-colors duration-300"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          {/* Wishlist */}
          <Link
            href="/account/wishlist"
            className="scroll-chapter-content relative text-aurum-ivory-mid hover:text-aurum-cream transition-colors duration-300"
            aria-label="Wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-aurum-gold text-aurum-void text-[10px] font-accent font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="scroll-chapter-content relative text-aurum-ivory-mid hover:text-aurum-cream transition-colors duration-300"
            aria-label="Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-aurum-gold text-aurum-void text-[10px] font-accent font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/account"
            className="scroll-chapter-content relative text-aurum-ivory-mid hover:text-aurum-cream transition-colors duration-300"
            aria-label="Account"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-aurum-mist"
          >
            <div className="px-6 md:px-12 py-4 max-w-[1600px] mx-auto">
              <input
                type="text"
                placeholder="Search AURUM collection..."
                className="w-full bg-transparent text-aurum-ivory font-body text-base outline-none placeholder:text-aurum-ivory-deep"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
