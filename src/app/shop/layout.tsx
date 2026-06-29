import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop — AURUM Collection',
  description: 'Browse the complete AURUM collection. Handcrafted gold rings, necklaces, bracelets & earrings set with conflict-free diamonds.',
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
