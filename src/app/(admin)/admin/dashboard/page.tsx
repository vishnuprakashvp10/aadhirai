import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { formatPrice } from '@/utils';
import { ShoppingBag, Users, TrendingUp, Package, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

async function getDashboardData() {
  try {
    const supabase = createAdminSupabaseClient();
    const [ordersRes, customersRes, productsRes] = await Promise.all([
      supabase.from('orders').select('id, total, status, payment_status, created_at, customer_name, order_number').order('created_at', { ascending: false }).limit(10),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id, name, stock_quantity, in_stock').order('created_at', { ascending: false }).limit(5),
    ]);

    const orders = ordersRes.data || [];
    const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = customersRes.count || 0;

    return { orders, totalRevenue, totalOrders, totalCustomers, products: productsRes.data || [] };
  } catch {
    return { orders: [], totalRevenue: 0, totalOrders: 0, totalCustomers: 0, products: [] };
  }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-purple-50 text-purple-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  paid: 'bg-green-50 text-green-700',
};

export default async function AdminDashboard() {
  const { orders, totalRevenue, totalOrders, totalCustomers, products } = await getDashboardData();

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), Icon: TrendingUp, change: '+12%', up: true, color: 'text-green-500' },
    { label: 'Total Orders', value: totalOrders.toString(), Icon: ShoppingBag, change: '+8%', up: true, color: 'text-blue-500' },
    { label: 'Customers', value: totalCustomers.toString(), Icon: Users, change: '+15%', up: true, color: 'text-purple-500' },
    { label: 'Products', value: products.length.toString(), Icon: Package, change: 'Active', up: true, color: 'text-gold-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, Icon, change, up, color }) => (
          <div key={label} className="bg-white border border-stone-100 p-6 rounded-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-xs text-stone-400 tracking-wide uppercase">{label}</span>
              <div className={`w-9 h-9 bg-stone-50 rounded-sm flex items-center justify-center`}>
                <Icon size={17} className={color} />
              </div>
            </div>
            <p className="font-display text-3xl text-forest-900 font-semibold mb-1">{value}</p>
            <div className={`flex items-center gap-1 font-body text-xs ${up ? 'text-green-500' : 'text-red-500'}`}>
              {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
              {change} <span className="text-stone-400 ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-stone-100 rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-forest-900">Recent Orders</h2>
            <Link href="/admin/orders" className="font-body text-xs text-gold-500 hover:text-forest-900 transition-colors">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  {['Order', 'Customer', 'Amount', 'Status', 'Payment'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-body text-[10px] text-stone-400 tracking-widest uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/orders?id=${order.id}`} className="font-body text-xs font-medium text-forest-900 hover:text-gold-600 transition-colors">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-stone-600">{order.customer_name}</td>
                    <td className="px-5 py-3.5 font-body text-sm font-medium text-forest-900">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-body text-[10px] px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-stone-50 text-stone-500'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`font-body text-[10px] px-2.5 py-1 rounded-full capitalize ${statusColors[order.payment_status] || 'bg-stone-50 text-stone-500'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center font-body text-sm text-stone-400">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-forest-900">Inventory Alerts</h2>
            <Link href="/admin/products" className="font-body text-xs text-gold-500 hover:text-forest-900 transition-colors">Manage →</Link>
          </div>
          <div className="p-4 space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-sm">
                <span className="font-body text-xs text-stone-700 line-clamp-1 flex-1 mr-2">{p.name}</span>
                <span className={`font-body text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                  p.stock_quantity <= 3 ? 'bg-red-50 text-red-600' :
                  p.stock_quantity <= 10 ? 'bg-yellow-50 text-yellow-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  {p.stock_quantity} left
                </span>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-center font-body text-sm text-stone-400 py-4">No products</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-4 pt-2 border-t border-stone-100 mt-2 space-y-2">
            <p className="font-body text-[10px] text-stone-400 tracking-widest uppercase mb-2">Quick Actions</p>
            <Link href="/admin/products/new" className="block w-full bg-forest-900 text-gold-400 font-accent text-[10px] tracking-widest uppercase py-2.5 text-center hover:bg-gold-500 hover:text-forest-900 transition-colors rounded-sm">
              + Add Product
            </Link>
            <Link href="/admin/blogs/new" className="block w-full border border-forest-900 text-forest-900 font-accent text-[10px] tracking-widest uppercase py-2.5 text-center hover:bg-forest-900 hover:text-white transition-colors rounded-sm">
              + New Blog Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
