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

    let title = '';
    let caption = '';
    let albumSlug = 'road-trips';
    let location = 'Kerala';
    let imageUrl = '';

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      title = body.title || 'Untitled Photo';
      caption = body.caption || '';
      albumSlug = body.albumSlug || 'road-trips';
      location = body.location || 'Kerala';
      imageUrl = body.imageUrl || '';
    } else {
      const formData = await request.formData();
      title = formData.get('title') || 'Untitled Photo';
      caption = formData.get('caption') || '';
      albumSlug = formData.get('albumSlug') || 'road-trips';
      location = formData.get('location') || 'Kerala';
      imageUrl = formData.get('imageUrl') || '';

      const file = formData.get('file');
      if (file && typeof file === 'object' && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mime = file.type || 'image/jpeg';
        imageUrl = `data:${mime};base64,${buffer.toString('base64')}`;
      }
    }

    if (!imageUrl) {
      return NextResponse.json({ success: false, message: 'Please select an image file to upload' }, { status: 400 });
    }

    const photo = await dataStore.createPhoto({
      title,
      caption,
      albumSlug,
      location,
      imageUrl,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: photo }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
