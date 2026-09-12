import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import dataStore from '@/lib/dataStore';

export async function GET() {
  try {
    await connectDB().catch(() => {});
    const locations = await dataStore.getLocations();
    return NextResponse.json({ success: true, count: locations.length, data: locations });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const location = await dataStore.createLocation(body);
    return NextResponse.json({ success: true, data: location }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
