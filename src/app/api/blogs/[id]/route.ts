import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from('blogs').select('*').eq('id', params.id).single();
    if (error) throw error;
    return NextResponse.json({ blog: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from('blogs').update(body).eq('id', params.id).select().single();
    if (error) throw error;
    return NextResponse.json({ blog: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from('blogs').update(body).eq('id', params.id).select().single();
    if (error) throw error;
    return NextResponse.json({ blog: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from('blogs').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
