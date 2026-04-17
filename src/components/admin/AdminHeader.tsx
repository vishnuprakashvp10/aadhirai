'use client';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

const titles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin/blogs': 'Blogs',
  '/admin/customers': 'Customers',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const base = '/' + pathname.split('/').slice(1, 3).join('/');
  const title = titles[base] || 'Admin';

  return (
    <header className="bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-900">{title}</h1>
        <p className="font-body text-xs text-stone-400 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 border border-stone-200 rounded-sm px-3 py-2">
          <Search size={14} className="text-stone-400" />
          <input placeholder="Quick search..." className="font-body text-sm outline-none w-40 placeholder:text-stone-300" />
        </div>
        <button className="relative p-2 hover:bg-stone-50 rounded-sm transition-colors">
          <Bell size={18} className="text-stone-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
        </button>
        <div className="w-8 h-8 bg-forest-900 rounded-full flex items-center justify-center">
          <span className="font-accent text-gold-400 text-xs font-bold">A</span>
        </div>
      </div>
    </header>
  );
}
