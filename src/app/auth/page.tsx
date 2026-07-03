'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (type: 'admin' | 'guest') => {
    setLoading(true);
    setError('');
    const credentials = type === 'admin' 
      ? { email: 'admin@aurum.com', password: 'admin123' }
      : { email: 'guest@aurum.com', password: 'guest123' };

    try {
      const res = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (res?.error) {
        setError('Quick login failed');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Quick login error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <main className="min-h-screen bg-aurum-void flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-aurum-gold/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-aurum-shadow/80 backdrop-blur-md border border-aurum-gold-dim/20 p-8 md:p-12 text-center"
      >
        {/* Logo */}
        <Link href="/" className="inline-block mb-10 select-none">
          <div className="relative w-40 h-12">
            <Image
              src="/images/Aurum_Logo.png"
              alt="AURUM Logo"
              fill
              className="object-contain"
              style={{ filter: 'brightness(1.3) contrast(1.1)', mixBlendMode: 'screen' }}
              priority
            />
          </div>
        </Link>

        <h2 className="font-display font-bold italic text-aurum-cream text-2xl mb-2">
          Maison Authentication
        </h2>
        <p className="font-body text-aurum-ivory-deep text-sm mb-8">
          To manage collections, save wishlists, or complete your order.
        </p>

        {error && (
          <div className="bg-aurum-ruby/10 border border-aurum-ruby/30 text-aurum-ivory-deep text-xs py-3 px-4 mb-6">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4 text-left">
          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-4 text-xs font-body font-medium tracking-[0.15em] uppercase mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-aurum-mist/50" />
          <span className="font-body text-aurum-ivory-deep text-xs tracking-wider uppercase">or</span>
          <div className="flex-1 h-[1px] bg-aurum-mist/50" />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-body text-xs font-semibold py-3.5 px-4 tracking-wider uppercase transition-all duration-300 hover:bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" className="mr-1">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Brand Owner / Evaluator Quick Login Actions */}
        <div className="mt-10 pt-8 border-t border-aurum-mist/30">
          <p className="text-[10px] font-body tracking-[0.2em] uppercase text-aurum-gold mb-4">
            Evaluator / Brand Owner Quick Access
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="btn-outline-gold py-3 text-[10px] font-body tracking-[0.1em] uppercase hover:bg-aurum-gold/5"
            >
              Sign In as Admin
            </button>
            <button
              onClick={() => handleQuickLogin('guest')}
              className="btn-outline-gold py-3 text-[10px] font-body tracking-[0.1em] uppercase hover:bg-aurum-gold/5"
            >
              Sign In as Guest
            </button>
          </div>
          <p className="text-[10px] font-body text-aurum-ivory-deep mt-3 text-center">
            Credentials: admin@aurum.com (PW: admin123) | guest@aurum.com (PW: guest123)
          </p>
        </div>
      </motion.div>
    </main>
  );
}
