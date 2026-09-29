'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const VLOG_REACTIONS = [
  { key: 'fire', emoji: '🔥' },
  { key: 'heart', emoji: '❤️' },
  { key: 'laugh', emoji: '😂' },
  { key: 'shock', emoji: '🚀' }
];

export default function VlogCard({ vlog, onPlay }) {
  const rawReactions = vlog?.reactions || {};
  const initialMap = rawReactions instanceof Map ? Object.fromEntries(rawReactions) : rawReactions;

  const [reactions, setReactions] = useState({
    fire: Number(initialMap.fire || 0),
    heart: Number(initialMap.heart || 0),
    laugh: Number(initialMap.laugh || 0),
    shock: Number(initialMap.shock || 0)
  });
  const [popKey, setPopKey] = useState(null);

  if (!vlog) return null;

  const handlePlayClick = (e) => {
    if (onPlay) {
      e.preventDefault();
      onPlay(vlog);
    }
  };

  const handleReact = async (e, rKey) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    setReactions((prev) => ({
      ...prev,
      [rKey]: (prev[rKey] || 0) + 1
    }));
    setPopKey(rKey);
    setTimeout(() => setPopKey(null), 700);

    try {
      const res = await api.reactToVlog(vlog.slug, rKey);
      if (res?.success && res.reactions) {
        setReactions(res.reactions);
      }
    } catch (err) {
      console.error('Vlog reaction error:', err);
    }
  };

  const handleWhatsAppShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = `Watch this episode of Palu Vlogs: "${vlog.title}" 🛵🎬\n${siteUrl}/vlogs/${vlog.slug}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="vlog-card">
      <div className="vlog-thumb-wrap" onClick={handlePlayClick} style={{ cursor: onPlay ? 'pointer' : 'default' }}>
        <img
          src={vlog.thumbnailUrl || (vlog.youtubeId ? `https://img.youtube.com/vi/${vlog.youtubeId}/hqdefault.jpg` : '/assets/images/hero_team.jpg')}
          alt={vlog.title}
          className="vlog-thumb"
          loading="lazy"
        />
        {vlog.duration && <div className="vlog-badge">{vlog.duration}</div>}
        <div className="vlog-duration">{vlog.duration || '15:00'}</div>
        <div className="vlog-play-overlay">
          <div className="play-circle">▶</div>
        </div>
      </div>

      <div className="vlog-body">
        <div className="vlog-meta">
          <span>📅 {vlog.publishedAt ? new Date(vlog.publishedAt).toLocaleDateString() : 'Recent'}</span>
          <span>•</span>
          <span>👀 {(vlog.views || 1200).toLocaleString()} Views</span>
        </div>

        <Link href={`/vlogs/${vlog.slug}`} style={{ textDecoration: 'none' }}>
          <h3 className="vlog-title">{vlog.title}</h3>
        </Link>

        <p className="vlog-desc">{vlog.description}</p>

        {/* ── VLOG INTERACTION ROW ── */}
        <div className="vlog-react-row">
          <div className="vlog-emoji-group">
            {VLOG_REACTIONS.map(({ key, emoji }) => {
              const count = reactions[key] || 0;
              const isPopping = popKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`vlog-react-chip ${isPopping ? 'pop-active' : ''}`}
                  onClick={(e) => handleReact(e, key)}
                  title={`React ${emoji} (${count})`}
                  aria-label={`${key}: ${count}`}
                >
                  <span className="vlog-emoji-icon">{emoji}</span>
                  <span className="vlog-emoji-num">{count}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="vlog-wa-btn"
            onClick={handleWhatsAppShare}
            title="Share vlog on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            💬 Share
          </button>
        </div>

        <div className="vlog-footer">
          <span style={{ color: 'var(--stone)' }}>📍 {vlog.locationName || 'Kerala'}</span>
          <Link href={`/vlogs/${vlog.slug}`} className="vlog-link-btn">
            Watch Full Vlog →
          </Link>
        </div>
      </div>
    </article>
  );
}
