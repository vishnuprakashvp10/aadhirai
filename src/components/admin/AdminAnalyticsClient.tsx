'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { formatPrice } from '@/utils';
import { TrendingUp, ShoppingBag, Users, DollarSign, Award } from 'lucide-react';

const COLORS = ['#053726', '#E1A730', '#1a4a33', '#ecc762', '#25744d', '#c4851e'];

const formatCurrency = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

export default function AdminAnalyticsClient({ data }: { data: any }) {
  const stats = [
    { label: 'Total Revenue', value: formatPrice(data.totalRevenue), Icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Orders', value: data.totalOrders, Icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Paid Orders', value: data.paidOrders, Icon: Award, color: 'text-gold-500' },
    { label: 'Avg Order Value', value: formatPrice(data.avgOrderValue), Icon: DollarSign, color: 'text-purple-500' },
    { label: 'Total Customers', value: data.totalCustomers, Icon: Users, color: 'text-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white border border-stone-100 p-5 rounded-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-[10px] text-stone-400 tracking-wide uppercase">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <p className="font-display text-2xl font-semibold text-forest-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-stone-100 rounded-sm p-6">
          <h3 className="font-display text-lg font-semibold text-forest-900 mb-5">Monthly Revenue</h3>
          {data.monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontFamily: 'var(--font-jost)', fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--font-jost)', fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip
                  contentStyle={{ fontFamily: 'var(--font-jost)', fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 4 }}
                  formatter={(v: number) => [formatPrice(v), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#053726" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-stone-300">
              <p className="font-body text-sm">No revenue data yet</p>
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white border border-stone-100 rounded-sm p-6">
          <h3 className="font-display text-lg font-semibold text-forest-900 mb-5">Orders by Status</h3>
          {data.ordersByStatus.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={data.ordersByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" nameKey="status">
                    {data.ordersByStatus.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: 'var(--font-jost)', fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 4 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {data.ordersByStatus.map((item: any, i: number) => (
                  <div key={item.status} className="flex items-center justify-between font-body text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-stone-600 capitalize">{item.status.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="font-semibold text-forest-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-stone-300">
              <p className="font-body text-sm">No order data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Orders trend */}
      <div className="bg-white border border-stone-100 rounded-sm p-6">
        <h3 className="font-display text-lg font-semibold text-forest-900 mb-5">Order Volume Trend</h3>
        {data.monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontFamily: 'var(--font-jost)', fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'var(--font-jost)', fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-jost)', fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 4 }} />
              <Line type="monotone" dataKey="orders" stroke="#E1A730" strokeWidth={2.5} dot={{ fill: '#E1A730', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-40 text-stone-300">
            <p className="font-body text-sm">No data yet</p>
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="font-display text-lg font-semibold text-forest-900">Top Selling Products</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              {['#', 'Product', 'Units Sold', 'Revenue'].map((h) => (
                <th key={h} className="text-left px-5 py-3 font-body text-[10px] text-stone-400 tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.topProducts.map((p: any, i: number) => (
              <tr key={p.name} className="border-b border-stone-50">
                <td className="px-5 py-3.5 font-body text-sm text-stone-400">{i + 1}</td>
                <td className="px-5 py-3.5 font-body text-sm font-medium text-forest-900">{p.name}</td>
                <td className="px-5 py-3.5 font-body text-sm text-stone-600">{p.sales}</td>
                <td className="px-5 py-3.5 font-body text-sm font-semibold text-forest-900">{formatPrice(p.revenue)}</td>
              </tr>
            ))}
            {data.topProducts.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center font-body text-sm text-stone-400">No sales data yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
