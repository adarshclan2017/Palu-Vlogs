import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Toast from '../../components/Toast';

const ManageGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Upload form state
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [albumSlug, setAlbumSlug] = useState('season-2-road-trips');
  const [location, setLocation] = useState('Kerala');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.getPhotos();
      if (res.success) {
        setPhotos(res.data);
        if (res.albums) setAlbums(res.albums);
      }
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('caption', caption);
      formData.append('albumSlug', albumSlug);
      formData.append('location', location);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      } else {
        throw new Error('Please select an image file or enter an image URL');
      }

      const res = await api.createPhoto(formData);
      if (res.success) {
        setToast({ message: 'Photo uploaded successfully!', type: 'success' });
        setModalOpen(false);
        setTitle('');
        setCaption('');
        setImageFile(null);
        setImageUrl('');
        fetchGallery();
      }
    } catch (err) {
      setToast({ message: err.message || 'Upload failed', type: 'error' });
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete photo "${title}"?`)) return;
    try {
      const res = await api.deletePhoto(id);
      if (res.success) {
        setToast({ message: 'Photo deleted successfully', type: 'success' });
        fetchGallery();
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete photo', type: 'error' });
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Manage Photo Gallery</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Upload, organize into albums, and manage photo captures
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn-gold" style={{ padding: '10px 20px' }}>
          + Upload New Photo
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton' }}>
          Loading Photos...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {photos.map(photo => (
            <div
              key={photo._id}
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span className="badge" style={{ marginBottom: '8px', alignSelf: 'flex-start' }}>
                  {photo.albumSlug || 'General'}
                </span>
                <h4 style={{ fontFamily: 'Anton', fontSize: '16px', color: 'var(--cream)', marginBottom: '4px' }}>
                  {photo.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--stone)', flexGrow: 1 }}>{photo.caption}</p>

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--stone)' }}>📍 {photo.location}</span>
                  <button
                    onClick={() => handleDelete(photo._id, photo.title)}
                    style={{ background: 'none', border: 'none', color: '#ff604c', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '20px' }}>
              Upload Photo to Gallery
            </h3>

            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Photo Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Onion Star on NH 66"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Caption / Description</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Taking the hairpin curves of Munnar"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Select Album</label>
                  <select
                    value={albumSlug}
                    onChange={(e) => setAlbumSlug(e.target.value)}
                    className="form-select"
                  >
                    {albums.map(a => <option key={a.slug} value={a.slug}>{a.title}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Munnar, Kerala"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="form-input"
                  style={{ padding: '8px' }}
                />
              </div>

              <div style={{ textAlign: 'center', color: 'var(--stone)', fontSize: '13px', margin: '8px 0' }}>— OR —</div>

              <div className="form-group">
                <label className="form-label">Image URL / Path</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/assets/images/... or https://..."
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                Upload & Publish 📸
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ManageGallery;
