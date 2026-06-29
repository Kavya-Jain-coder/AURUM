import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body;

    // Simulated Razorpay Order response
    const mockOrder = {
      id: `order_${Math.random().toString(36).substring(2, 15)}`,
      entity: 'order',
      amount: amount, // in paise
      amount_paid: 0,
      amount_due: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: [],
      created_at: Math.floor(Date.now() / 1000)
    };

    return NextResponse.json({ success: true, order: mockOrder });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
