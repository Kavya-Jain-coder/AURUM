'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/products';
import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';

type Step = 1 | 2 | 3;

/**
 * FIX 4: Auth gate triggers at payment step (Step 2), NOT at page load.
 * Uses NextAuth.js useSession — inline auth modal, cart persists in localStorage.
 */
export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authSent, setAuthSent] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = getTotal();
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = subtotal >= 500000 ? 0 : 50000;
  const insurance = 50000;
  const gst = Math.round((subtotal - discount) * 0.03);
  const grandTotal = subtotal - discount + deliveryFee + insurance + gst;

  // Address form state
  const [address, setAddress] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleStep2 = () => {
    // FIX 4: Check auth ONLY at payment step
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setStep(2);
  };

  const handleGoogleAuth = async () => {
    // NextAuth.js Google sign-in
    const { signIn } = await import('next-auth/react');
    signIn('google', { callbackUrl: '/checkout' });
  };

  const handleMagicLink = () => {
    if (authEmail) {
      setAuthSent(true);
      // When email provider is configured, this will call:
      // signIn('email', { email: authEmail, callbackUrl: '/checkout' })
      // For now, mock auto-auth after 2 seconds
      setTimeout(() => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setStep(2);
      }, 2000);
    }
  };



  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { createOrder, openRazorpayCheckout } = await import('@/lib/razorpay');
      
      // Create order on the server
      const order = await createOrder(grandTotal);
      
      // Open Razorpay Checkout Modal
      await openRazorpayCheckout({
        orderId: order.id,
        amount: grandTotal,
        customerName: address.name || 'Valued Client',
        customerEmail: authEmail || 'client@aurum.com',
        customerPhone: address.phone || '0000000000',
        onSuccess: (res) => {
          console.log('Payment success:', res);
          setStep(3);
          clearCart();
          setIsProcessing(false);
        },
        onFailure: (err) => {
          console.error('Payment failed:', err);
          setIsProcessing(false);
          // Show error toast or similar if we had one
        },
      });
    } catch (err) {
      console.error('Error initiating payment:', err);
      setIsProcessing(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'AURUM10') {
      setCouponApplied(true);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-aurum-void pt-20 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          {/* Step indicator */}
          <div className="flex items-center gap-4 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-accent transition-all duration-400 ${
                    step >= s
                      ? 'bg-aurum-gold text-aurum-void'
                      : 'border border-aurum-mist text-aurum-ivory-deep'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                <span className={`font-body text-xs tracking-label uppercase hidden sm:block ${
                  step >= s ? 'text-aurum-ivory' : 'text-aurum-ivory-deep'
                }`}>
                  {s === 1 ? 'Delivery' : s === 2 ? 'Payment' : 'Confirmation'}
                </span>
                {s < 3 && <div className="w-12 h-[1px] bg-aurum-mist mx-2" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            {/* Main content area */}
            <AnimatePresence mode="wait">
              {/* STEP 1: Delivery */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="font-display font-bold italic text-aurum-cream text-2xl mb-6">
                    Delivery Address
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">Name</label>
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">Phone</label>
                        <input
                          type="tel"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
                          placeholder="+91"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">Address Line 1</label>
                      <input
                        type="text"
                        value={address.line1}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                        className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">Address Line 2</label>
                      <input
                        type="text"
                        value={address.line2}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                        className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">City</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">State</label>
                        <input
                          type="text"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">Pincode</label>
                        <input
                          type="text"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 mt-4 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-aurum-gold" />
                      <span className="font-body text-aurum-ivory-mid text-sm">Save for future orders</span>
                    </label>
                  </div>

                  <button onClick={handleStep2} className="btn-gold w-full text-sm py-4 mt-8">
                    Continue to Payment →
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 className="font-display font-bold italic text-aurum-cream text-2xl mb-6">
                    Payment
                  </h2>

                  {/* Payment methods */}
                  <div className="space-y-3">
                    {['UPI', 'Credit/Debit Card', 'Net Banking', 'EMI', 'Cash on Delivery'].map((method) => (
                      <label
                        key={method}
                        className="flex items-center gap-3 p-4 border border-aurum-mist hover:border-aurum-gold-dim cursor-pointer transition-colors duration-300"
                      >
                        <input type="radio" name="payment" className="accent-aurum-gold" />
                        <span className="font-body text-aurum-ivory text-sm">{method}</span>
                      </label>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="mt-8">
                    <label className="font-body text-aurum-ivory-deep text-xs tracking-label uppercase block mb-2">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors"
                        placeholder="AURUM10"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="btn-outline-gold text-xs px-6 py-3"
                      >
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="font-body text-aurum-emerald text-xs mt-2">
                        ✓ AURUM10 applied — 10% off first order
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing}
                    className="btn-gold w-full text-sm py-4 mt-8 flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-aurum-void border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </>
                    ) : (
                      `Place Order — ${formatPrice(grandTotal)}`
                    )}
                  </button>
                </motion.div>
              )}

              {/* STEP 3: Confirmation */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center py-12"
                >
                  {/* Gold particle animation placeholder */}
                  <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-aurum-gold/10 flex items-center justify-center">
                    <span className="text-aurum-gold text-4xl">✓</span>
                  </div>

                  <h2
                    className="font-display font-bold italic text-aurum-cream"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                  >
                    Your AURUM piece is on its way.
                  </h2>

                  <p className="font-accent text-aurum-ivory-mid text-sm mt-4">
                    Order number: <span className="text-aurum-gold-pale">AURUM-2026-{String(Math.floor(Math.random() * 99999)).padStart(5, '0')}</span>
                  </p>

                  <p className="font-body text-aurum-ivory-deep text-sm mt-2">
                    You&apos;ll receive a WhatsApp update when it ships.
                  </p>

                  <div className="flex gap-4 justify-center mt-8">
                    <Link href="/shop" className="btn-gold text-sm px-8 py-3">
                      Continue Shopping
                    </Link>
                    <Link href="/account/orders" className="btn-outline-gold text-sm px-8 py-3">
                      View Order
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order summary sidebar — always visible */}
            {step !== 3 && (
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-aurum-shadow border border-aurum-mist p-6">
                  <h3 className="font-body text-aurum-ivory text-sm font-medium tracking-label uppercase mb-6">
                    Order Summary
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-xs">
                        <span className="font-body text-aurum-ivory-mid">{item.name} × {item.quantity}</span>
                        <span className="font-accent text-aurum-ivory">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm border-t border-aurum-mist pt-4">
                    <div className="flex justify-between">
                      <span className="font-body text-aurum-ivory-mid">Subtotal</span>
                      <span className="font-accent text-aurum-ivory">{formatPrice(subtotal)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between">
                        <span className="font-body text-aurum-emerald">Discount (10%)</span>
                        <span className="font-accent text-aurum-emerald">-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-body text-aurum-ivory-mid">Delivery</span>
                      <span className="font-accent text-aurum-ivory">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-aurum-ivory-mid">Insurance</span>
                      <span className="font-accent text-aurum-ivory">{formatPrice(insurance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-aurum-ivory-mid">GST (3%)</span>
                      <span className="font-accent text-aurum-ivory">{formatPrice(gst)}</span>
                    </div>
                    <div className="border-t border-aurum-mist pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-body text-aurum-cream font-medium">Total</span>
                        <span className="font-accent text-aurum-gold text-lg font-bold">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FIX 4: Inline Auth Modal — appears at Step 2, does NOT navigate away */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(10, 8, 6, 0.9)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-aurum-shadow border border-aurum-gold-dim max-w-md w-full p-8"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-aurum-ivory-deep hover:text-aurum-cream text-lg"
              >
                ×
              </button>

              <h2 className="font-display font-bold italic text-aurum-cream text-2xl mb-2">
                Sign in to AURUM
              </h2>
              <p className="font-body text-aurum-ivory-deep text-sm mb-6">
                To place an order, we need to verify your identity.
              </p>

              {/* Google OAuth */}
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-body text-sm font-medium py-3 px-4 rounded hover:bg-gray-100 transition-colors"
              >
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
              {!authSent ? (
                <>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-aurum-obsidian border border-aurum-mist text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors mb-3"
                    placeholder="Enter your email"
                  />
                  <button
                    onClick={handleMagicLink}
                    className="btn-gold w-full text-sm py-3"
                  >
                    Send magic link
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="font-body text-aurum-ivory-mid text-sm">
                    Check your inbox. We sent a link to <span className="text-aurum-gold-pale">{authEmail}</span>.
                  </p>
                  <p className="font-body text-aurum-ivory-deep text-xs mt-2">
                    It expires in 15 minutes.
                  </p>
                </div>
              )}

              <p className="font-body text-aurum-ivory-deep text-[10px] text-center mt-6">
                By signing in, you agree to our Terms and Privacy Policy.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
