'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Mythology', 'Craftsmanship', 'Vastu', 'Rituals', 'Astrology', 'Care & Maintenance', 'History'];

const emptyForm = {
  title: '', slug: '', excerpt: '', content: '',
  cover_image: '', author: 'Aadhirai Team',
  category: 'Mythology', deity: '', tags: '',
  read_time: '5', published: false, featured: false,
  meta_title: '', meta_description: '',
};

export default function AdminBlogFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const isEdit = !!blogId;

  useEffect(() => {
    if (blogId) {
      fetch(`/api/blogs/${blogId}`).then((r) => r.json()).then(({ blog }) => {
        if (blog) setForm({ ...emptyForm, ...blog, read_time: blog.read_time?.toString() || '5', tags: blog.tags?.join(', ') || '' });
      });
    }
  }, [blogId]);

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const autoSlug = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
    update('slug', slug);
    update('title', title);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast.error('Title and slug required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        read_time: parseInt(form.read_time) || 5,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const url = isEdit ? `/api/blogs/${blogId}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? 'Blog updated!' : 'Blog created!');
        router.push('/admin/blogs');
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-stone-200 px-3 py-2.5 font-body text-sm outline-none focus:border-forest-900 transition-colors rounded-sm placeholder:text-stone-300";

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blogs" className="p-2 hover:bg-stone-100 rounded-sm transition-colors">
          <ArrowLeft size={16} className="text-stone-500" />
        </Link>
        <h2 className="font-display text-xl font-semibold text-forest-900">{isEdit ? 'Edit Blog Post' : 'New Blog Post'}</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-stone-100 rounded-sm p-6 space-y-4">
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Title *</label>
              <input className={inputClass} value={form.title} onChange={(e) => autoSlug(e.target.value)} placeholder="e.g. The Divine Significance of Lord Ganesha" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Slug</label>
              <input className={inputClass} value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="auto-generated-from-title" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Excerpt</label>
              <textarea className={`${inputClass} resize-none`} rows={3} value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} placeholder="Short summary shown in blog cards..." />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Content (HTML or plain text)</label>
              <textarea
                className={`${inputClass} resize-none font-mono text-xs`}
                rows={16}
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                placeholder="<h2>Section Title</h2><p>Your content here...</p>"
              />
              <p className="font-body text-[10px] text-stone-400 mt-1">Supports HTML: use &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;</p>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-stone-100 rounded-sm p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-forest-900 pb-3 border-b border-stone-100">SEO</h3>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Meta Title</label>
              <input className={inputClass} value={form.meta_title} onChange={(e) => update('meta_title', e.target.value)} placeholder="Leave blank to use title" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Meta Description</label>
              <textarea className={`${inputClass} resize-none`} rows={2} value={form.meta_description} onChange={(e) => update('meta_description', e.target.value)} placeholder="Leave blank to use excerpt" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-stone-100 rounded-sm p-5 space-y-4">
            <h3 className="font-display text-base font-semibold text-forest-900 pb-3 border-b border-stone-100">Blog Details</h3>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Cover Image URL</label>
              <input className={inputClass} value={form.cover_image} onChange={(e) => update('cover_image', e.target.value)} placeholder="https://..." />
              {form.cover_image && (
                <div className="mt-2 aspect-video bg-stone-100 rounded-sm overflow-hidden">
                  <img src={form.cover_image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Author</label>
              <input className={inputClass} value={form.author} onChange={(e) => update('author', e.target.value)} />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Category</label>
              <select className={inputClass} value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Deity (optional)</label>
              <input className={inputClass} value={form.deity} onChange={(e) => update('deity', e.target.value)} placeholder="e.g. Ganesha, Shiva" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Read Time (min)</label>
              <input type="number" className={inputClass} value={form.read_time} onChange={(e) => update('read_time', e.target.value)} />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Tags (comma separated)</label>
              <input className={inputClass} value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="ganesha, mythology, brass" />
            </div>
            <div className="space-y-2.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="accent-forest-900" />
                <span className="font-body text-sm text-stone-600">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="accent-forest-900" />
                <span className="font-body text-sm text-stone-600">Featured Post</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase py-4 hover:bg-gold-500 hover:text-forest-900 transition-all disabled:opacity-50 rounded-sm"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : isEdit ? 'Update Blog' : 'Publish Blog'}
          </button>
        </div>
      </div>
    </div>
  );
}
