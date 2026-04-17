'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { formatPrice, getDiscountPercent } from '@/utils';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card group bg-white border border-stone-100 overflow-hidden rounded-sm relative">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-stone-50">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-stone-100">🏛️</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.compare_price && (
            <span className="bg-red-500 text-white font-body text-[10px] px-2 py-0.5 font-semibold">
              -{getDiscountPercent(product.price, product.compare_price)}%
            </span>
          )}
          {product.featured && (
            <span className="bg-gold-500 text-forest-900 font-accent text-[10px] px-2 py-0.5 tracking-wide">
              Featured
            </span>
          )}
        </div>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="font-accent text-xs tracking-widest uppercase text-stone-400">Sold Out</span>
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-forest-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="bg-white text-forest-900 p-2.5 rounded-full hover:bg-gold-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={16} />
          </Link>
          {product.in_stock && (
            <button
              onClick={(e) => { e.preventDefault(); addItem(product); }}
              className="bg-forest-900 text-gold-400 p-2.5 rounded-full hover:bg-gold-500 hover:text-forest-900 transition-colors"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <p className="font-body text-[10px] text-gold-600 tracking-widest uppercase mb-1">{product.category}</p>
          <h3 className="font-display text-base font-semibold text-forest-900 leading-snug mb-2 hover:text-gold-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.floor(product.rating) ? 'text-gold-500 fill-gold-500' : 'text-stone-200 fill-stone-200'}
                />
              ))}
            </div>
            <span className="font-body text-[10px] text-stone-400">({product.review_count})</span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-xl font-semibold text-forest-900">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="font-body text-xs text-stone-400 line-through ml-2">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          {product.in_stock && (
            <button
              onClick={() => addItem(product)}
              className="bg-forest-900 text-gold-400 p-2 hover:bg-gold-500 hover:text-forest-900 transition-all rounded-sm"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>

        {/* Material tag */}
        <div className="mt-3 pt-3 border-t border-stone-50">
          <span className="font-body text-[10px] text-stone-400">{product.material} · {product.height_cm}cm</span>
        </div>
      </div>
    </div>
  );
}
