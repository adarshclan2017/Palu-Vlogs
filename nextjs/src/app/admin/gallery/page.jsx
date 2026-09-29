'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';
import ImageUploader from '@/components/ImageUploader';

export default function ManageGalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [toast, setToast] = useState(null);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [albumSlug, setAlbumSlug] = useState('season-2-road-trips');
  const [location, setLocation] = useState('Kerala');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const openUploadModal = () => {
    setEditingPhoto(null);
    setTitle('');
    setCaption('');
    setAlbumSlug('season-2-road-trips');
    setLocation('Kerala');
    setImageUrl('');
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPhoto(p);
    setTitle(p.title || '');
    setCaption(p.caption || '');
    setAlbumSlug(p.albumSlug || 'season-2-road-trips');
    setLocation(p.location || 'Kerala');
    setImageUrl(p.imageUrl || '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (!imageUrl) throw new Error('Please select an image');

      const payload = {
        title: title.trim(),
        caption: caption.trim(),
        albumSlug,
        location: location.trim(),
        imageUrl
      };

      let res;
      if (editingPhoto) {
        res = await api.updatePhoto(editingPhoto._id, payload);
      } else {
        res = await api.createPhoto(payload);
      }

      if (res?.success) {
        setToast({
          message: editingPhoto ? 'Photo updated successfully! 🖼️' : '🎉 Photo uploaded successfully!',
          type: 'success'
        });
        setModalOpen(false);
        setEditingPhoto(null);
        await fetchGallery();
      } else {
        setToast({ message: res?.message || 'Operation failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Operation failed', type: 'error' });
    } finally {
      setIsSaving(false);
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
            Upload, update, organize into albums, and manage photo captures
          </p>
        </div>

        <button onClick={openUploadModal} className="btn-gold" style={{ padding: '10px 20px' }}>
          + Upload New Photo
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton' }}>
          Loading Photos...
        </div>
      ) : photos.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--stone)' }}>No photos in gallery. Click "+ Upload New Photo" to add one!</p>
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(p)}
                        className="share-btn"
                        style={{ padding: '4px 10px', fontSize: '12px', color: 'var(--gold)' }}
                      >
                        Edit ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.title)}
                        className="share-btn"
                        style={{ padding: '4px 10px', fontSize: '12px', color: '#ff604c' }}
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '20px' }}>
              {editingPhoto ? '✏️ Edit Photo Details' : '🖼️ Add New Photo to Gallery'}
            </h3>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Photo Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunset over Vagamon hills"
                  required
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Album / Category</label>
                  <select
                    value={albumSlug}
                    onChange={(e) => setAlbumSlug(e.target.value)}
                    className="form-select"
                  >
                    <option value="season-2-road-trips">Season 2 Road Trips</option>
                    <option value="street-food-crawls">Street Food Crawls</option>
                    <option value="behind-the-scenes">Behind the Scenes</option>
                    <option value="vegetable-gang-memes">Vegetable Gang Memes</option>
                    <option value="fan-meetups">Fan Meetups</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location Tag</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Vagamon, Kerala"
                    className="form-input"
                  />
                </div>
              </div>

              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Photo Image"
                helpText="Upload a crisp capture (PNG, JPG, WebP) from device"
              />

              <div className="form-group">
                <label className="form-label">Caption / Backstory</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write what happened during this shot..."
                  rows={2}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                  style={{ opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                >
                  {isSaving ? 'Saving... ⏳' : (editingPhoto ? 'Update Photo 💾' : 'Upload to Gallery 🚀')}
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
