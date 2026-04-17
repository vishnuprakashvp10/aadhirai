'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Shield, Lock } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', pincode: '', notes: '',
  });

  const shipping = total >= 5000 ? 0 : 299;
  const grandTotal = total + shipping;

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);

    try {
      // Create Razorpay order
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          items,
          customer: form,
          shipping_cost: shipping,
        }),
      });
      const { orderId, razorpayOrderId, error } = await res.json();
      if (error) throw new Error(error);

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      await new Promise<void>((resolve) => { script.onload = () => resolve(); });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: 'INR',
        name: 'Aadhirai',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#053726' },
        handler: async (response: any) => {
          // Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            router.push(`/order-confirmation?order=${orderId}`);
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: { ondismiss: () => { setLoading(false); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.replace('/cart');
    return null;
  }

  const inputClass = "w-full border border-stone-200 px-4 py-3 font-body text-sm outline-none focus:border-forest-900 transition-colors rounded-sm placeholder:text-stone-300";

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-forest-900 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl text-white font-semibold">Checkout</h1>
          <div className="flex items-center gap-2 mt-2">
            <Lock size={12} className="text-gold-400" />
            <span className="font-body text-white/50 text-xs">Secure Checkout · Powered by Razorpay</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact */}
            <div>
              <h2 className="font-display text-xl font-semibold text-forest-900 mb-5 pb-3 border-b border-stone-100">
                Contact Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Full Name *</label>
                  <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Email *</label>
                  <input className={inputClass} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Phone *</label>
                  <input className={inputClass} type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h2 className="font-display text-xl font-semibold text-forest-900 mb-5 pb-3 border-b border-stone-100">
                Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Address Line 1 *</label>
                  <input className={inputClass} value={form.line1} onChange={(e) => update('line1', e.target.value)} placeholder="House no, Street name" />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Address Line 2</label>
                  <input className={inputClass} value={form.line2} onChange={(e) => update('line2', e.target.value)} placeholder="Apartment, landmark (optional)" />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">City *</label>
                  <input className={inputClass} value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Chennai" />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">State *</label>
                  <input className={inputClass} value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="Tamil Nadu" />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Pincode *</label>
                  <input className={inputClass} value={form.pincode} onChange={(e) => update('pincode', e.target.value)} placeholder="600001" maxLength={6} />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Country</label>
                  <input className={inputClass} value="India" readOnly />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Order Notes</label>
                  <textarea className={`${inputClass} resize-none`} rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Any special instructions for packaging or delivery..." />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-stone-50 p-6 rounded-sm sticky top-32">
              <h2 className="font-display text-xl font-semibold text-forest-900 mb-5 pb-4 border-b border-stone-200">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 items-start">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-stone-100 rounded-sm overflow-hidden">
                      {product.images?.[0] && <Image src={product.images[0]} alt="" fill className="object-cover" sizes="48px" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-forest-900 font-medium line-clamp-2 leading-snug">{product.name}</p>
                      <p className="font-body text-xs text-stone-400 mt-0.5">Qty: {quantity}</p>
                    </div>
                    <span className="font-body text-sm font-medium text-forest-900 flex-shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-stone-200 mb-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-stone-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="flex justify-between font-display text-xl font-semibold text-forest-900 pt-3 border-t border-stone-200 mb-6">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase py-4 hover:bg-gold-500 hover:text-forest-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Shield size={14} />
                    Pay {formatPrice(grandTotal)} Securely
                  </>
                )}
              </button>

              <p className="font-body text-[10px] text-stone-400 text-center mt-3">
                By placing order, you agree to our Terms & Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
