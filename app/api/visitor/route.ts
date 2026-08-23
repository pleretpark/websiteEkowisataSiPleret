import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    return null;
  }

  // Gunakan service role key jika tersedia (untuk bypass RLS jika perlu),
  // fallback ke anon key karena tabel Visitor sudah punya policy publik (FOR ALL USING true).
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    return null;
  }

  return createClient(url, key);
}

function getLocalDateString() {
  const now = new Date();
  // Vercel server uses UTC by default. Convert to UTC+7 (WIB).
  const localTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const year = localTime.getFullYear();
  const month = String(localTime.getMonth() + 1).padStart(2, '0');
  const day = String(localTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ success: true, today: 0, total: 0 });
  }

  try {
    const dateStr = getLocalDateString();

    const { data: todayVisitor, error: todayError } = await supabase
      .from('Visitor')
      .select('count')
      .eq('date', dateStr)
      .maybeSingle();

    if (todayError) {
      console.error('Error fetching today visitor:', todayError);
      return NextResponse.json(
        { success: false, error: todayError.message },
        { status: 500 }
      );
    }

    const { data: allVisitors, error: allError } = await supabase
      .from('Visitor')
      .select('count');

    if (allError) {
      console.error('Error fetching all visitors:', allError);
      return NextResponse.json(
        { success: false, error: allError.message },
        { status: 500 }
      );
    }

    const totalCount = (allVisitors || []).reduce((acc, curr) => acc + curr.count, 0);

    return NextResponse.json({
      success: true,
      today: todayVisitor?.count || 0,
      total: totalCount,
    });
  } catch (error) {
    console.error('Error in GET /api/visitor:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil statistik' },
      { status: 500 }
    );
  }
}

export async function POST() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn('Visitor tracking skipped: Supabase not configured.');
    return NextResponse.json({ success: true, count: 0 });
  }

  try {
    const dateStr = getLocalDateString();

    const { data: existing, error: fetchError } = await supabase
      .from('Visitor')
      .select('id, count')
      .eq('date', dateStr)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing visitor record:', fetchError);
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    if (existing) {
      const { data, error } = await supabase
        .from('Visitor')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id)
        .select('count')
        .single();

      if (error) {
        console.error('Error updating visitor count:', error);
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, count: data.count });
    } else {
      // Harus sertakan `id` karena tabel Prisma tidak punya server-side default UUID.
      const { data, error } = await supabase
        .from('Visitor')
        .insert({ id: randomUUID(), date: dateStr, count: 1 })
        .select('count')
        .single();

      if (error) {
        console.error('Error inserting visitor record:', error);
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, count: data.count });
    }
  } catch (error) {
    console.error('Error in POST /api/visitor:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mencatat pengunjung' },
      { status: 500 }
    );
  }
}
