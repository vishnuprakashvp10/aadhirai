import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    // Update order
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        payment_id: razorpay_payment_id,
      })
      .eq('id', orderId)
      .select('*, customer_id')
      .single();

    if (error) throw error;

    // Update customer stats
    if (order?.customer_id) {
      await supabase.rpc('increment_customer_stats', {
        cid: order.customer_id,
        amount: order.total,
      }).catch(() => {}); // graceful fail if RPC not set up
    }

    // Reduce stock
    const items = order.items as any[];
    for (const item of items) {
      await supabase
        .from('products')
        .update({ stock_quantity: supabase.rpc('decrement', { x: item.quantity }) as any })
        .eq('id', item.product_id);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
