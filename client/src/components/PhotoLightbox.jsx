import React, { useEffect } from 'react';

const PhotoLightbox = ({ photos, currentIndex, onClose, onIndexChange }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, photos]);

  if (!photos || photos.length === 0 || currentIndex < 0) return null;

  const currentPhoto = photos[currentIndex];

  const nextPhoto = (e) => {
    if (e) e.stopPropagation();
    onIndexChange((currentIndex + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    if (e) e.stopPropagation();
    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div className="lightbox-modal" onClick={onClose}>
      <button
        className="modal-close"
        onClick={onClose}
        style={{ top: '24px', right: '24px', fontSize: '26px', color: '#fff', zIndex: 10 }}
      >
        ✕
      </button>

      <button className="lightbox-arrow lightbox-left" onClick={prevPhoto} aria-label="Previous Photo">
        ‹
      </button>

      <div className="lightbox-img-box" onClick={(e) => e.stopPropagation()}>
        <img
          src={currentPhoto.imageUrl}
          alt={currentPhoto.title}
          style={{
            maxWidth: '82vw',
            maxHeight: '72vh',
            objectFit: 'contain',
            borderRadius: '6px',
            border: '3px solid var(--cream)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
          }}
        />

        <div style={{ marginTop: '18px', textAlign: 'center', maxWidth: '640px' }}>
          <h4 style={{ fontFamily: 'Anton', fontSize: '22px', color: 'var(--gold)', letterSpacing: '0.02em' }}>
            {currentPhoto.title}
          </h4>
          {currentPhoto.caption && (
            <p style={{ color: 'var(--cream)', fontSize: '15px', marginTop: '4px' }}>
              {currentPhoto.caption}
            </p>
          )}
          <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--stone)' }}>
            <span>📍 {currentPhoto.location || 'Kerala'}</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>{currentIndex + 1} / {photos.length}</span>
          </div>
        </div>
      </div>

      <button className="lightbox-arrow lightbox-right" onClick={nextPhoto} aria-label="Next Photo">
        ›
      </button>
    </div>
  );
};

export default PhotoLightbox;
