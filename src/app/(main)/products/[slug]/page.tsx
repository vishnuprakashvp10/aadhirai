import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import ProductDetailClient from '@/components/products/ProductDetailClient';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from('products').select('name, short_description, meta_title, meta_description').eq('slug', params.slug).single();
  if (!data) return { title: 'Product Not Found' };
  return {
    title: data.meta_title || data.name,
    description: data.meta_description || data.short_description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const supabase = createAdminSupabaseClient();
  const { data: product } = await supabase.from('products').select('*').eq('slug', params.slug).single();
  if (!product) notFound();

  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4);

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return <ProductDetailClient product={product} related={related || []} reviews={reviews || []} />;
}
