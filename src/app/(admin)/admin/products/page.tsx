import { createAdminSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AdminProductsClient from '@/components/admin/AdminProductsClient';

async function getProducts() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <AdminProductsClient products={products} />;
}
