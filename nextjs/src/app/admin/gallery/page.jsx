'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';

export default function ManageGalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [albumSlug, setAlbumSlug] = useState('season-2-road-trips');
  const [location, setLocation] = useState('Kerala');
  const [imageUrl, setImageUrl] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.getPhotos();
      if (res?.success && Array.isArray(res.data)) {
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
      if (imageUrl) formData.append('imageUrl', imageUrl);
      else throw new Error('Please enter an image URL');

      const res = await api.createPhoto(formData);
      if (res?.success) {
        setToast({ message: 'Photo uploaded successfully!', type: 'success' });
        setModalOpen(false);
        setTitle('');
        setCaption('');
        setImageUrl('');
        fetchGallery();
      }
    } catch (err) {
      setToast({ message: err.message || 'Upload failed', type: 'error' });
    }
  };

  const handleDelete = async (id, title) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete photo "${title}"?`)) return;
    try {
      const res = await api.deletePhoto(id);
      if (res?.success) {
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
      ) : photos.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--stone)' }}>No photos in gallery. Click "Upload New Photo" to add one!</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Title & Caption</th>
                <th>Location</th>
                <th>Album</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {photos.map(p => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--cream)' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--stone)' }}>{p.caption || 'No caption'}</div>
                  </td>
                  <td>📍 {p.location || 'Kerala'}</td>
                  <td><span className="badge">{p.albumSlug || 'General'}</span></td>
                  <td>
                    <button
                      onClick={() => handleDelete(p._id, p.title)}
                      className="share-btn"
                      style={{ padding: '4px 10px', fontSize: '12px', color: '#ff604c' }}
                    >
                      Delete 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '20px' }}>
              Add New Photo to Gallery
            </h3>

            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Photo Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Potato Star at Tea Plantation"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or /assets/images/..."
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Caption / Memory</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Brief fun backstory..."
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Munnar, Kerala"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Album</label>
                  <select
                    value={albumSlug}
                    onChange={(e) => setAlbumSlug(e.target.value)}
                    className="form-select"
                  >
                    <option value="season-2-road-trips">Season 2 Road Trips</option>
                    <option value="vegetable-gang-memories">Vegetable Gang Memories</option>
                    <option value="backwater-diaries">Backwater Diaries</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-gold">
                  Upload Photo 📸
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
