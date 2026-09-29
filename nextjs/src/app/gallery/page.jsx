'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import PhotoLightbox from '@/components/PhotoLightbox';

const EMOJIS = [
  { key: 'love', emoji: '❤️' },
  { key: 'fire', emoji: '🔥' },
  { key: 'wow', emoji: '😍' },
  { key: 'laugh', emoji: '😂' },
  { key: 'clap', emoji: '👏' }
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [reactingId, setReactingId] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const params = activeAlbum !== 'all' ? { album: activeAlbum } : {};
        const res = await api.getPhotos(params);
        if (res?.success) {
          setPhotos(res.data);
          if (res.albums) setAlbums(res.albums);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [activeAlbum]);

  const handlePhotoUpdate = (photoId, newReactions) => {
    setPhotos(prev =>
      prev.map(p => (p._id === photoId ? { ...p, reactions: newReactions } : p))
    );
  };

  const handleQuickReact = async (e, photo, reactionKey) => {
    e.stopPropagation();
    if (reactingId) return;
    setReactingId(photo._id);

    // Optimistic update
    const cur = photo.reactions || {};
    const curMap = cur instanceof Map ? Object.fromEntries(cur) : cur;
    const nextReactions = {
      ...curMap,
      [reactionKey]: (Number(curMap[reactionKey]) || 0) + 1
    };
    handlePhotoUpdate(photo._id, nextReactions);

    try {
      const res = await api.reactToPhoto(photo._id, reactionKey);
      if (res?.success && res.reactions) {
        handlePhotoUpdate(photo._id, res.reactions);
      }
    } catch (err) {
      console.error('Failed to react:', err);
    } finally {
      setReactingId(null);
    }
  };

  const getReactionSummary = (photo) => {
    const raw = photo.reactions || {};
    const r = raw instanceof Map ? Object.fromEntries(raw) : raw;
    const entries = [
      { key: 'love', emoji: '❤️', count: Number(r.love || 0) },
      { key: 'fire', emoji: '🔥', count: Number(r.fire || 0) },
      { key: 'wow', emoji: '😍', count: Number(r.wow || 0) },
      { key: 'laugh', emoji: '😂', count: Number(r.laugh || 0) },
      { key: 'clap', emoji: '👏', count: Number(r.clap || 0) }
    ].filter(item => item.count > 0);
    const total = entries.reduce((a, b) => a + b.count, 0);
    return { entries, total, raw: r };
  };

  // Photo of the Day: featured photo or first photo
  const photoOfTheDay = photos.find(p => p.isFeatured) || photos[0] || null;
  const potdIndex = photoOfTheDay ? photos.findIndex(p => p._id === photoOfTheDay._id) : -1;

  return (
    <div className="section-pad">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Photo Archive & Fan Reactions</span>
          <h2>Moments from the Road</h2>
          <p>
            Unfiltered snapshots of the Vegetable Gang across Kerala. React to your favourite frames, share with friends, or click any photo to open full-screen!
          </p>
        </div>

        {/* ── PHOTO OF THE DAY SPOTLIGHT ── */}
        {photoOfTheDay && (
          <div className="potd-banner" onClick={() => setLightboxIndex(potdIndex >= 0 ? potdIndex : 0)}>
            <div className="potd-badge">
              <span>🌟 PHOTO OF THE DAY</span>
            </div>

            <div className="potd-content">
              <div className="potd-image-col">
                <img
                  src={photoOfTheDay.imageUrl}
                  alt={photoOfTheDay.title}
                  className="potd-img"
                />
              </div>

              <div className="potd-info-col">
                <span className="potd-kicker">Featured Snapshot</span>
                <h3 className="potd-title">{photoOfTheDay.title}</h3>
                <p className="potd-caption">
                  {photoOfTheDay.caption ||
                    'Captured unscripted on the Kerala highways during the 2026 Vegetable Gang expedition.'}
                </p>

                <div className="potd-meta">
                  <span>📍 {photoOfTheDay.location || 'Kanniyakumari · Kerala'}</span>
                  <span>•</span>
                  <span>🗓️ {photoOfTheDay.date || '2026'}</span>
                </div>

                {/* POTD Reaction Bar */}
                <div className="potd-reactions-wrap" onClick={(e) => e.stopPropagation()}>
                  <span className="potd-react-prompt">Drop a reaction:</span>
                  <div className="potd-reaction-buttons">
                    {EMOJIS.map(({ key, emoji }) => {
                      const summary = getReactionSummary(photoOfTheDay);
                      const count = Number(summary.raw[key] || 0);
                      return (
                        <button
                          key={key}
                          type="button"
                          className="potd-react-btn"
                          onClick={(e) => handleQuickReact(e, photoOfTheDay, key)}
                          title={`React with ${emoji} (${count})`}
                        >
                          <span>{emoji}</span>
                          <span className="potd-react-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ALBUM FILTERS ── */}
        <div className="gallery-filters">
          <button
            onClick={() => setActiveAlbum('all')}
            className={activeAlbum === 'all' ? 'btn-gold' : 'btn-ghost'}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '13px' }}
          >
            All Photos ({photos.length})
          </button>
          {albums.map(alb => (
            <button
              key={alb.slug}
              onClick={() => setActiveAlbum(alb.slug)}
              className={activeAlbum === alb.slug ? 'btn-gold' : 'btn-ghost'}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '13px' }}
            >
              {alb.title}
            </button>
          ))}
        </div>

        {/* ── PHOTOS GRID ── */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton', fontSize: '20px' }}>
            Loading Photos...
          </div>
        ) : photos.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ color: 'var(--gold)' }}>No photos found in this album</h3>
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo, index) => {
              const { entries, total } = getReactionSummary(photo);
              return (
                <div
                  key={photo._id || index}
                  className="gallery-card"
                  onClick={() => setLightboxIndex(index)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${photo.title}`}
                >
                  <div className="gallery-img-container">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="gallery-img"
                      loading="lazy"
                    />

                    {/* Reaction pill floating over top-right */}
                    {total > 0 && (
                      <div className="gallery-reaction-pill" title={`${total} reactions`}>
                        {entries.slice(0, 3).map((e) => (
                          <span key={e.key} style={{ marginRight: '2px' }}>
                            {e.emoji}
                          </span>
                        ))}
                        <span className="gallery-pill-total">{total}</span>
                      </div>
                    )}
                  </div>

                  <div className="gallery-caption">{photo.title}</div>

                  {photo.location && (
                    <div style={{ fontSize: '11px', color: 'var(--stone)', textAlign: 'center', marginTop: '2px' }}>
                      📍 {photo.location}
                    </div>
                  )}

                  {/* Quick-react bar under caption */}
                  <div className="gallery-card-react-bar" onClick={(e) => e.stopPropagation()}>
                    {EMOJIS.map(({ key, emoji }) => {
                      const raw = photo.reactions || {};
                      const r = raw instanceof Map ? Object.fromEntries(raw) : raw;
                      const count = Number(r[key] || 0);
                      return (
                        <button
                          key={key}
                          type="button"
                          className="gallery-quick-react-btn"
                          onClick={(e) => handleQuickReact(e, photo, key)}
                          title={`React ${emoji} (${count})`}
                        >
                          <span className="quick-emoji">{emoji}</span>
                          {count > 0 && <span className="quick-count">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex >= 0 && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onIndexChange={setLightboxIndex}
          onPhotoUpdate={handlePhotoUpdate}
        />
      )}
    </div>
  );
}
