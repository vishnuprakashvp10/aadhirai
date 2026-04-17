import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = createAdminSupabaseClient();

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        await supabase
          .from('orders')
          .update({ payment_status: 'paid', status: 'confirmed', payment_id: payment.id })
          .eq('razorpay_order_id', payment.order_id);
        break;
      }
      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        await supabase
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelled' })
          .eq('razorpay_order_id', payment.order_id);
        break;
      }
      case 'refund.created': {
        const refund = event.payload.refund.entity;
        await supabase
          .from('orders')
          .update({ payment_status: 'refunded', status: 'refunded' })
          .eq('payment_id', refund.payment_id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
