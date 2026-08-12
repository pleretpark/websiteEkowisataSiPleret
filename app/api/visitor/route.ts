import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
}

function getLocalDateString() {
  const now = new Date();
  // Vercel server uses UTC by default. Convert to UTC+7 (WIB).
  const offsetMs = 7 * 60 * 60 * 1000;
  // Get UTC time by extracting from ISO string, then construct a new date
  // A safer approach:
  const localTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
  // Construct YYYY-MM-DD manually to avoid locale formatting inconsistencies
  const year = localTime.getFullYear();
  const month = String(localTime.getMonth() + 1).padStart(2, '0');
  const day = String(localTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const dateStr = getLocalDateString();

    const { data: todayVisitor } = await supabase
      .from('Visitor')
      .select('count')
      .eq('date', dateStr)
      .maybeSingle();

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
    const supabase = getSupabaseClient();
    const dateStr = getLocalDateString();

    const { data: existing } = await supabase
      .from('Visitor')
      .select('count')
      .eq('date', dateStr)
      .maybeSingle();

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
