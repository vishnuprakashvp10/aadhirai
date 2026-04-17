'use client';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-forest-900 text-gold-400 text-center py-2.5 px-4 relative">
      <p className="font-body text-xs tracking-widest uppercase">
        ✦ Free shipping on orders above ₹5,000 &nbsp;|&nbsp; Authentic handcrafted statues from master artisans ✦
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-400 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
}
