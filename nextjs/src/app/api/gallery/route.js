import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import dataStore from '@/lib/dataStore';

export async function GET(request) {
  try {
    await connectDB().catch(() => {});
    const { searchParams } = new URL(request.url);
    const albumSlug = searchParams.get('album') || '';
    const photos = await dataStore.getPhotos({ albumSlug });
    return NextResponse.json({ success: true, count: photos.length, data: photos });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const caption = formData.get('caption') || '';
    const albumSlug = formData.get('albumSlug') || 'general';
    const imageUrl = formData.get('imageUrl') || '';

    const photo = await dataStore.createPhoto({ caption, albumSlug, imageUrl, createdAt: new Date().toISOString() });
    return NextResponse.json({ success: true, data: photo }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
