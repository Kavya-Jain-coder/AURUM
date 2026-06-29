'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const curtainVariants = {
  initial: { scaleY: 0, transformOrigin: 'top' },
  animate: { 
    scaleY: [0, 1, 1, 0],
    transformOrigin: ['top', 'top', 'bottom', 'bottom'],
    transition: { 
      duration: 1.2, 
      times: [0, 0.45, 0.55, 1],
      ease: [0.76, 0, 0.24, 1] 
    }
  }
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="relative">
      <motion.div
        variants={curtainVariants}
        initial="initial"
        animate="animate"
        className="fixed inset-0 z-50 bg-aurum-void pointer-events-none"
      />
      {children}
    </div>
  );
}
