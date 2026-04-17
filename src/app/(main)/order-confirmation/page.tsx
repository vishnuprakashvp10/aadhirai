'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Home, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => { setOrder(d.order); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-forest-900 pt-10 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="font-display text-4xl text-white font-semibold mb-3">
            Order Confirmed!
          </h1>
          <p className="font-body text-white/60 text-base">
            Thank you for your purchase. Your divine statue is being carefully prepared.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-16">
        {loading ? (
          <div className="bg-white shadow-lg rounded-sm p-8 text-center">
            <div className="w-8 h-8 border-2 border-forest-900 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : order ? (
          <div className="bg-white shadow-lg rounded-sm overflow-hidden border border-stone-100">
            {/* Order Header */}
            <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-body text-xs text-stone-400 tracking-widest uppercase mb-0.5">Order Number</p>
                <p className="font-accent text-lg text-forest-900 font-bold">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-xs text-stone-400 tracking-widest uppercase mb-0.5">Total Paid</p>
                <p className="font-display text-2xl text-forest-900 font-semibold">{formatPrice(order.total)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-stone-100">
              <h3 className="font-display text-base font-semibold text-forest-900 mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {(order.items as any[]).map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-50 rounded-sm overflow-hidden flex-shrink-0">
                      {item.product_image && (
                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-forest-900 font-medium line-clamp-1">{item.product_name}</p>
                      <p className="font-body text-xs text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-body text-sm font-medium text-forest-900 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 border-b border-stone-100">
              <h3 className="font-display text-base font-semibold text-forest-900 mb-3">Shipping To</h3>
              <div className="flex items-start gap-3">
                <Home size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <div className="font-body text-sm text-stone-500 leading-relaxed">
                  <p className="text-forest-900 font-medium">{order.shipping_address.name}</p>
                  <p>{order.shipping_address.line1}</p>
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.state} – {order.shipping_address.pincode}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="p-6 border-b border-stone-100">
              <h3 className="font-display text-base font-semibold text-forest-900 mb-4">What Happens Next</h3>
              <div className="space-y-4">
                {[
                  { Icon: CheckCircle, label: 'Order Confirmed', desc: 'Payment received', done: true },
                  { Icon: Package, label: 'Packing', desc: 'Carefully packed with temple cotton', done: false },
                  { Icon: Truck, label: 'Shipped', desc: 'Estimated 5–7 business days', done: false },
                  { Icon: Home, label: 'Delivered', desc: 'At your doorstep', done: false },
                ].map(({ Icon, label, desc, done }, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-500' : 'bg-stone-100'}`}>
                      <Icon size={16} className={done ? 'text-white' : 'text-stone-300'} />
                    </div>
                    <div>
                      <p className={`font-body text-sm font-medium ${done ? 'text-forest-900' : 'text-stone-400'}`}>{label}</p>
                      <p className="font-body text-xs text-stone-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation email note */}
            <div className="p-6 bg-gold-50">
              <p className="font-body text-sm text-stone-600">
                A confirmation email has been sent to <strong className="text-forest-900">{order.customer_email}</strong>. 
                Your Prana Pratishtha guide will be included in the package.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-sm p-8 text-center">
            <p className="font-body text-stone-400">Order details not found.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link href="/products" className="btn-primary flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight size={14} />
          </Link>
          <Link href="/" className="btn-outline flex items-center justify-center gap-2">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
