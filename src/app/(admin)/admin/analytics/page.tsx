import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { formatPrice } from '@/utils';
import AdminAnalyticsClient from '@/components/admin/AdminAnalyticsClient';

async function getAnalyticsData() {
  try {
    const supabase = createAdminSupabaseClient();
    const [ordersRes, customersRes] = await Promise.all([
      supabase.from('orders').select('id, total, status, payment_status, items, created_at').order('created_at', { ascending: true }),
      supabase.from('customers').select('id, total_spent, total_orders, created_at'),
    ]);

    const orders = ordersRes.data || [];
    const customers = customersRes.data || [];
    const paidOrders = orders.filter((o) => o.payment_status === 'paid');

    // Revenue by month (last 6 months)
    const revenueByMonth: Record<string, number> = {};
    const ordersByMonth: Record<string, number> = {};
    paidOrders.forEach((o) => {
      const month = new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + o.total;
      ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
    });
    const monthlyData = Object.entries(revenueByMonth).slice(-6).map(([month, revenue]) => ({
      month, revenue, orders: ordersByMonth[month] || 0,
    }));

    // Orders by status
    const statusCount: Record<string, number> = {};
    orders.forEach((o) => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });
    const ordersByStatus = Object.entries(statusCount).map(([status, count]) => ({ status, count }));

    // Top products
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    paidOrders.forEach((o) => {
      (o.items as any[]).forEach((item: any) => {
        if (!productSales[item.product_id]) productSales[item.product_id] = { name: item.product_name, sales: 0, revenue: 0 };
        productSales[item.product_id].sales += item.quantity;
        productSales[item.product_id].revenue += item.price * item.quantity;
      });
    });
    const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return {
      totalRevenue: paidOrders.reduce((s, o) => s + o.total, 0),
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      totalCustomers: customers.length,
      avgOrderValue: paidOrders.length ? paidOrders.reduce((s, o) => s + o.total, 0) / paidOrders.length : 0,
      monthlyData,
      ordersByStatus,
      topProducts,
    };
  } catch {
    return { totalRevenue: 0, totalOrders: 0, paidOrders: 0, totalCustomers: 0, avgOrderValue: 0, monthlyData: [], ordersByStatus: [], topProducts: [] };
  }
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();
  return <AdminAnalyticsClient data={data} />;
}
