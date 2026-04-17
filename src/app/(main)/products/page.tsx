import { Metadata } from 'next';
import ProductsClient from '@/components/products/ProductsClient';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Divine Statue Collections',
  description: 'Browse our complete collection of handcrafted divine statues — Ganesha, Shiva, Lakshmi, Krishna, Murugan and more from master artisans.',
};

async function getProducts(searchParams: Record<string, string>) {
  try {
    const supabase = createAdminSupabaseClient();
    let query = supabase.from('products').select('*').eq('in_stock', true);
    if (searchParams.category) query = query.eq('category', searchParams.category);
    if (searchParams.material) query = query.eq('material', searchParams.material);
    if (searchParams.search) query = query.ilike('name', `%${searchParams.search}%`);
    if (searchParams.minPrice) query = query.gte('price', Number(searchParams.minPrice));
    if (searchParams.maxPrice) query = query.lte('price', Number(searchParams.maxPrice));
    if (searchParams.sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (searchParams.sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (searchParams.sort === 'rating') query = query.order('rating', { ascending: false });
    else query = query.order('created_at', { ascending: false });
    const { data } = await query;
    return data || [];
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const products = await getProducts(searchParams);
  return <ProductsClient initialProducts={products} searchParams={searchParams} />;
}
