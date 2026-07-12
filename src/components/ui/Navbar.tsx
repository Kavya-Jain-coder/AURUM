'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUiStore } from '@/store/uiStore';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
export function Navbar() {
  const pathname = usePathname();
  const isShopMode = pathname !== '/';
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const scrollProgress = useUiStore((s) => s.scrollProgress);
  const showOnHome = scrollProgress > 0.85;

  const [ratesList, setRatesList] = useState<{name: string, price: number}[]>([]);
  const [currentRateIndex, setCurrentRateIndex] = useState(0);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/rates/today');
        const data = await res.json();
        if (data.success && data.rates) {
          const formattedRates = Object.entries(data.rates).map(([name, price]) => ({
            name,
            price: (price as number) / 100
          }));
          // Sort to ensure 22K Gold is first
          formattedRates.sort((a, b) => {
            if (a.name === '22K Gold') return -1;
            if (b.name === '22K Gold') return 1;
            return 0;
          });
          setRatesList(formattedRates);
        }
      } catch (e) {
        console.error('Failed to fetch rates ticker', e);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (ratesList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentRateIndex((prev) => (prev + 1) % ratesList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ratesList.length]);

  const currentRate = ratesList[currentRateIndex];

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/' && !showOnHome) return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col drop-shadow-sm"
    >
      {/* Top Banner for Rates */}
      {currentRate && (
        <div className="w-full bg-aurum-void border-b border-aurum-gold/20 flex justify-center items-center py-1.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurum-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-aurum-gold"></span>
            </span>
            <div className="relative flex items-center h-4 w-[280px] justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentRate.name}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute font-body text-[10px] tracking-[0.1em] uppercase text-aurum-ivory-mid whitespace-nowrap"
                >
                  Live Market: {currentRate.name} <span className="text-aurum-gold font-medium">₹{currentRate.price.toLocaleString('en-IN')}{currentRate.name.includes('Diamond') ? '/ct' : '/g'}</span>
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="glass w-full border-b border-aurum-gold/10">
        <div className="flex items-center justify-between h-16 px-6 md:px-12 max-w-[1600px] mx-auto">
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

          <div className="flex items-center gap-6 lg:gap-10">
            {/* Right: Nav links (desktop) + Search */}
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
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="scroll-chapter-content relative text-aurum-ivory-mid hover:text-aurum-cream transition-colors duration-300"
                  aria-label="Account"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {session && (
                    <span className="absolute -top-1 -right-2 w-2.5 h-2.5 rounded-full bg-aurum-gold" />
                  )}
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-10 w-56 bg-aurum-obsidian border border-aurum-mist/50 shadow-xl z-50"
                    >
                      {session ? (
                        <>
                          <div className="px-4 py-3 border-b border-aurum-mist/30">
                            <p className="font-body text-aurum-ivory text-xs truncate">{session.user?.email}</p>
                            <p className="font-body text-aurum-ivory-deep text-[10px] mt-0.5 uppercase tracking-[0.1em]">Signed In</p>
                          </div>
                          {/* @ts-expect-error session user role */}
                          {(session.user?.role === 'admin' || session.user?.email === 'admin@aurum.com') && (
                            <Link
                              href="/admin"
                              onClick={() => setAccountOpen(false)}
                              className="block px-4 py-2.5 font-body text-xs text-aurum-gold hover:bg-aurum-shadow transition-colors"
                            >
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => { signOut({ callbackUrl: '/auth' }); setAccountOpen(false); }}
                            className="w-full text-left px-4 py-2.5 font-body text-xs text-aurum-ruby hover:bg-aurum-shadow transition-colors"
                          >
                            Log Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/auth"
                            onClick={() => setAccountOpen(false)}
                            className="block px-4 py-3 font-body text-xs text-aurum-ivory hover:bg-aurum-shadow transition-colors"
                          >
                            Sign In / Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
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
