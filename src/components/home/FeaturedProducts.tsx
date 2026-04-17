import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

async function getFeaturedProducts() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(8);
    return data || [];
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-20 lg:py-28 bg-cream mandala-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-accent text-gold-500 text-xs tracking-[0.3em] uppercase">Curated Picks</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl text-forest-900 font-semibold">
            Featured Sculptures
          </h2>
          <p className="font-body text-stone-500 mt-3 max-w-xl mx-auto">
            Hand-selected by our curators — each a masterpiece of devotion and artistry.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Skeleton placeholders
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-sm overflow-hidden">
                <div className="shimmer aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-4 rounded w-3/4" />
                  <div className="shimmer h-3 rounded w-1/2" />
                  <div className="shimmer h-6 rounded w-1/3" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase px-10 py-4 hover:bg-gold-500 hover:text-forest-900 transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
