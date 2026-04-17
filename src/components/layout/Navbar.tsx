'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    href: '/products',
    label: 'Products',
    dropdown: [
      { href: '/products?category=Lord+Ganesha', label: 'Lord Ganesha' },
      { href: '/products?category=Lord+Shiva', label: 'Lord Shiva' },
      { href: '/products?category=Goddess+Lakshmi', label: 'Goddess Lakshmi' },
      { href: '/products?category=Lord+Krishna', label: 'Lord Krishna' },
      { href: '/products?category=Lord+Murugan', label: 'Lord Murugan' },
      { href: '/products?category=Buddha', label: 'Buddha' },
      { href: '/products', label: 'All Collections →' },
    ],
  },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isTransparent = pathname === '/' && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100'
        }`}
        style={{ top: 'var(--announcement-height, 40px)' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className={`relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 ${
              isTransparent ? 'border-gold-400/60' : 'border-forest-900/20'
            }`}>
              <div className="w-full h-full bg-forest-900 flex items-center justify-center">
                <span className="font-accent text-gold-400 font-bold text-sm">A</span>
              </div>
            </div>
            <div>
              <span className={`font-accent text-lg lg:text-xl font-bold tracking-wider block leading-none ${
                isTransparent ? 'text-white' : 'text-forest-900'
              }`}>
                AADHIRAI
              </span>
              <span className={`font-body text-[9px] tracking-[0.2em] uppercase block ${
                isTransparent ? 'text-gold-300' : 'text-gold-500'
              }`}>
                Curated Indian Goods
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.dropdown ? (
                  <button
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={`flex items-center gap-1 font-body text-sm font-medium tracking-wide transition-colors ${
                      isTransparent
                        ? 'text-white/90 hover:text-gold-300'
                        : 'text-stone-700 hover:text-forest-900'
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className="mt-0.5" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={`font-body text-sm font-medium tracking-wide transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-gold-500 after:transition-all hover:after:w-full ${
                      pathname === link.href
                        ? isTransparent
                          ? 'text-gold-300'
                          : 'text-forest-900 after:w-full'
                        : isTransparent
                        ? 'text-white/90 hover:text-gold-300'
                        : 'text-stone-700 hover:text-forest-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.dropdown && (
                  <div
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white border border-stone-100 shadow-xl rounded-sm transition-all duration-200 ${
                      activeDropdown === link.label
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="py-2">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-5 py-2.5 font-body text-sm text-stone-700 hover:bg-forest-900 hover:text-gold-400 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors ${
                isTransparent ? 'text-white hover:text-gold-300' : 'text-stone-700 hover:text-forest-900'
              }`}
            >
              <Search size={18} />
            </button>

            <Link href="/cart" className="relative p-2">
              <ShoppingCart
                size={20}
                className={`transition-colors ${
                  isTransparent ? 'text-white hover:text-gold-300' : 'text-stone-700 hover:text-forest-900'
                }`}
              />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-forest-900 text-[10px] font-bold w-4.5 h-4.5 w-5 h-5 rounded-full flex items-center justify-center font-body">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 transition-colors ${
                isTransparent ? 'text-white' : 'text-stone-700'
              }`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Search Bar */}
        {searchOpen && (
          <div className="bg-white border-t border-stone-100 px-4 py-3">
            <div className="max-w-7xl mx-auto">
              <form
                action="/products"
                className="flex gap-2 items-center"
              >
                <Search size={16} className="text-stone-400" />
                <input
                  autoFocus
                  name="search"
                  type="text"
                  placeholder="Search for statues, deities, materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 font-body text-sm outline-none text-stone-700 placeholder:text-stone-400"
                />
                <button type="submit" className="font-accent text-xs tracking-widest text-forest-900 hover:text-gold-500 uppercase transition-colors">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="bg-forest-900 px-6 py-8">
            <div className="flex items-center justify-between mb-1">
              <span className="font-accent text-gold-400 text-lg font-bold tracking-wider">AADHIRAI</span>
              <button onClick={() => setMobileOpen(false)} className="text-gold-400">
                <X size={20} />
              </button>
            </div>
            <span className="font-body text-[9px] text-gold-500/70 tracking-[0.2em] uppercase">Curated Indian Goods</span>
          </div>

          <nav className="px-6 py-6 space-y-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-3 font-body text-sm font-medium border-b border-stone-100 transition-colors ${
                    pathname === link.href ? 'text-forest-900 font-semibold' : 'text-stone-600 hover:text-forest-900'
                  }`}
                >
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="pl-4 mt-1 space-y-0.5">
                    {link.dropdown.slice(0, -1).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block py-1.5 font-body text-xs text-stone-500 hover:text-forest-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="px-6 pt-4">
            <Link href="/cart" className="btn-primary block text-center">
              View Cart ({itemCount})
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className={pathname === '/' ? '' : 'h-[80px] lg:h-[100px]'} />
    </>
  );
}
