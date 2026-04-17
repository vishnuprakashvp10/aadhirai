import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .single();
    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
