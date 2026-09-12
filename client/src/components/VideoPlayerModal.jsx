import React, { useEffect } from 'react';

const VideoPlayerModal = ({ vlog, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!vlog) return null;

  const embedUrl = vlog.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${vlog.youtubeId}?autoplay=1&rel=0&modestbranding=1`
    : 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '920px', padding: 0, overflow: 'hidden', background: '#000' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          style={{ top: '14px', right: '14px', color: '#fff', zIndex: 10, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: 36, height: 36 }}
        >
          ✕
        </button>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          <iframe
            src={embedUrl}
            title={vlog.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div style={{ padding: '24px', background: 'var(--panel)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span className="badge">{vlog.category}</span>
            <span style={{ fontSize: '13px', color: 'var(--stone)' }}>📍 {vlog.locationName || 'Kerala'}</span>
          </div>
          <h3 style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '10px' }}>{vlog.title}</h3>
          <p style={{ color: 'var(--stone)', fontSize: '15px', lineHeight: 1.6 }}>{vlog.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
