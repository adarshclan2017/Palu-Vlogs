import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import dataStore from '@/lib/dataStore';

// Force dynamic - never cache settings, always read fresh from MongoDB
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    await connectDB().catch(() => {});
    const settings = await dataStore.getSettings();
    return NextResponse.json(
      { success: true, data: settings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        }
      }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const updated = await dataStore.updateSettings(body);
    return NextResponse.json(
      { success: true, data: updated },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        }
      }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
