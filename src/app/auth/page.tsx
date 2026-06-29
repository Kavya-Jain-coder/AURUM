'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AurumCursor } from '@/components/ui/AurumCursor';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleMagicLink = () => {
    if (email) setSent(true);
  };

  return (
    <>
      <AurumCursor />

      <main className="min-h-screen bg-aurum-void flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-aurum-shadow border border-aurum-gold-dim max-w-[800px] w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        >
          {/* Left — illustration side */}
          <div className="bg-aurum-obsidian p-8 flex flex-col items-center justify-center min-h-[300px]">
            {/* Ring silhouette with glow */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border border-aurum-gold-dim flex items-center justify-center">
                <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-60">
                  <circle cx="30" cy="30" r="15" fill="none" stroke="#C69B3C" strokeWidth="2" />
                  <circle cx="30" cy="15" r="5" fill="none" stroke="#E8F0F8" strokeWidth="1" />
                </svg>
              </div>
              {/* Gold glow */}
              <div className="absolute inset-0 rounded-full bg-aurum-gold/5 blur-2xl" />
            </div>
            <p className="font-display italic text-aurum-gold text-lg mt-6 text-center">
              Your collection awaits.
            </p>
          </div>

          {/* Right — form side */}
          <div className="p-8">
            {/* Logo */}
            <Link href="/">
              <h1 className="font-display font-bold italic text-aurum-gold text-xl" style={{ letterSpacing: '0.2em' }}>
                AURUM
              </h1>
            </Link>

            <h2 className="font-display font-bold italic text-aurum-cream text-2xl mt-6 mb-2">
              Sign in to AURUM
            </h2>
            <p className="font-body text-aurum-ivory-deep text-sm mb-8">
              To place an order, save pieces to your wishlist, or track a delivery.
            </p>

            {/* Google OAuth */}
            <button className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-body text-sm font-medium py-3 px-4 rounded hover:bg-gray-100 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-aurum-mist" />
              <span className="font-body text-aurum-ivory-deep text-xs">or</span>
              <div className="flex-1 h-[1px] bg-aurum-mist" />
            </div>

            {/* Email magic link */}
            {!sent ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors mb-3"
                  placeholder="Enter your email"
                />
                <button onClick={handleMagicLink} className="btn-gold w-full text-sm py-3">
                  Send magic link
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="font-body text-aurum-ivory-mid text-sm">
                  Check your inbox. We sent a link to <span className="text-aurum-gold-pale">{email}</span>.
                </p>
                <p className="font-body text-aurum-ivory-deep text-xs mt-2">
                  It expires in 15 minutes.
                </p>
              </div>
            )}

            <p className="font-body text-aurum-ivory-deep text-[10px] text-center mt-8">
              By signing in, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
