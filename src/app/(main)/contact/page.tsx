'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll reply within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const inputClass = "w-full border border-stone-200 px-4 py-3.5 font-body text-sm outline-none focus:border-forest-900 transition-colors placeholder:text-stone-300 rounded-sm";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-forest-900 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-accent text-gold-400 text-xs tracking-[0.3em] uppercase">Get in Touch</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h1 className="font-display text-5xl lg:text-6xl text-white font-semibold mb-3">Contact Us</h1>
          <p className="font-body text-white/50 text-sm max-w-md mx-auto">
            Questions about a specific statue? Need Vastu guidance? Our expert team is here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-forest-900 font-semibold mb-6">Our Details</h2>
              {[
                { Icon: MapPin, title: 'Visit Us', lines: ['123, Artisan Street, Mylapore', 'Chennai – 600 004, Tamil Nadu'] },
                { Icon: Phone, title: 'Call Us', lines: ['+91 98765 43210', '+91 44 2345 6789'] },
                { Icon: Mail, title: 'Email Us', lines: ['hello@aadhirai.com', 'support@aadhirai.com'] },
                { Icon: Clock, title: 'Working Hours', lines: ['Mon–Sat: 10AM – 7PM IST', 'Sunday: 11AM – 5PM IST'] },
              ].map(({ Icon, title, lines }) => (
                <div key={title} className="flex gap-4 mb-6">
                  <div className="w-10 h-10 bg-forest-900 flex items-center justify-center flex-shrink-0 rounded-sm">
                    <Icon size={16} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="font-accent text-xs text-gold-500 tracking-widest uppercase mb-1">{title}</p>
                    {lines.map((l, i) => (
                      <p key={i} className="font-body text-sm text-stone-600">{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Quick */}
            <div className="bg-stone-50 p-6 rounded-sm">
              <h3 className="font-display text-lg text-forest-900 font-semibold mb-4">Quick Answers</h3>
              {[
                { q: 'Do you ship outside India?', a: 'Yes, we ship to select international destinations.' },
                { q: 'Can I customise a statue?', a: 'Yes! Contact us with your requirements.' },
                { q: 'How do I track my order?', a: 'You\'ll receive a tracking link via email once shipped.' },
              ].map(({ q, a }) => (
                <div key={q} className="mb-4 last:mb-0">
                  <p className="font-body text-sm font-semibold text-forest-900 mb-0.5">{q}</p>
                  <p className="font-body text-xs text-stone-500">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-forest-900 font-semibold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Name *</label>
                  <input className={inputClass} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your full name" required />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Email *</label>
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Subject</label>
                <select className={inputClass} value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}>
                  <option value="">Select a topic</option>
                  <option>Product Enquiry</option>
                  <option>Custom Order</option>
                  <option>Order Status</option>
                  <option>Vastu Guidance</option>
                  <option>Return / Refund</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Message *</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-3 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase px-10 py-4 hover:bg-gold-500 hover:text-forest-900 transition-all disabled:opacity-50 rounded-sm"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <><Send size={14} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
