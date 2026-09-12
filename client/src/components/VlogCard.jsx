import React from 'react';
import { Link } from 'react-router-dom';

const VlogCard = ({ vlog, onPlay }) => {
  if (!vlog) return null;

  const handlePlayClick = (e) => {
    if (onPlay) {
      e.preventDefault();
      onPlay(vlog);
    }
  };

  return (
    <article className="vlog-card">
      <div className="vlog-thumb-wrap" onClick={handlePlayClick}>
        <img
          src={vlog.thumbnailUrl || '/assets/images/about_roadtrip.jpg'}
          alt={vlog.title}
          className="vlog-thumb"
          loading="lazy"
        />
        <div className="vlog-badge">{vlog.category || 'Road Trip'}</div>
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

        <Link to={`/vlogs/${vlog.slug}`} style={{ textDecoration: 'none' }}>
          <h3 className="vlog-title">{vlog.title}</h3>
        </Link>

        <p className="vlog-desc">{vlog.description}</p>

        <div className="vlog-footer">
          <span style={{ color: 'var(--stone)' }}>📍 {vlog.locationName || 'Kerala'}</span>
          <Link to={`/vlogs/${vlog.slug}`} className="vlog-link-btn">
            Watch Full Vlog →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default VlogCard;
