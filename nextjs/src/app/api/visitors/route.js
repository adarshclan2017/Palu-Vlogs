import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import dataStore from '@/lib/dataStore';

export async function GET() {
  try {
    await connectDB().catch(() => {});
    const count = await dataStore.getVisitors();
    return NextResponse.json({ success: true, count });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    await connectDB().catch(() => {});
    const count = await dataStore.incrementVisitors();
    return NextResponse.json({ success: true, count });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
