import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { generateOrderNumber } from '@/utils';

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, items, customer, shipping_cost } = body;

    if (!amount || !items?.length || !customer) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        customer_email: customer.email,
        customer_name: customer.name,
      },
    });

    const supabase = createAdminSupabaseClient();

    // Upsert customer
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .single();

    let customerId = existingCustomer?.id;
    if (!customerId) {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({ email: customer.email, name: customer.name, phone: customer.phone })
        .select('id')
        .single();
      customerId = newCustomer?.id;
    }

    const subtotal = items.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0);

    // Create order in DB
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: generateOrderNumber(),
        customer_id: customerId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: {
          name: customer.name,
          line1: customer.line1,
          line2: customer.line2 || '',
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          country: 'India',
        },
        items: items.map((i: any) => ({
          product_id: i.product.id,
          product_name: i.product.name,
          product_image: i.product.images?.[0] || '',
          price: i.product.price,
          quantity: i.quantity,
        })),
        subtotal,
        shipping_cost,
        tax: 0,
        total: amount,
        status: 'pending',
        payment_status: 'pending',
        razorpay_order_id: razorpayOrder.id,
        notes: customer.notes || '',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
