import { NextResponse } from 'next/server';

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

/** Convert ISO 8601 duration (PT1H2M30S) → "1:02:30" or "2:30" */
function parseDuration(iso) {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Format large numbers → "1.2M", "345K" */
function formatViews(count) {
  const n = parseInt(count || '0', 10);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

// GET /api/youtube-meta?url=...
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ success: false, message: 'YouTube URL required' }, { status: 400 });
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return NextResponse.json({ success: false, message: 'Invalid YouTube URL' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    // If we have a YouTube Data API key, use it for accurate data
    if (apiKey) {
      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails,statistics`;
      const res = await fetch(apiUrl);
      const json = await res.json();

      if (json.items && json.items.length > 0) {
        const item = json.items[0];
        const snippet = item.snippet || {};
        const stats = item.statistics || {};
        const details = item.contentDetails || {};

        return NextResponse.json({
          success: true,
          data: {
            videoId,
            title: snippet.title || '',
            description: snippet.description || '',
            duration: parseDuration(details.duration),
            views: formatViews(stats.viewCount),
            viewCount: parseInt(stats.viewCount || '0', 10),
            thumbnailUrl: snippet.thumbnails?.maxres?.url
              || snippet.thumbnails?.high?.url
              || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            publishedAt: snippet.publishedAt,
            channelTitle: snippet.channelTitle,
          }
        });
      }

      return NextResponse.json({ success: false, message: 'Video not found on YouTube' }, { status: 404 });
    }

    // Fallback: scrape oEmbed (no API key needed — gives title only)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oRes = await fetch(oEmbedUrl);
    if (!oRes.ok) {
      return NextResponse.json({ success: false, message: 'Could not fetch YouTube data. Add YOUTUBE_API_KEY to .env for full details.' }, { status: 422 });
    }
    const oData = await oRes.json();

    return NextResponse.json({
      success: true,
      partial: true, // signals that we only got partial data (no duration/views)
      data: {
        videoId,
        title: oData.title || '',
        description: '',
        duration: null,
        views: null,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      }
    });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
