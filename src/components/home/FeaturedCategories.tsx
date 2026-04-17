import Link from 'next/link';

const categories = [
  { name: 'Lord Ganesha', emoji: '🐘', color: 'from-amber-50 to-orange-50', count: '48 statues', href: '/products?category=Lord+Ganesha' },
  { name: 'Lord Shiva', emoji: '🔱', color: 'from-blue-50 to-indigo-50', count: '36 statues', href: '/products?category=Lord+Shiva' },
  { name: 'Goddess Lakshmi', emoji: '🪷', color: 'from-pink-50 to-rose-50', count: '42 statues', href: '/products?category=Goddess+Lakshmi' },
  { name: 'Lord Krishna', emoji: '🪈', color: 'from-teal-50 to-cyan-50', count: '31 statues', href: '/products?category=Lord+Krishna' },
  { name: 'Lord Murugan', emoji: '✨', color: 'from-gold-50 to-yellow-50', count: '28 statues', href: '/products?category=Lord+Murugan' },
  { name: 'Buddha', emoji: '☸️', color: 'from-stone-50 to-zinc-50', count: '22 statues', href: '/products?category=Buddha' },
];

export default function FeaturedCategories() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-accent text-gold-500 text-xs tracking-[0.3em] uppercase">Collections</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl text-forest-900 font-semibold">
            Explore by Deity
          </h2>
          <p className="font-body text-stone-500 mt-3 max-w-xl mx-auto text-base">
            Each divine form embodies unique cosmic energies. Discover the perfect guardian for your sacred space.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group relative bg-gradient-to-br ${cat.color} border border-stone-100 rounded-sm p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-forest-900/5" />

              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-display text-sm font-semibold text-forest-900 leading-tight mb-1">
                {cat.name}
              </h3>
              <p className="font-body text-xs text-stone-400">{cat.count}</p>

              {/* Hover border */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-accent text-xs tracking-widest uppercase text-forest-900 border border-forest-900 px-8 py-3 hover:bg-forest-900 hover:text-white transition-all duration-300"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
