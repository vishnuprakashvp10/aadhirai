'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const CATEGORIES = ['Lord Ganesha','Lord Shiva','Goddess Lakshmi','Lord Vishnu','Lord Krishna','Lord Murugan','Goddess Saraswati','Lord Hanuman','Goddess Durga','Buddha','Navagraha','Other'];
const MATERIALS = ['Pure Brass','Panchaloha','Bronze','Marble','Makrana Marble','Black Granite','Marble Composite','Resin with Gold Finish','Stone'];
const FINISHES = ['Antique Gold','Gold Polish','Dark Bronze Patina','Bronze Patina','Natural White','White & Gold','Matte Black','Antique Brass','Antique Finish'];

const emptyForm = {
  name: '', slug: '', short_description: '', description: '',
  price: '', compare_price: '', category: 'Lord Ganesha',
  material: 'Pure Brass', finish: '', deity: '',
  height_cm: '', weight_kg: '', stock_quantity: '',
  in_stock: true, featured: false,
  images: [] as string[], tags: '',
  meta_title: '', meta_description: '',
};

export default function AdminProductFormClient({ productId }: { productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const isEdit = !!productId;

  useEffect(() => {
    if (productId) {
      fetch(`/api/products/${productId}`).then((r) => r.json()).then(({ product }) => {
        if (product) {
          setForm({
            ...emptyForm,
            ...product,
            price: product.price?.toString() || '',
            compare_price: product.compare_price?.toString() || '',
            height_cm: product.height_cm?.toString() || '',
            weight_kg: product.weight_kg?.toString() || '',
            stock_quantity: product.stock_quantity?.toString() || '',
            tags: product.tags?.join(', ') || '',
          });
        }
      });
    }
  }, [productId]);

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const autoSlug = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    update('slug', slug);
    update('name', name);
  };

  const addImage = () => {
    if (imageUrl && !form.images.includes(imageUrl)) {
      update('images', [...form.images, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImage = (url: string) => update('images', form.images.filter((u) => u !== url));

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, price, and category are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const url = isEdit ? `/api/products/${productId}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? 'Product updated!' : 'Product created!');
        router.push('/admin/products');
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 hover:bg-stone-100 rounded-sm transition-colors">
          <ArrowLeft size={16} className="text-stone-500" />
        </Link>
        <h2 className="font-display text-xl font-semibold text-forest-900">{isEdit ? 'Edit Product' : 'New Product'}</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-stone-100 rounded-sm p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-forest-900 pb-3 border-b border-stone-100">Basic Information</h3>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Product Name *</label>
              <input className={inputClass} value={form.name} onChange={(e) => autoSlug(e.target.value)} placeholder="e.g. Panchamukhi Ganesha Brass Statue" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Slug (URL)</label>
              <input className={inputClass} value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="auto-generated" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Short Description</label>
              <input className={inputClass} value={form.short_description} onChange={(e) => update('short_description', e.target.value)} placeholder="Brief tagline (shown on cards)" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Full Description</label>
              <textarea className={`${inputClass} resize-none`} rows={6} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Detailed product description..." />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border border-stone-100 rounded-sm p-6">
            <h3 className="font-display text-base font-semibold text-forest-900 pb-3 border-b border-stone-100 mb-4">Product Images</h3>
            <div className="flex gap-2 mb-4">
              <input
                className={`${inputClass} flex-1`}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (Supabase storage or external)"
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
              />
              <button onClick={addImage} className="flex items-center gap-2 bg-forest-900 text-gold-400 px-4 py-2.5 font-body text-sm hover:bg-gold-500 hover:text-forest-900 transition-all rounded-sm">
                <Plus size={14} /> Add
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {form.images.map((url, i) => (
                  <div key={i} className="relative aspect-square bg-stone-100 rounded-sm overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(url)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={16} className="text-white" />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 bg-forest-900 text-gold-400 font-body text-[9px] px-1.5 py-0.5 rounded">Main</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white border border-stone-100 rounded-sm p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-forest-900 pb-3 border-b border-stone-100">SEO</h3>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Meta Title</label>
              <input className={inputClass} value={form.meta_title} onChange={(e) => update('meta_title', e.target.value)} placeholder="Leave blank to use product name" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Meta Description</label>
              <textarea className={`${inputClass} resize-none`} rows={3} value={form.meta_description} onChange={(e) => update('meta_description', e.target.value)} placeholder="Leave blank to use short description" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="bg-white border border-stone-100 rounded-sm p-5 space-y-4">
            <h3 className="font-display text-base font-semibold text-forest-900 pb-3 border-b border-stone-100">Pricing</h3>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Price (₹) *</label>
              <input type="number" className={inputClass} value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Compare Price (₹)</label>
              <input type="number" className={inputClass} value={form.compare_price} onChange={(e) => update('compare_price', e.target.value)} placeholder="Optional MRP" />
            </div>
          </div>

          {/* Category & Details */}
          <div className="bg-white border border-stone-100 rounded-sm p-5 space-y-4">
            <h3 className="font-display text-base font-semibold text-forest-900 pb-3 border-b border-stone-100">Details</h3>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Category *</label>
              <select className={inputClass} value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Material</label>
              <select className={inputClass} value={form.material} onChange={(e) => update('material', e.target.value)}>
                {MATERIALS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Finish</label>
              <select className={inputClass} value={form.finish} onChange={(e) => update('finish', e.target.value)}>
                <option value="">Select finish</option>
                {FINISHES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Deity Name</label>
              <input className={inputClass} value={form.deity} onChange={(e) => update('deity', e.target.value)} placeholder="e.g. Ganesha" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Height (cm)</label>
                <input type="number" className={inputClass} value={form.height_cm} onChange={(e) => update('height_cm', e.target.value)} />
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Weight (kg)</label>
                <input type="number" step="0.001" className={inputClass} value={form.weight_kg} onChange={(e) => update('weight_kg', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white border border-stone-100 rounded-sm p-5 space-y-4">
            <h3 className="font-display text-base font-semibold text-forest-900 pb-3 border-b border-stone-100">Inventory</h3>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Stock Quantity</label>
              <input type="number" className={inputClass} value={form.stock_quantity} onChange={(e) => update('stock_quantity', e.target.value)} />
            </div>
            <div>
              <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Tags (comma separated)</label>
              <input className={inputClass} value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="ganesha, brass, puja" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.in_stock} onChange={(e) => update('in_stock', e.target.checked)} className="accent-forest-900" />
              <span className="font-body text-sm text-stone-600">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="accent-forest-900" />
              <span className="font-body text-sm text-stone-600">Featured Product</span>
            </label>
          </div>

          {/* Save */}
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
            ) : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
