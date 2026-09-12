import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import dataStore from '@/lib/dataStore';

export async function PUT(request, { params }) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    // params.id might be "ID/read" — handle both
    const id = params.id;
    const msg = await dataStore.toggleMessageRead(id);
    if (!msg) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: msg });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const deleted = await dataStore.deleteContactMessage(params.id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
