import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [visitorHariIni, totalVisitor] = await Promise.all([
      prisma.visitor.findUnique({ where: { date: today } }),
      prisma.visitor.aggregate({ _sum: { count: true } })
    ]);

    return NextResponse.json({
      success: true,
      today: visitorHariIni?.count || 0,
      total: totalVisitor._sum.count || 0,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil statistik' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const today = new Date();
    // Normalisasi jam ke 00:00:00 agar satu hari dihitung sebagai satu entri
    today.setHours(0, 0, 0, 0);

    const visitor = await prisma.visitor.upsert({
      where: {
        date: today,
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        date: today,
        count: 1,
      },
    });

    return NextResponse.json({ success: true, count: visitor.count });
  } catch (error) {
    console.error('Error saat mencatat pengunjung:', error);
    return NextResponse.json({ success: false, error: 'Gagal mencatat pengunjung' }, { status: 500 });
  }
}
