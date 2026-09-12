import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import dataStore from '@/lib/dataStore';

// GET /api/vlogs/[slug]
export async function GET(request, { params }) {
  try {
    await connectDB().catch(() => {});
    const { slug } = params;
    const vlog = await dataStore.getVlogBySlug(slug);
    if (!vlog) return NextResponse.json({ success: false, message: 'Vlog not found' }, { status: 404 });

    dataStore.incrementVlogViews(vlog._id || slug).catch(() => {});
    const allInCategory = await dataStore.getVlogs({ category: vlog.category });
    const related = allInCategory.filter(v => v.slug !== slug).slice(0, 3);

    return NextResponse.json({ success: true, data: vlog, related });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PUT /api/vlogs/[slug] — update by ID (slug param is actually ID in admin)
export async function PUT(request, { params }) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (body.tags && typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    const updated = await dataStore.updateVlog(params.slug, body);
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE /api/vlogs/[slug]
export async function DELETE(request, { params }) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const deleted = await dataStore.deleteVlog(params.slug);
    if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
