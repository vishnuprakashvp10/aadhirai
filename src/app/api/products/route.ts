import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    let query = supabase.from('products').select('*');

    if (searchParams.get('category')) query = query.eq('category', searchParams.get('category')!);
    if (searchParams.get('featured') === 'true') query = query.eq('featured', true);
    if (searchParams.get('in_stock') === 'true') query = query.eq('in_stock', true);
    if (searchParams.get('search')) query = query.ilike('name', `%${searchParams.get('search')}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from('products').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
