'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useUiStore } from '@/store/uiStore';

/**
 * Loading Screen — gold ring progress indicator with AURUM logo fade-in
 */
export function LoadingScreen() {
  const isLoading = useUiStore((s) => s.isLoading);
  const setIsLoading = useUiStore((s) => s.setIsLoading);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress — deliberately slow for luxury feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 1;
        if (next >= 100) {
          clearInterval(interval);
          // Longer pause at 100% for dramatic effect
          setTimeout(() => setIsLoading(false), 900);
          return 100;
        }
        return next;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [setIsLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-aurum-void"
        >
          {/* Massive background percentage */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.span 
              className="font-display font-bold italic text-aurum-gold opacity-5"
              style={{ fontSize: 'clamp(20rem, 40vw, 40rem)', letterSpacing: '-0.05em', lineHeight: 1 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.05 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              {Math.round(progress)}
            </motion.span>
          </div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
            {/* Logo Reveal */}
            <div className="overflow-hidden pb-2 mb-12 flex justify-center w-full">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative w-80 h-28 select-none pointer-events-none"
              >
                <Image
                  src="/images/Aurum_Logo.png"
                  alt="AURUM Logo"
                  fill
                  className="object-contain"
                  style={{ filter: 'brightness(1.3) contrast(1.1)', mixBlendMode: 'screen', transform: 'scale(3.5)' }}
                  priority
                />
              </motion.div>
            </div>

            {/* Luxury Line Progress */}
            <div className="w-full h-[1px] bg-aurum-gold/10 relative overflow-hidden rounded-full mb-6">
              <motion.div
                className="absolute top-0 left-0 bottom-0 bg-aurum-gold shadow-[0_0_10px_#C69B3C]"
                style={{ width: `${progress}%` }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex justify-between w-full font-accent text-aurum-gold-pale text-[10px] tracking-[0.2em] uppercase"
            >
              <span>Forged in stars</span>
              <span>{Math.round(progress)}%</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
