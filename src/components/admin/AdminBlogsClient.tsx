'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBlogsClient({ blogs: initial }: { blogs: any[] }) {
  const [blogs, setBlogs] = useState(initial);
  const [search, setSearch] = useState('');

  const filtered = blogs.filter((b) =>
    !search || b.title?.toLowerCase().includes(search.toLowerCase())
  );

  const togglePublish = async (id: string, published: boolean) => {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    });
    if (res.ok) {
      setBlogs((prev) => prev.map((b) => b.id === id ? { ...b, published: !published } : b));
      toast.success(`Blog ${!published ? 'published' : 'unpublished'}`);
    }
  };

  const deleteBlog = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success('Blog deleted');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 border border-stone-200 rounded-sm px-3 py-2.5 flex-1 max-w-sm">
          <Search size={14} className="text-stone-400" />
          <input
            placeholder="Search blogs..."
            className="flex-1 font-body text-sm outline-none placeholder:text-stone-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase px-5 py-3 hover:bg-gold-500 hover:text-forest-900 transition-all rounded-sm"
        >
          <Plus size={14} /> New Blog
        </Link>
      </div>

      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {['Title', 'Category', 'Deity', 'Read Time', 'Featured', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-body text-[10px] text-stone-400 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog) => (
                <tr key={blog.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0">
                        {blog.cover_image && <img src={blog.cover_image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <p className="font-body text-sm font-medium text-forest-900 line-clamp-1 max-w-[200px]">{blog.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-body text-xs text-stone-500">{blog.category || '—'}</td>
                  <td className="px-4 py-3.5 font-body text-xs text-stone-500">{blog.deity || '—'}</td>
                  <td className="px-4 py-3.5 font-body text-xs text-stone-500">{blog.read_time} min</td>
                  <td className="px-4 py-3.5">
                    <span className={`font-body text-[10px] px-2 py-0.5 rounded-full ${blog.featured ? 'bg-gold-50 text-gold-600' : 'bg-stone-50 text-stone-400'}`}>
                      {blog.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => togglePublish(blog.id, blog.published)}>
                      {blog.published
                        ? <ToggleRight size={22} className="text-green-500 hover:text-green-600" />
                        : <ToggleLeft size={22} className="text-stone-300 hover:text-stone-400" />
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/blogs/${blog.slug}`} target="_blank" className="p-1.5 hover:bg-stone-100 rounded-sm">
                        <Eye size={13} className="text-stone-400" />
                      </Link>
                      <Link href={`/admin/blogs/new?id=${blog.id}`} className="p-1.5 hover:bg-blue-50 rounded-sm">
                        <Edit size={13} className="text-blue-400" />
                      </Link>
                      <button onClick={() => deleteBlog(blog.id, blog.title)} className="p-1.5 hover:bg-red-50 rounded-sm">
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center font-body text-sm text-stone-400">No blogs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
          <p className="font-body text-xs text-stone-400">{filtered.length} articles</p>
        </div>
      </div>
    </div>
  );
}
