'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // @ts-ignore
  const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'admin@aurum.com';

  useEffect(() => {
    if (mounted && status !== 'loading' && !isAdmin) {
      router.push('/auth');
    }
  }, [mounted, status, isAdmin, router]);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-aurum-void flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-aurum-gold-dim border-t-aurum-gold animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Redirecting
  }

  return (
    <div className="min-h-screen bg-aurum-void text-aurum-ivory flex">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 border-r border-aurum-mist bg-aurum-shadow/50 flex flex-col shrink-0">
        {/* Brand/Logo Header */}
        <div className="h-16 flex items-center px-8 border-b border-aurum-mist/50">
          <Link href="/">
            <div className="relative w-48 h-10 select-none pointer-events-none" style={{ transform: 'scale(3.5)', transformOrigin: 'left center' }}>
              <Image
                src="/images/Aurum_Logo.png"
                alt="AURUM Logo"
                fill
                className="object-contain"
                style={{ filter: 'brightness(1.3) contrast(1.1)', mixBlendMode: 'screen' }}
              />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-[9px] font-body tracking-[0.2em] uppercase text-aurum-ivory-deep px-3 mb-3">
            Navigation
          </p>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 text-xs font-body tracking-[0.1em] uppercase text-aurum-cream hover:bg-aurum-gold/5 hover:text-aurum-gold transition-all duration-300"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 px-3 py-2.5 text-xs font-body tracking-[0.1em] uppercase text-aurum-ivory-mid hover:bg-aurum-gold/5 hover:text-aurum-gold transition-all duration-300"
          >
            Add New Product
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-3 px-3 py-2.5 text-xs font-body tracking-[0.1em] uppercase text-aurum-ivory-mid hover:bg-aurum-gold/5 hover:text-aurum-gold transition-all duration-300"
          >
            View Shop
          </Link>
        </nav>

        {/* Admin User Section at Bottom */}
        <div className="p-6 border-t border-aurum-mist/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-aurum-gold/10 flex items-center justify-center text-xs font-accent text-aurum-gold border border-aurum-gold/30">
            {session.user?.name ? session.user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-body font-medium text-aurum-cream truncate">
              {session.user?.name || 'Maison Admin'}
            </p>
            <p className="text-[10px] font-body text-aurum-ivory-deep truncate">
              {session.user?.email}
            </p>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-aurum-mist/50 bg-aurum-shadow/20 flex items-center justify-between px-8 md:px-12 sticky top-0 backdrop-blur-md z-30">
          <h1 className="font-display font-medium text-aurum-cream text-lg italic">
            Maison Dashboard
          </h1>
          <Link
            href="/api/auth/signout"
            onClick={(e) => {
              e.preventDefault();
              const { signOut } = require('next-auth/react');
              signOut({ callbackUrl: '/' });
            }}
            className="text-[10px] font-body tracking-[0.15em] uppercase text-aurum-ivory-deep hover:text-aurum-gold transition-colors duration-300"
          >
            Log Out
          </Link>
        </header>

        {/* Page Inner Content */}
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
