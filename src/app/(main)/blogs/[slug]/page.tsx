import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from('blogs').select('title, excerpt, meta_title, meta_description, cover_image').eq('slug', params.slug).single();
  if (!data) return { title: 'Article Not Found' };
  return {
    title: data.meta_title || data.title,
    description: data.meta_description || data.excerpt,
    openGraph: { images: data.cover_image ? [data.cover_image] : [] },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const supabase = createAdminSupabaseClient();
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!blog) notFound();

  const { data: related } = await supabase
    .from('blogs')
    .select('id, title, slug, cover_image, read_time, category')
    .eq('published', true)
    .eq('category', blog.category)
    .neq('id', blog.id)
    .limit(3);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] lg:h-[60vh] bg-forest-900 overflow-hidden">
        {blog.cover_image && (
          <>
            <img src={blog.cover_image} alt={blog.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/60 to-forest-900/20" />
          </>
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 font-body text-xs text-white/50 hover:text-gold-400 transition-colors mb-6"
            >
              <ArrowLeft size={13} /> Back to Blog
            </Link>
            {blog.category && (
              <span className="inline-block bg-gold-500 text-forest-900 font-accent text-[9px] tracking-widest uppercase px-3 py-1 mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-tight mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center gap-5 text-white/50">
              <span className="flex items-center gap-1.5 font-body text-xs">
                <Calendar size={12} />
                {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 font-body text-xs">
                <Clock size={12} />
                {blog.read_time} min read
              </span>
              <span className="font-body text-xs">By {blog.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {blog.excerpt && (
              <p className="font-display text-xl text-stone-600 italic leading-relaxed mb-8 pb-8 border-b border-stone-100">
                {blog.excerpt}
              </p>
            )}
            <div
              className="prose-divine"
              dangerouslySetInnerHTML={{ __html: blog.content || '' }}
            />

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="mt-10 pt-8 border-t border-stone-100 flex items-center gap-3 flex-wrap">
                <Tag size={14} className="text-stone-400" />
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="font-body text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-full hover:bg-gold-50 hover:text-gold-600 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 bg-forest-900 p-8 rounded-sm">
              <p className="font-body text-xs text-gold-400 tracking-widest uppercase mb-2">Inspired by this story?</p>
              <h3 className="font-display text-2xl text-white font-semibold mb-3">
                Bring {blog.deity || 'the Divine'} Home
              </h3>
              <p className="font-body text-sm text-white/60 mb-5">
                Explore our handcrafted {blog.deity ? `${blog.deity} statue` : 'divine statue'} collection — each piece a masterwork of sacred art.
              </p>
              <Link
                href={blog.deity ? `/products?category=${encodeURIComponent(blog.deity.includes('Lord') || blog.deity.includes('Goddess') ? blog.deity : `Lord ${blog.deity}`)}` : '/products'}
                className="inline-flex items-center gap-2 bg-gold-500 text-forest-900 font-accent text-xs tracking-widest uppercase px-6 py-3 hover:bg-gold-400 transition-colors"
              >
                View Collection
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              {related && related.length > 0 && (
                <div>
                  <h3 className="font-accent text-xs tracking-widest uppercase text-forest-900 mb-4 pb-2 border-b border-stone-100">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {related.map((post) => (
                      <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0 bg-stone-100 rounded-sm overflow-hidden">
                          {post.cover_image && (
                            <img src={post.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-body text-xs text-forest-900 font-medium line-clamp-2 group-hover:text-gold-600 transition-colors leading-snug">
                            {post.title}
                          </p>
                          <p className="font-body text-[10px] text-stone-400 mt-1">{post.read_time} min</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gold-50 border border-gold-200 p-5 rounded-sm">
                <p className="font-accent text-[9px] tracking-widest uppercase text-gold-600 mb-2">Newsletter</p>
                <p className="font-display text-base text-forest-900 font-semibold mb-3">Sacred Stories Weekly</p>
                <p className="font-body text-xs text-stone-500 mb-4">New articles, mythological insights, and exclusive offers.</p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-gold-300 px-3 py-2 font-body text-xs outline-none focus:border-forest-900 transition-colors rounded-sm mb-2"
                />
                <button className="w-full bg-forest-900 text-gold-400 font-accent text-[10px] tracking-widest uppercase py-2.5 hover:bg-gold-500 hover:text-forest-900 transition-colors rounded-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
