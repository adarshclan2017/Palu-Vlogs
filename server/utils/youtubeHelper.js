/**
 * YouTube URL Helper & Extractor
 */

function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // Pattern matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }

  // Direct 11-char ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

function getYouTubeThumbnail(videoId) {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function getYouTubeEmbedUrl(videoId) {
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

module.exports = {
  extractYouTubeId,
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
  slugify
};
