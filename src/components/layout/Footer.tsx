import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl text-gold-400 mb-1">Sacred Stories, Delivered</h3>
              <p className="font-body text-sm text-white/60">Subscribe for new arrivals, mythological insights, and exclusive offers.</p>
            </div>
            <form action="/api/newsletter" method="POST" className="flex gap-0 w-full max-w-md">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-body text-sm px-4 py-3 outline-none focus:border-gold-400 transition-colors"
              />
              <button
                type="submit"
                className="bg-gold-500 text-forest-900 font-accent text-xs tracking-widest uppercase px-6 py-3 hover:bg-gold-400 transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h2 className="font-accent text-2xl font-bold text-gold-400 tracking-wider">AADHIRAI</h2>
              <p className="font-body text-[9px] tracking-[0.25em] text-gold-500/70 uppercase mt-0.5">Curated Indian Goods</p>
            </div>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-6">
              Every statue tells a story. We curate authentic handcrafted divine sculptures from master artisans across India — preserving a tradition that spans millennia.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Youtube, href: '#' },
                { Icon: Twitter, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-gold-400 hover:text-gold-400 transition-all rounded-full"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-accent text-xs tracking-widest uppercase text-gold-400 mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'Our Story' },
                { href: '/products', label: 'All Products' },
                { href: '/blogs', label: 'Sacred Blogs' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-white/60 hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold-500/40 rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-accent text-xs tracking-widest uppercase text-gold-400 mb-5">Collections</h4>
            <ul className="space-y-3">
              {[
                'Lord Ganesha',
                'Lord Shiva',
                'Goddess Lakshmi',
                'Lord Krishna',
                'Lord Murugan',
                'Buddha',
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="font-body text-sm text-white/60 hover:text-gold-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-gold-500/40 rounded-full" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-accent text-xs tracking-widest uppercase text-gold-400 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-white/60 leading-relaxed">
                  123, Artisan Street, Mylapore,<br />Chennai – 600 004, Tamil Nadu
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-gold-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="font-body text-sm text-white/60 hover:text-gold-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-gold-400 flex-shrink-0" />
                <a href="mailto:hello@aadhirai.com" className="font-body text-sm text-white/60 hover:text-gold-400 transition-colors">
                  hello@aadhirai.com
                </a>
              </li>
            </ul>
            <div className="mt-6 border border-white/10 p-4 rounded-sm">
              <p className="font-accent text-[9px] tracking-widest uppercase text-gold-400/70 mb-1">Store Hours</p>
              <p className="font-body text-xs text-white/50">Mon – Sat: 10AM – 7PM IST</p>
              <p className="font-body text-xs text-white/50">Sunday: 11AM – 5PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} Aadhirai. All rights reserved. Crafted with devotion in India.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy', 'Returns'].map((item) => (
              <Link key={item} href="#" className="font-body text-xs text-white/40 hover:text-gold-400 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Icons */}
      <div className="bg-black/20 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
          <span className="font-body text-[10px] text-white/30 tracking-widest uppercase">Secure Payments via</span>
          <div className="flex items-center gap-3">
            {['Razorpay', 'UPI', 'Visa', 'Mastercard', 'NetBanking'].map((method) => (
              <span key={method} className="font-accent text-[9px] border border-white/10 px-2 py-0.5 text-white/30 rounded-sm">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
