import { createAdminSupabaseClient } from '@/lib/supabase/server';
import AdminBlogsClient from '@/components/admin/AdminBlogsClient';

async function getBlogs() {
  try {
    const supabase = createAdminSupabaseClient();
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch { return []; }
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();
  return <AdminBlogsClient blogs={blogs} />;
}
