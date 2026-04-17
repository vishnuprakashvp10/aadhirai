'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Store, Truck, CreditCard, Bell, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('store');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Settings saved!');
    setSaving(false);
  };

  const inputClass = "w-full border border-stone-200 px-3 py-2.5 font-body text-sm outline-none focus:border-forest-900 transition-colors rounded-sm";

  const tabs = [
    { id: 'store', label: 'Store', Icon: Store },
    { id: 'shipping', label: 'Shipping', Icon: Truck },
    { id: 'payment', label: 'Payment', Icon: CreditCard },
    { id: 'notifications', label: 'Notifications', Icon: Bell },
    { id: 'security', label: 'Security', Icon: Shield },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border border-stone-200 rounded-sm p-1 bg-stone-50 w-fit flex-wrap">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm font-body text-sm transition-all ${
              activeTab === id ? 'bg-forest-900 text-gold-400' : 'text-stone-500 hover:text-forest-900'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-100 rounded-sm p-6 space-y-5">
        {activeTab === 'store' && (
          <>
            <h3 className="font-display text-lg font-semibold text-forest-900 pb-3 border-b border-stone-100">Store Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Store Name</label>
                <input className={inputClass} defaultValue="Aadhirai" />
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Store Email</label>
                <input type="email" className={inputClass} defaultValue="hello@aadhirai.com" />
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Phone</label>
                <input type="tel" className={inputClass} defaultValue="+91 98765 43210" />
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">GST Number</label>
                <input className={inputClass} placeholder="33AAAAA0000A1Z5" />
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Store Address</label>
                <textarea className={`${inputClass} resize-none`} rows={3} defaultValue="123, Artisan Street, Mylapore, Chennai – 600 004, Tamil Nadu" />
              </div>
            </div>
          </>
        )}

        {activeTab === 'shipping' && (
          <>
            <h3 className="font-display text-lg font-semibold text-forest-900 pb-3 border-b border-stone-100">Shipping Settings</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Standard Shipping Fee (₹)</label>
                  <input type="number" className={inputClass} defaultValue="299" />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Free Shipping Above (₹)</label>
                  <input type="number" className={inputClass} defaultValue="5000" />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Estimated Delivery Days</label>
                  <input type="number" className={inputClass} defaultValue="7" />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Express Shipping Fee (₹)</label>
                  <input type="number" className={inputClass} defaultValue="599" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-forest-900" />
                <span className="font-body text-sm text-stone-600">Enable international shipping</span>
              </label>
            </div>
          </>
        )}

        {activeTab === 'payment' && (
          <>
            <h3 className="font-display text-lg font-semibold text-forest-900 pb-3 border-b border-stone-100">Payment Gateway</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm">
                <p className="font-body text-sm text-blue-700">
                  🔒 Razorpay keys are stored securely as environment variables. Update them in your <code className="font-mono text-xs bg-blue-100 px-1">.env.local</code> file.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Razorpay Key ID</label>
                  <input className={inputClass} defaultValue="rzp_***...***" disabled />
                </div>
                <div>
                  <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Mode</label>
                  <select className={inputClass}>
                    <option>Test Mode</option>
                    <option>Live Mode</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Webhook URL</label>
                <input className={`${inputClass} bg-stone-50`} defaultValue={`${typeof window !== 'undefined' ? window.location.origin : 'https://aadhirai.com'}/api/webhook/razorpay`} readOnly />
              </div>
            </div>
          </>
        )}

        {activeTab === 'notifications' && (
          <>
            <h3 className="font-display text-lg font-semibold text-forest-900 pb-3 border-b border-stone-100">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { label: 'New order received', desc: 'Get notified via email when a new order is placed' },
                { label: 'Payment confirmed', desc: 'Alert when Razorpay confirms a payment' },
                { label: 'Low stock alert', desc: 'When product stock falls below 5 units' },
                { label: 'New customer signup', desc: 'When a new customer creates an account' },
                { label: 'Order status updates', desc: 'Notifications when order status changes' },
              ].map(({ label, desc }) => (
                <label key={label} className="flex items-start gap-3 p-3 border border-stone-100 rounded-sm cursor-pointer hover:bg-stone-50 transition-colors">
                  <input type="checkbox" defaultChecked className="accent-forest-900 mt-0.5" />
                  <div>
                    <p className="font-body text-sm font-medium text-forest-900">{label}</p>
                    <p className="font-body text-xs text-stone-400">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {activeTab === 'security' && (
          <>
            <h3 className="font-display text-lg font-semibold text-forest-900 pb-3 border-b border-stone-100">Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Admin Email</label>
                <input type="email" className={inputClass} defaultValue="admin@aadhirai.com" />
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Current Password</label>
                <input type="password" className={inputClass} placeholder="••••••••••" />
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">New Password</label>
                <input type="password" className={inputClass} placeholder="Min 12 characters" />
              </div>
              <div>
                <label className="font-body text-xs text-stone-500 tracking-wide uppercase mb-1.5 block">Confirm New Password</label>
                <input type="password" className={inputClass} placeholder="••••••••••" />
              </div>
            </div>
          </>
        )}

        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-forest-900 text-gold-400 font-accent text-xs tracking-widest uppercase px-8 py-3 hover:bg-gold-500 hover:text-forest-900 transition-all disabled:opacity-50 rounded-sm"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Save size={14} /> Save Settings</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
