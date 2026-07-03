/**
 * Razorpay Checkout Integration
 *
 * Helpers to create orders via the /api/create-order route and
 * open the Razorpay checkout modal.  Works in "demo mode" with
 * mock order IDs when RAZORPAY_KEY_ID is a placeholder.
 */

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key_id';

// ---------------------------------------------------------------------------
// 1. Create an order on the server
// ---------------------------------------------------------------------------
export async function createOrder(amountInPaise: number) {
  const res = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountInPaise }),
  });

  if (!res.ok) {
    throw new Error('Failed to create order');
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Order creation failed');
  }

  return data.order;
}

// ---------------------------------------------------------------------------
// 2. Dynamically load the Razorpay checkout script
// ---------------------------------------------------------------------------
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Skip if already loaded
    if (typeof (window as unknown as Record<string, unknown>).Razorpay !== 'undefined') {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// 3. Open the Razorpay checkout modal
// ---------------------------------------------------------------------------
export interface RazorpayCheckoutOptions {
  orderId: string;
  amount: number;          // in paise
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: Record<string, unknown>) => void;
}

export async function openRazorpayCheckout(opts: RazorpayCheckoutOptions) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error('Razorpay SDK failed to load');
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: opts.amount,
    currency: 'INR',
    name: 'AURUM',
    description: 'Luxury Jewellery',
    order_id: opts.orderId,
    handler: opts.onSuccess,
    prefill: {
      name: opts.customerName,
      email: opts.customerEmail,
      contact: opts.customerPhone,
    },
    theme: {
      color: '#C69B3C',
    },
    modal: {
      ondismiss: () => {
        opts.onFailure?.({ description: 'Payment cancelled by user' });
      },
    },
  };

  const RazorpayConstructor = (window as unknown as Record<string, unknown>).Razorpay as new (options: Record<string, unknown>) => { open: () => void; on: (event: string, handler: (response: Record<string, Record<string, unknown>>) => void) => void };
  const rzp = new RazorpayConstructor(options);
  rzp.on('payment.failed', (response: Record<string, Record<string, unknown>>) => {
    opts.onFailure?.(response.error);
  });
  rzp.open();
}
