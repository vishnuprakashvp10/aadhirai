import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { formatPrice } from '@/utils';
import { Users } from 'lucide-react';

async function getCustomers() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Total Revenue', value: formatPrice(customers.reduce((s, c) => s + (c.total_spent || 0), 0)) },
          { label: 'Avg Lifetime Value', value: customers.length ? formatPrice(customers.reduce((s, c) => s + (c.total_spent || 0), 0) / customers.length) : '₹0' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-stone-100 rounded-sm p-5">
            <p className="font-body text-[10px] text-stone-400 tracking-widest uppercase mb-2">{label}</p>
            <p className="font-display text-2xl font-semibold text-forest-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {['Customer', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-body text-[10px] text-stone-400 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-forest-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-accent text-gold-400 text-xs font-bold">{customer.name?.[0] || '?'}</span>
                      </div>
                      <span className="font-body text-sm font-medium text-forest-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-stone-500">{customer.email}</td>
                  <td className="px-5 py-4 font-body text-sm text-stone-500">{customer.phone || '—'}</td>
                  <td className="px-5 py-4 font-body text-sm text-stone-700 font-medium">{customer.total_orders || 0}</td>
                  <td className="px-5 py-4 font-body text-sm font-semibold text-forest-900">{formatPrice(customer.total_spent || 0)}</td>
                  <td className="px-5 py-4 font-body text-xs text-stone-400">
                    {new Date(customer.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Users size={40} className="text-stone-200 mx-auto mb-3" />
                    <p className="font-body text-sm text-stone-400">No customers yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
          <p className="font-body text-xs text-stone-400">{customers.length} customers</p>
        </div>
      </div>
    </div>
  );
}
