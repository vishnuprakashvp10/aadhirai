'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  const shipping = total >= 5000 ? 0 : 299;
  const tax = Math.round(total * 0.18);
  const grandTotal = total + shipping;

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 px-4">
        <ShoppingBag size={64} className="text-stone-200" />
        <div className="text-center">
          <h2 className="font-display text-3xl text-forest-900 font-semibold mb-2">Your cart is empty</h2>
          <p className="font-body text-stone-400 mb-8">Discover our sacred collection and bring divine energy home.</p>
          <Link href="/products" className="btn-primary">Browse Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-forest-900 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl text-white font-semibold">Your Cart</h1>
          <p className="font-body text-white/50 mt-1 text-sm">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 p-4 border border-stone-100 rounded-sm hover:border-stone-200 transition-colors">
                <div className="relative w-24 h-24 flex-shrink-0 bg-stone-50 rounded-sm overflow-hidden">
                  {product.images?.[0] && (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="96px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[10px] text-gold-500 tracking-widest uppercase mb-0.5">{product.category}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-display text-base font-semibold text-forest-900 hover:text-gold-600 transition-colors line-clamp-2 leading-snug">{product.name}</h3>
                  </Link>
                  <p className="font-body text-xs text-stone-400 mt-1">{product.material}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-stone-200 rounded-sm">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center font-body text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg font-semibold text-forest-900">
                        {formatPrice(product.price * quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-stone-300 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-stone-50 p-6 rounded-sm sticky top-32">
              <h2 className="font-display text-xl text-forest-900 font-semibold mb-5 pb-4 border-b border-stone-200">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="text-forest-900">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-stone-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-forest-900'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="font-body text-xs text-stone-400">
                    Add {formatPrice(5000 - total)} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between font-display text-xl font-semibold text-forest-900 pt-4 border-t border-stone-200 mb-6">
                <span>Total</span>
                <span>{formatPrice(total + shipping)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-3 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase py-4 hover:bg-gold-500 hover:text-forest-900 transition-all"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </Link>

              <div className="mt-4 text-center">
                <Link href="/products" className="font-body text-xs text-stone-400 hover:text-forest-900 transition-colors underline">
                  Continue Shopping
                </Link>
              </div>

              {/* Trust */}
              <div className="mt-5 pt-5 border-t border-stone-200">
                <p className="font-body text-[10px] text-stone-400 text-center mb-3 tracking-wide uppercase">Secure Checkout</p>
                <div className="flex justify-center gap-2">
                  {['Razorpay', 'UPI', 'Cards'].map((m) => (
                    <span key={m} className="font-accent text-[9px] border border-stone-200 px-2 py-0.5 text-stone-400 rounded-sm">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
