import { MetadataRoute } from 'next';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aadhirai.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const supabase = createAdminSupabaseClient();
    const [productsRes, blogsRes] = await Promise.all([
      supabase.from('products').select('slug, updated_at').eq('in_stock', true),
      supabase.from('blogs').select('slug, updated_at').eq('published', true),
    ]);

    const productRoutes: MetadataRoute.Sitemap = (productsRes.data || []).map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const blogRoutes: MetadataRoute.Sitemap = (blogsRes.data || []).map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
