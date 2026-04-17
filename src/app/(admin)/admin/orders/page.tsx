import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { formatPrice } from '@/utils';
import AdminOrdersClient from '@/components/admin/AdminOrdersClient';

async function getOrders() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersClient orders={orders} />;
}
