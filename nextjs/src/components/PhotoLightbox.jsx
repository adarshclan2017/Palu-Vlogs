'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const EMOJIS = [
  { key: 'love', emoji: '❤️', label: 'Love' },
  { key: 'fire', emoji: '🔥', label: 'Fire' },
  { key: 'wow', emoji: '😍', label: 'Awesome' },
  { key: 'laugh', emoji: '😂', label: 'Haha' },
  { key: 'clap', emoji: '👏', label: 'Clap' },
];

export default function PhotoLightbox({ photos, currentIndex, onClose, onIndexChange, onPhotoUpdate }) {
  const [reactions, setReactions] = useState({});
  const [burstEmoji, setBurstEmoji] = useState(null);
  const [reacting, setReacting] = useState(false);

  const currentPhoto = photos && photos[currentIndex] ? photos[currentIndex] : null;

  useEffect(() => {
    if (currentPhoto) {
      const raw = currentPhoto.reactions || {};
      const rMap = raw instanceof Map ? Object.fromEntries(raw) : raw;
      setReactions({
        love: Number(rMap.love || 0),
        fire: Number(rMap.fire || 0),
        wow: Number(rMap.wow || 0),
        laugh: Number(rMap.laugh || 0),
        clap: Number(rMap.clap || 0)
      });
    }
  }, [currentIndex, currentPhoto]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % photos.length);
      if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + photos.length) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, photos, onClose, onIndexChange]);

  if (!photos || photos.length === 0 || currentIndex < 0 || !currentPhoto) return null;

  const nextPhoto = (e) => {
    if (e) e.stopPropagation();
    onIndexChange((currentIndex + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    if (e) e.stopPropagation();
    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
  };

  const handleReact = async (rKey, emojiChar) => {
    if (reacting) return;
    setReacting(true);

    // Optimistic UI update
    const updated = {
      ...reactions,
      [rKey]: (reactions[rKey] || 0) + 1
    };
    setReactions(updated);
    setBurstEmoji(emojiChar);
    setTimeout(() => setBurstEmoji(null), 900);

    if (onPhotoUpdate && currentPhoto) {
      onPhotoUpdate(currentPhoto._id, updated);
    }

    try {
      const res = await api.reactToPhoto(currentPhoto._id, rKey);
      if (res?.success && res.reactions) {
        setReactions(res.reactions);
        if (onPhotoUpdate) onPhotoUpdate(currentPhoto._id, res.reactions);
      }
    } catch (err) {
      console.error('Failed to react:', err);
    } finally {
      setReacting(false);
    }
  };

  const shareOnWhatsApp = (e) => {
    e.stopPropagation();
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = `Check out this photo "${currentPhoto.title}" from Palu Vlogs! 📸✨\n${siteUrl}/gallery`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const totalReactions = Object.values(reactions).reduce((a, b) => a + (Number(b) || 0), 0);

  return (
    <div className="lightbox-modal" onClick={onClose}>
      <button
        className="modal-close"
        onClick={onClose}
        style={{ top: '24px', right: '24px', fontSize: '26px', color: '#fff', zIndex: 10 }}
        aria-label="Close Lightbox"
      >
        ✕
      </button>

      <button className="lightbox-arrow lightbox-left" onClick={prevPhoto} aria-label="Previous Photo">
        ‹
      </button>

      <div className="lightbox-img-box" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        {/* Floating pop animation on react */}
        {burstEmoji && (
          <div className="reaction-burst-anim" aria-hidden="true">
            {burstEmoji}
          </div>
        )}

        <img
          src={currentPhoto.imageUrl}
          alt={currentPhoto.title}
          className="lightbox-img"
        />

        <div style={{ marginTop: '16px', textAlign: 'center', maxWidth: '640px', width: '100%' }}>
          <h4 style={{ fontFamily: 'Anton', fontSize: '22px', color: 'var(--gold)', letterSpacing: '0.02em', margin: '0 0 6px' }}>
            {currentPhoto.title}
          </h4>
          {currentPhoto.caption && (
            <p style={{ color: 'var(--cream)', fontSize: '14.5px', marginTop: '4px', lineHeight: 1.5 }}>
              {currentPhoto.caption}
            </p>
          )}

          <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--stone)' }}>
            <span>📍 {currentPhoto.location || 'Kerala'}</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>{currentIndex + 1} / {photos.length}</span>
            {totalReactions > 0 && (
              <>
                <span style={{ margin: '0 8px' }}>•</span>
                <span style={{ color: 'var(--gold)' }}>✨ {totalReactions} Reactions</span>
              </>
            )}
          </div>

          {/* ── REACTIONS BAR ── */}
          <div className="lightbox-reactions-bar">
            <span className="react-label">React:</span>
            {EMOJIS.map(({ key, emoji, label }) => {
              const count = reactions[key] || 0;
              return (
                <button
                  key={key}
                  type="button"
                  className="reaction-btn"
                  onClick={() => handleReact(key, emoji)}
                  title={`${label} (${count})`}
                  aria-label={`${label}: ${count} reactions`}
                >
                  <span className="reaction-emoji">{emoji}</span>
                  <span className="reaction-count">{count}</span>
                </button>
              );
            })}

            <button
              type="button"
              className="whatsapp-share-btn"
              onClick={shareOnWhatsApp}
              title="Share on WhatsApp"
            >
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>

      <button className="lightbox-arrow lightbox-right" onClick={nextPhoto} aria-label="Next Photo">
        ›
      </button>
    </div>
  );
}
