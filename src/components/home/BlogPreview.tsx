import Link from 'next/link';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { ArrowRight, Clock } from 'lucide-react';

async function getBlogs() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, cover_image, read_time, category, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);
    return data || [];
  } catch {
    return [];
  }
}

export default async function BlogPreview() {
  const blogs = await getBlogs();

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="font-accent text-gold-500 text-xs tracking-[0.3em] uppercase">Sacred Insights</span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-forest-900 font-semibold">
              From the Blog
            </h2>
          </div>
          <Link
            href="/blogs"
            className="font-accent text-xs tracking-widest uppercase text-forest-900 flex items-center gap-2 hover:text-gold-500 transition-colors"
          >
            All Articles <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(blogs.length > 0
            ? blogs
            : Array.from({ length: 3 }, (_, i) => ({
                id: `${i}`,
                title: 'The Sacred Art of Bronze Casting',
                slug: 'sacred-art-bronze-casting',
                excerpt: 'Discover the ancient traditions of South Indian sculptural art.',
                cover_image: `https://images.unsplash.com/photo-1593640408182-31c228d71f27?w=800`,
                read_time: 7,
                category: 'Craftsmanship',
                created_at: new Date().toISOString(),
              }))
          ).map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="group block"
            >
              <div className="aspect-[4/3] bg-stone-100 overflow-hidden mb-5 relative">
                {blog.cover_image && (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-4 left-4 bg-forest-900 text-gold-400 font-accent text-[9px] tracking-widest uppercase px-3 py-1">
                  {blog.category}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <Clock size={12} className="text-stone-400" />
                <span className="font-body text-xs text-stone-400">{blog.read_time} min read</span>
              </div>

              <h3 className="font-display text-xl text-forest-900 font-semibold mb-2 group-hover:text-gold-600 transition-colors leading-snug">
                {blog.title}
              </h3>

              <p className="font-body text-sm text-stone-500 leading-relaxed line-clamp-2">
                {blog.excerpt}
              </p>

              <div className="mt-4 flex items-center gap-2 text-forest-900 font-accent text-xs tracking-widest uppercase group-hover:text-gold-500 transition-colors">
                Read Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
