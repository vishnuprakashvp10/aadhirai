'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Shield, Truck, Award, Star, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getDiscountPercent } from '@/utils';
import { Product, Review } from '@/types';
import ProductCard from './ProductCard';

interface Props {
  product: Product;
  related: Product[];
  reviews: Review[];
}

export default function ProductDetailClient({ product, related, reviews }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');
  const { addItem } = useCart();

  const toggle = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-stone-100">
        <nav className="flex items-center gap-2 font-body text-xs text-stone-400">
          <Link href="/" className="hover:text-forest-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-forest-900 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-forest-900 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-forest-900 truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-stone-50 overflow-hidden mb-4 rounded-sm">
              {product.images?.[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
              {product.compare_price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white font-body text-xs px-3 py-1 font-semibold">
                  -{getDiscountPercent(product.price, product.compare_price)}% OFF
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square relative overflow-hidden rounded-sm border-2 transition-all ${
                      selectedImage === i ? 'border-forest-900' : 'border-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="font-accent text-xs text-gold-500 tracking-[0.25em] uppercase mb-2">{product.category}</p>
            <h1 className="font-display text-3xl lg:text-4xl text-forest-900 font-semibold leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-stone-200 fill-stone-200'} />
                  ))}
                </div>
                <span className="font-body text-sm text-stone-500">{product.rating} · {product.review_count} reviews</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-stone-100">
              <span className="font-display text-4xl text-forest-900 font-semibold">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <>
                  <span className="font-body text-lg text-stone-400 line-through">{formatPrice(product.compare_price)}</span>
                  <span className="bg-green-50 text-green-700 font-body text-sm px-2 py-0.5 rounded">
                    Save {formatPrice(product.compare_price - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Material', value: product.material },
                { label: 'Height', value: `${product.height_cm} cm` },
                { label: 'Weight', value: `${product.weight_kg} kg` },
                { label: 'Finish', value: product.finish },
              ].map(({ label, value }) => value && (
                <div key={label} className="bg-stone-50 p-3 rounded-sm">
                  <p className="font-body text-[10px] text-stone-400 tracking-widest uppercase mb-0.5">{label}</p>
                  <p className="font-body text-sm text-forest-900 font-medium">{value}</p>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="font-body text-sm text-stone-600">Quantity</span>
              <div className="flex items-center border border-stone-200 rounded-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-stone-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-body text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-stone-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="font-body text-xs text-stone-400">{product.stock_quantity} in stock</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => addItem(product, quantity)}
                disabled={!product.in_stock}
                className="flex-1 flex items-center justify-center gap-3 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase py-4 hover:bg-gold-500 hover:text-forest-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                {product.in_stock ? 'Add to Cart' : 'Sold Out'}
              </button>
              <button className="w-12 h-[52px] border border-stone-200 flex items-center justify-center hover:border-red-300 hover:text-red-400 transition-colors rounded-sm">
                <Heart size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-8 py-5 border-y border-stone-100">
              {[
                { Icon: Shield, label: 'Secure Payment' },
                { Icon: Truck, label: 'Free Shipping >₹5K' },
                { Icon: Award, label: 'Authentic Certified' },
              ].map(({ Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon size={18} className="text-forest-900 mx-auto mb-1" />
                  <span className="font-body text-[10px] text-stone-500">{label}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            {[
              {
                id: 'description',
                title: 'Description',
                content: product.description,
              },
              {
                id: 'shipping',
                title: 'Shipping & Returns',
                content: 'Orders above ₹5,000 ship free across India. Standard delivery: 5-7 business days. Express delivery available. Returns accepted within 7 days if the item is damaged during shipping.',
              },
              {
                id: 'care',
                title: 'Care Instructions',
                content: 'Dust regularly with a soft, dry cloth. For deep cleaning, use a mild brass cleaner or tamarind paste. Avoid acidic solutions. Keep away from moisture for marble statues. A Prana Pratishtha guide is included with every purchase.',
              },
            ].map(({ id, title, content }) => (
              <div key={id} className="border-b border-stone-100">
                <button
                  onClick={() => toggle(id)}
                  className="w-full flex items-center justify-between py-4 font-display text-base font-semibold text-forest-900 hover:text-gold-600 transition-colors"
                >
                  {title}
                  {expandedSection === id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === id && (
                  <p className="pb-4 font-body text-sm text-stone-500 leading-relaxed">{content}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-16 pt-12 border-t border-stone-100">
            <h2 className="font-display text-3xl text-forest-900 font-semibold mb-8">Customer Reviews</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-stone-50 p-5 rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-sm font-semibold text-forest-900">{review.customer_name}</span>
                    {review.verified && (
                      <span className="font-body text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded">Verified</span>
                    )}
                  </div>
                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-stone-200 fill-stone-200'} />
                    ))}
                  </div>
                  <p className="font-body text-sm text-stone-500 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-stone-100">
            <h2 className="font-display text-3xl text-forest-900 font-semibold mb-8">From the Same Collection</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
