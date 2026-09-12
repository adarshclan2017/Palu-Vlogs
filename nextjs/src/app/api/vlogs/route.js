import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import dataStore from '@/lib/dataStore';

function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const p of patterns) {
    const m = url?.match(p);
    if (m) return m[1];
  }
  return null;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

// GET /api/vlogs
export async function GET(request) {
  try {
    await connectDB().catch(() => {});
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const sort = searchParams.get('sort') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const all = await dataStore.getVlogs({ search, category, tag, sort });
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ success: true, count: data.length, total, totalPages: Math.ceil(total / limit), currentPage: page, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST /api/vlogs (admin only)
export async function POST(request) {
  try {
    await connectDB().catch(() => {});
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, youtubeUrl, category, tags, locationName, duration, isFeatured, isPopular, customThumbnail } = body;

    if (!title || !description || !youtubeUrl) {
      return NextResponse.json({ success: false, message: 'Title, description, and YouTube URL are required' }, { status: 400 });
    }

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json({ success: false, message: 'Invalid YouTube URL' }, { status: 400 });
    }

    let slug = slugify(title);
    let counter = 1;
    while (await dataStore.getVlogBySlug(slug)) slug = `${slugify(title)}-${counter++}`;

    const thumbnailUrl = customThumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    const formattedTags = Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean);

    const vlog = await dataStore.createVlog({
      title, slug, description, youtubeUrl, youtubeId, thumbnailUrl,
      duration: duration || '18:00', category: category || 'Road Trips',
      tags: formattedTags, locationName: locationName || 'Kerala, India',
      isFeatured: Boolean(isFeatured), isPopular: Boolean(isPopular),
      publishedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Vlog created!', data: vlog }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
