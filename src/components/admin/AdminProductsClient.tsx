'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatPrice } from '@/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminProductsClient({ products: initialProducts }: { products: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStock = async (id: string, inStock: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ in_stock: !inStock }),
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === id ? { ...p, in_stock: !inStock } : p));
        toast.success(`Product ${!inStock ? 'enabled' : 'disabled'}`);
      }
    } catch { toast.error('Failed to update'); }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted');
      }
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 border border-stone-200 rounded-sm px-3 py-2.5 flex-1 max-w-sm">
          <Search size={14} className="text-stone-400" />
          <input
            placeholder="Search products..."
            className="flex-1 font-body text-sm outline-none placeholder:text-stone-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase px-5 py-3 hover:bg-gold-500 hover:text-forest-900 transition-all rounded-sm"
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-body text-[10px] text-stone-400 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0">
                        {product.images?.[0] && (
                          <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-forest-900 line-clamp-1 max-w-[160px]">{product.name}</p>
                        <p className="font-body text-[10px] text-stone-400">{product.material}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-stone-500 whitespace-nowrap">{product.category}</td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm font-semibold text-forest-900">{formatPrice(product.price)}</p>
                    {product.compare_price && <p className="font-body text-[10px] text-stone-400 line-through">{formatPrice(product.compare_price)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-body text-xs font-medium ${product.stock_quantity <= 3 ? 'text-red-500' : product.stock_quantity <= 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-body text-[10px] px-2 py-0.5 rounded-full ${product.featured ? 'bg-gold-50 text-gold-600' : 'bg-stone-50 text-stone-400'}`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStock(product.id, product.in_stock)}>
                      {product.in_stock
                        ? <ToggleRight size={22} className="text-green-500 hover:text-green-600 transition-colors" />
                        : <ToggleLeft size={22} className="text-stone-300 hover:text-stone-400 transition-colors" />
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/products/${product.slug}`} target="_blank" className="p-1.5 hover:bg-stone-100 rounded-sm transition-colors" title="View">
                        <Eye size={13} className="text-stone-400" />
                      </Link>
                      <Link href={`/admin/products/edit?id=${product.id}`} className="p-1.5 hover:bg-blue-50 rounded-sm transition-colors" title="Edit">
                        <Edit size={13} className="text-blue-400" />
                      </Link>
                      <button onClick={() => deleteProduct(product.id, product.name)} className="p-1.5 hover:bg-red-50 rounded-sm transition-colors" title="Delete">
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center font-body text-sm text-stone-400">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
          <p className="font-body text-xs text-stone-400">{filtered.length} products</p>
        </div>
      </div>
    </div>
  );
}
