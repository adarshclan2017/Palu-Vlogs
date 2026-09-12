import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PhotoLightbox from '../components/PhotoLightbox';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const params = activeAlbum !== 'all' ? { album: activeAlbum } : {};
        const res = await api.getPhotos(params);
        if (res.success) {
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

  return (
    <div className="section-pad">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Photo Archive</span>
          <h2>Moments from the Road</h2>
          <p>
            Unfiltered snapshots of the Vegetable Gang across Kerala. Select an album below or click any photo to open full-screen!
          </p>
        </div>

        {/* Album Filters */}
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

        {/* Photos Grid */}
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
            {photos.map((photo, index) => (
              <div
                key={photo._id || index}
                className="gallery-card"
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="gallery-img"
                  loading="lazy"
                />
                <div className="gallery-caption">{photo.title}</div>
                {photo.location && (
                  <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '2px' }}>
                    📍 {photo.location}
                  </div>
                )}
              </div>
            ))}
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
        />
      )}
    </div>
  );
};

export default Gallery;
