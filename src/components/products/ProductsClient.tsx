'use client';
import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, Grid2X2, List, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { formatPrice } from '@/utils';

const CATEGORIES = [
  'Lord Ganesha', 'Lord Shiva', 'Goddess Lakshmi', 'Lord Vishnu',
  'Lord Krishna', 'Lord Murugan', 'Goddess Saraswati', 'Lord Hanuman',
  'Goddess Durga', 'Buddha', 'Navagraha', 'Other',
];
const MATERIALS = ['Pure Brass', 'Panchaloha', 'Bronze', 'Marble', 'Makrana Marble', 'Black Granite', 'Marble Composite', 'Resin with Gold Finish'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

interface Props {
  initialProducts: Product[];
  searchParams: Record<string, string>;
}

export default function ProductsClient({ initialProducts, searchParams }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const clearAll = () => router.push(pathname);

  const activeFilters = Object.entries(searchParams).filter(([k, v]) => v && k !== 'sort');

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-forest-900 pt-10 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-accent text-gold-400 text-xs tracking-[0.3em] uppercase">Sacred Sculptures</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h1 className="font-display text-4xl lg:text-6xl text-white font-semibold">
            {searchParams.category || 'All Collections'}
          </h1>
          <p className="font-body text-white/50 mt-3 text-sm">
            {initialProducts.length} sculptures available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 border border-stone-200 px-4 py-2.5 font-body text-sm hover:border-forest-900 transition-colors rounded-sm"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilters.length > 0 && (
                <span className="bg-forest-900 text-gold-400 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Active filter tags */}
            {activeFilters.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 bg-forest-900 text-gold-400 font-body text-xs px-3 py-1.5 rounded-sm"
              >
                {value}
                <button onClick={() => updateFilter(key, null)}>
                  <X size={11} />
                </button>
              </span>
            ))}

            {activeFilters.length > 0 && (
              <button
                onClick={clearAll}
                className="font-body text-xs text-stone-400 hover:text-red-500 transition-colors underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={searchParams.sort || 'newest'}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none border border-stone-200 px-4 py-2.5 font-body text-sm pr-8 outline-none hover:border-forest-900 transition-colors rounded-sm cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
            {/* View toggle */}
            <div className="hidden sm:flex border border-stone-200 rounded-sm overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2.5 ${view === 'grid' ? 'bg-forest-900 text-gold-400' : 'hover:bg-stone-50'} transition-colors`}
              >
                <Grid2X2 size={15} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2.5 ${view === 'list' ? 'bg-forest-900 text-gold-400' : 'hover:bg-stone-50'} transition-colors`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {filtersOpen && (
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-32 space-y-6">
                {/* Category */}
                <div>
                  <h3 className="font-accent text-xs tracking-widest uppercase text-forest-900 mb-3 pb-2 border-b border-stone-100">
                    Deity
                  </h3>
                  <div className="space-y-1.5">
                    {CATEGORIES.map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={searchParams.category === cat}
                          onChange={() => updateFilter('category', cat)}
                          className="accent-forest-900"
                        />
                        <span className={`font-body text-sm ${searchParams.category === cat ? 'text-forest-900 font-semibold' : 'text-stone-500 group-hover:text-forest-900'} transition-colors`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <h3 className="font-accent text-xs tracking-widest uppercase text-forest-900 mb-3 pb-2 border-b border-stone-100">
                    Material
                  </h3>
                  <div className="space-y-1.5">
                    {MATERIALS.map((mat) => (
                      <label key={mat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="material"
                          checked={searchParams.material === mat}
                          onChange={() => updateFilter('material', mat)}
                          className="accent-forest-900"
                        />
                        <span className={`font-body text-sm ${searchParams.material === mat ? 'text-forest-900 font-semibold' : 'text-stone-500 group-hover:text-forest-900'} transition-colors`}>
                          {mat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-accent text-xs tracking-widest uppercase text-forest-900 mb-3 pb-2 border-b border-stone-100">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Under ₹2,000', min: '0', max: '2000' },
                      { label: '₹2,000 – ₹10,000', min: '2000', max: '10000' },
                      { label: '₹10,000 – ₹25,000', min: '10000', max: '25000' },
                      { label: 'Above ₹25,000', min: '25000', max: '999999' },
                    ].map((range) => (
                      <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="price"
                          checked={searchParams.minPrice === range.min && searchParams.maxPrice === range.max}
                          onChange={() => { updateFilter('minPrice', range.min); updateFilter('maxPrice', range.max); }}
                          className="accent-forest-900"
                        />
                        <span className="font-body text-sm text-stone-500 group-hover:text-forest-900 transition-colors">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearAll}
                  className="w-full border border-stone-200 font-body text-sm py-2.5 hover:border-red-300 hover:text-red-500 transition-colors rounded-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile filters row */}
            {filtersOpen && (
              <div className="lg:hidden flex flex-wrap gap-2 mb-6 pb-4 border-b border-stone-100">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', searchParams.category === cat ? null : cat)}
                    className={`font-body text-xs px-3 py-1.5 border rounded-sm transition-colors ${
                      searchParams.category === cat
                        ? 'bg-forest-900 text-gold-400 border-forest-900'
                        : 'border-stone-200 text-stone-600 hover:border-forest-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {initialProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-forest-900 mb-2">No statues found</h3>
                <p className="font-body text-stone-400 text-sm mb-6">Try adjusting your filters</p>
                <button onClick={clearAll} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className={view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : 'space-y-4'
              }>
                {initialProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
