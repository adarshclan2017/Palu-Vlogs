import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import dataStore from '@/lib/dataStore';

export async function POST(request, { params }) {
  try {
    await connectDB().catch(() => {});
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Photo ID is required' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const reaction = body.reaction || 'love';

    const reactions = await dataStore.reactPhoto(id, reaction);
    const totalReactions = Object.values(reactions || {}).reduce((acc, count) => acc + (Number(count) || 0), 0);

    return NextResponse.json({
      success: true,
      reactions,
      totalReactions
    });
  } catch (err) {
    console.error('Gallery react API error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
