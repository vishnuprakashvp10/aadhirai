import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (searchParams.get('published') === 'true') query = query.eq('published', true);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ blogs: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from('blogs').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ blog: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
