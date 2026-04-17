'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Package, BookOpen,
  Users, BarChart3, Settings, LogOut, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', Icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/blogs', label: 'Blogs', Icon: BookOpen },
  { href: '/admin/customers', label: 'Customers', Icon: Users },
  { href: '/admin/analytics', label: 'Analytics', Icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-forest-900 flex flex-col flex-shrink-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold-500 rounded-sm flex items-center justify-center">
            <span className="font-accent text-forest-900 font-bold text-sm">A</span>
          </div>
          <div>
            <p className="font-accent text-white text-sm font-bold tracking-wider">AADHIRAI</p>
            <p className="font-body text-[9px] text-white/40 tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm transition-all group ${
                active
                  ? 'bg-gold-500 text-forest-900 font-semibold'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm text-white/40 hover:text-white hover:bg-white/10 transition-all"
          target="_blank"
        >
          <ChevronRight size={17} />
          <span>View Store</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm text-white/40 hover:text-red-400 hover:bg-white/10 transition-all">
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
