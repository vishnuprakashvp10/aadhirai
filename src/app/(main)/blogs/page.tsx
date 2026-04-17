import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Sacred Blogs — Mythology, Craftsmanship & Devotion',
  description: 'Explore stories of divine deities, ancient sculpting traditions, Vastu guidance, and spiritual insights from Aadhirai\'s sacred blog.',
};

async function getBlogs() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, cover_image, read_time, category, deity, featured, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

const CATEGORIES = ['All', 'Mythology', 'Craftsmanship', 'Vastu', 'Rituals', 'Astrology', 'Care & Maintenance'];

export default async function BlogsPage({ searchParams }: { searchParams: { category?: string } }) {
  const allBlogs = await getBlogs();
  const activeCategory = searchParams.category || 'All';
  const blogs = activeCategory === 'All'
    ? allBlogs
    : allBlogs.filter((b) => b.category === activeCategory);

  const featured = allBlogs.find((b) => b.featured);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-forest-900 pt-10 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='25' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='10' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-accent text-gold-400 text-xs tracking-[0.3em] uppercase">Sacred Insights</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h1 className="font-display text-5xl lg:text-6xl text-white font-semibold mb-3">The Sacred Blog</h1>
          <p className="font-body text-white/50 max-w-xl mx-auto text-sm">
            Mythology, craftsmanship, Vastu wisdom, and devotional guides — stories that deepen your connection with the divine.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featured && (
          <div className="mb-14">
            <Link href={`/blogs/${featured.slug}`} className="group grid md:grid-cols-2 gap-0 border border-stone-100 hover:shadow-xl transition-shadow overflow-hidden rounded-sm">
              <div className="aspect-[4/3] md:aspect-auto relative bg-stone-100 overflow-hidden">
                {featured.cover_image && (
                  <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <span className="absolute top-4 left-4 bg-gold-500 text-forest-900 font-accent text-[9px] tracking-widest uppercase px-3 py-1 font-bold">
                  Featured
                </span>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="font-accent text-xs text-gold-500 tracking-widest uppercase mb-3">{featured.category}</span>
                <h2 className="font-display text-3xl lg:text-4xl text-forest-900 font-semibold leading-tight mb-4 group-hover:text-gold-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="font-body text-sm text-stone-500 leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <Clock size={13} />
                    <span className="font-body text-xs">{featured.read_time} min read</span>
                  </div>
                  <span className="flex items-center gap-1.5 font-accent text-xs text-forest-900 tracking-widest uppercase group-hover:text-gold-500 transition-colors">
                    Read Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === 'All' ? '/blogs' : `/blogs?category=${encodeURIComponent(cat)}`}
              className={`font-accent text-xs tracking-widest uppercase px-4 py-2 border transition-all rounded-sm ${
                activeCategory === cat
                  ? 'bg-forest-900 text-gold-400 border-forest-900'
                  : 'border-stone-200 text-stone-500 hover:border-forest-900 hover:text-forest-900'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-stone-300">No articles in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group block">
                <div className="aspect-[4/3] bg-stone-100 overflow-hidden mb-5 relative rounded-sm">
                  {blog.cover_image && (
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {blog.category && (
                    <span className="absolute top-3 left-3 bg-forest-900/80 backdrop-blur-sm text-gold-400 font-accent text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-sm">
                      {blog.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2.5">
                  <Clock size={12} className="text-stone-300" />
                  <span className="font-body text-xs text-stone-400">{blog.read_time} min read</span>
                  {blog.deity && (
                    <>
                      <span className="text-stone-200">·</span>
                      <span className="font-body text-xs text-gold-500">{blog.deity}</span>
                    </>
                  )}
                </div>
                <h3 className="font-display text-xl text-forest-900 font-semibold mb-2 group-hover:text-gold-600 transition-colors leading-snug">
                  {blog.title}
                </h3>
                <p className="font-body text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 font-accent text-xs text-forest-900 tracking-widest uppercase group-hover:text-gold-500 transition-colors">
                  Read More <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
