import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString();

    const { data: todayVisitor } = await supabase
      .from('Visitor')
      .select('count')
      .eq('date', dateStr)
      .single();

    const { data: allVisitors } = await supabase
      .from('Visitor')
      .select('count');
    
    const totalCount = (allVisitors || []).reduce((acc, curr) => acc + curr.count, 0);

    return NextResponse.json({
      success: true,
      today: todayVisitor?.count || 0,
      total: totalCount,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil statistik' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString();

    const { data: existing } = await supabase
      .from('Visitor')
      .select('count')
      .eq('date', dateStr)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('Visitor')
        .update({ count: existing.count + 1 })
        .eq('date', dateStr)
        .select()
        .single();
      
      return NextResponse.json({ success: true, count: data?.count });
    } else {
      const { data, error } = await supabase
        .from('Visitor')
        .insert({ date: dateStr, count: 1 })
        .select()
        .single();

      return NextResponse.json({ success: true, count: data?.count });
    }
  } catch (error) {
    console.error('Error saat mencatat pengunjung:', error);
    return NextResponse.json({ success: false, error: 'Gagal mencatat pengunjung' }, { status: 500 });
  }
}
