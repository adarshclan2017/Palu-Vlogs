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
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Convert seconds integer → "1:02:30" or "18:30" */
function secondsToDuration(secs) {
  const total = parseInt(secs, 10);
  if (isNaN(total) || total <= 0) return null;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const FETCH_OPTS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  }
};

/**
 * Try to scrape the YouTube watch page HTML.
 * Extracts: title, description, duration (lengthSeconds), viewCount from
 * ytInitialPlayerResponse which YouTube embeds as JSON in every page.
 */
async function scrapeYouTubePage(videoId) {
  const urls = [
    `https://www.youtube.com/watch?v=${videoId}`,
    `https://m.youtube.com/watch?v=${videoId}`,         // mobile — lighter page
  ];

  for (const pageUrl of urls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(pageUrl, { ...FETCH_OPTS, signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const html = await res.text();

      const result = { title: null, description: null, duration: null, viewCount: null };

      // ── ytInitialPlayerResponse (most reliable source) ──
      const playerMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{(?:[^{}]|\{[^{}]*\})*videoDetails[^;]*?\});/s)
        || html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;/s);

      if (playerMatch) {
        try {
          const player = JSON.parse(playerMatch[1]);
          const d = player?.videoDetails || {};
          result.title       = d.title || null;
          result.description = d.shortDescription || null;
          result.viewCount   = d.viewCount ? parseInt(d.viewCount, 10) : null;
          result.duration    = secondsToDuration(d.lengthSeconds);
        } catch (_) { /* JSON parse failed, try next method */ }
      }

      // ── JSON-LD VideoObject fallback ──
      if (!result.title || !result.duration) {
        const ldMatches = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
        for (const ldMatch of ldMatches) {
          try {
            const ld = JSON.parse(ldMatch[1]);
            const entries = Array.isArray(ld) ? ld : [ld];
            const video = entries.find(x => x?.['@type'] === 'VideoObject');
            if (video) {
              if (!result.title)       result.title = video.name || null;
              if (!result.description) result.description = video.description || null;
              if (!result.duration)    result.duration = parseDuration(video.duration);
              if (result.viewCount == null) {
                const stats = Array.isArray(video.interactionStatistic)
                  ? video.interactionStatistic : [video.interactionStatistic];
                const ws = stats.find(s => JSON.stringify(s).includes('WatchAction'));
                if (ws) result.viewCount = parseInt(ws.userInteractionCount || '0', 10);
              }
              break;
            }
          } catch (_) { /* ignore */ }
        }
      }

      // ── Simple regex fallbacks for title ──
      if (!result.title) {
        const tm = html.match(/<title>([^<]+)<\/title>/i);
        if (tm) result.title = tm[1].replace(/ - YouTube$/i, '').trim();
      }

      // If we got at least a title, return the result
      if (result.title) return result;
    } catch (err) {
      console.warn(`Scrape failed for ${pageUrl}:`, err.message);
    }
  }

  return null;
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

    // ── Strategy 1: YouTube Data API v3 (if API key configured) ──
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 8000);
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails,statistics`;
        const res = await fetch(apiUrl, { signal: controller.signal });
        const json = await res.json();

        if (json.items?.length > 0) {
          const item = json.items[0];
          return NextResponse.json({
            success: true,
            data: {
              videoId,
              title: item.snippet?.title || '',
              description: item.snippet?.description || '',
              duration: parseDuration(item.contentDetails?.duration),
              viewCount: parseInt(item.statistics?.viewCount || '0', 10),
              thumbnailUrl: item.snippet?.thumbnails?.maxres?.url
                || item.snippet?.thumbnails?.high?.url
                || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            }
          });
        }
      } catch (_) { /* fall through */ }
    }

    // ── Strategy 2: Scrape YouTube page ──
    const scraped = await scrapeYouTubePage(videoId);
    if (scraped?.title) {
      return NextResponse.json({
        success: true,
        data: {
          videoId,
          title: scraped.title,
          description: scraped.description || '',
          duration: scraped.duration,
          viewCount: scraped.viewCount,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        }
      });
    }

    // ── Strategy 3: noembed.com (title + thumbnail only) ──
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 6000);
      const noEmbedRes = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
        { signal: controller.signal }
      );
      if (noEmbedRes.ok) {
        const noEmbedData = await noEmbedRes.json();
        if (noEmbedData?.title) {
          return NextResponse.json({
            success: true,
            partial: true,
            message: 'Only title was fetched. Duration and views must be entered manually.',
            data: {
              videoId,
              title: noEmbedData.title,
              description: '',
              duration: null,
              viewCount: null,
              thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            }
          });
        }
      }
    } catch (_) { /* ignore */ }

    return NextResponse.json({
      success: false,
      message: 'Could not reach YouTube. Please check your internet connection or enter details manually.'
    }, { status: 503 });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
