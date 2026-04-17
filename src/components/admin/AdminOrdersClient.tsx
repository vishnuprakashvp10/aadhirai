'use client';
import { useState } from 'react';
import { formatPrice } from '@/utils';
import { Search, Filter, Eye, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  out_for_delivery: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-stone-50 text-stone-600 border-stone-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminOrdersClient({ orders }: { orders: any[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.customer_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Order status updated');
        setSelectedOrder((p: any) => p ? { ...p, status } : p);
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 border border-stone-200 rounded-sm px-3 py-2.5 flex-1">
          <Search size={14} className="text-stone-400" />
          <input
            placeholder="Search order, customer..."
            className="flex-1 font-body text-sm outline-none placeholder:text-stone-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border border-stone-200 rounded-sm px-4 py-2.5 font-body text-sm pr-8 outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-3 bg-white border border-stone-100 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  {['Order', 'Customer', 'Total', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-body text-[10px] text-stone-400 tracking-widest uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className={`border-b border-stone-50 hover:bg-stone-50/50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-gold-50/30' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-body text-xs font-semibold text-forest-900">{order.order_number}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-body text-xs text-stone-700 font-medium">{order.customer_name}</p>
                      <p className="font-body text-[10px] text-stone-400">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3.5 font-body text-sm font-semibold text-forest-900 whitespace-nowrap">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`font-body text-[10px] px-2.5 py-1 rounded-full border capitalize whitespace-nowrap ${statusColors[order.status] || 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-body text-[10px] text-stone-400 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <Eye size={14} className="text-stone-300 hover:text-forest-900 transition-colors" />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center font-body text-sm text-stone-400">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
            <p className="font-body text-xs text-stone-400">{filtered.length} orders</p>
          </div>
        </div>

        {/* Order Detail Panel */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white border border-stone-100 rounded-sm overflow-hidden sticky top-8">
              <div className="px-5 py-4 bg-forest-900 flex items-center justify-between">
                <div>
                  <p className="font-accent text-gold-400 text-xs tracking-widest">{selectedOrder.order_number}</p>
                  <p className="font-body text-white/60 text-xs mt-0.5">{new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className={`font-body text-xs px-2.5 py-1 rounded-full border ${statusColors[selectedOrder.payment_status] || 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                  {selectedOrder.payment_status}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Customer */}
                <div>
                  <p className="font-body text-[10px] text-stone-400 tracking-widest uppercase mb-1.5">Customer</p>
                  <p className="font-body text-sm font-semibold text-forest-900">{selectedOrder.customer_name}</p>
                  <p className="font-body text-xs text-stone-500">{selectedOrder.customer_email}</p>
                  <p className="font-body text-xs text-stone-500">{selectedOrder.customer_phone}</p>
                </div>

                {/* Address */}
                <div>
                  <p className="font-body text-[10px] text-stone-400 tracking-widest uppercase mb-1.5">Shipping Address</p>
                  <p className="font-body text-xs text-stone-500 leading-relaxed">
                    {selectedOrder.shipping_address?.line1}<br />
                    {selectedOrder.shipping_address?.line2 && <>{selectedOrder.shipping_address.line2}<br /></>}
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}<br />
                    {selectedOrder.shipping_address?.pincode}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <p className="font-body text-[10px] text-stone-400 tracking-widest uppercase mb-2">Items</p>
                  <div className="space-y-2">
                    {(selectedOrder.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-body">
                        <span className="w-5 h-5 bg-stone-100 rounded-sm flex items-center justify-center text-[10px] text-stone-500">{item.quantity}</span>
                        <span className="flex-1 text-stone-700 line-clamp-1">{item.product_name}</span>
                        <span className="font-medium text-forest-900">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-stone-100 pt-3 space-y-1">
                  <div className="flex justify-between font-body text-xs text-stone-500">
                    <span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-body text-xs text-stone-500">
                    <span>Shipping</span><span>{selectedOrder.shipping_cost === 0 ? 'Free' : formatPrice(selectedOrder.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm font-semibold text-forest-900 pt-1">
                    <span>Total</span><span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <p className="font-body text-[10px] text-stone-400 tracking-widest uppercase mb-2">Update Status</p>
                  <div className="relative">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                      className="w-full appearance-none border border-stone-200 rounded-sm px-3 py-2.5 font-body text-sm pr-7 outline-none focus:border-forest-900 transition-colors cursor-pointer capitalize"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-100 rounded-sm flex items-center justify-center h-64">
              <div className="text-center">
                <Eye size={32} className="text-stone-200 mx-auto mb-3" />
                <p className="font-body text-sm text-stone-400">Click an order to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
