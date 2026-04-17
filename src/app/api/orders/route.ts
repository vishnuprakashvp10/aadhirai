import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (searchParams.get('status')) query = query.eq('status', searchParams.get('status')!);
    if (searchParams.get('email')) query = query.eq('customer_email', searchParams.get('email')!);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ orders: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
