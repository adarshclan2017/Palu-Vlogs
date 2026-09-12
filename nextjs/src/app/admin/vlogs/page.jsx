'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';

const categories = ['Road Trips', 'Pranks & Comedy', 'Street Food', 'Backwater Adventures', 'Behind the Scenes'];

export default function ManageVlogsPage() {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVlog, setEditingVlog] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    category: 'Road Trips',
    tags: 'Vegetable Gang, Kerala',
    locationName: 'Kerala, India',
    duration: '18:00',
    isFeatured: false,
    isPopular: false
  });

  const fetchVlogs = async () => {
    setLoading(true);
    try {
      const res = await api.getVlogs({ limit: 50 });
      if (res?.success && Array.isArray(res.data)) setVlogs(res.data);
    } catch (err) {
      console.error('Error loading vlogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVlogs();
  }, []);

  const openAddModal = () => {
    setEditingVlog(null);
    setFormData({
      title: '',
      youtubeUrl: '',
      description: '',
      category: 'Road Trips',
      tags: 'Vegetable Gang, Kerala',
      locationName: 'Kerala, India',
      duration: '18:00',
      isFeatured: false,
      isPopular: false
    });
    setModalOpen(true);
  };

  const openEditModal = (vlog) => {
    setEditingVlog(vlog);
    setFormData({
      title: vlog.title,
      youtubeUrl: vlog.youtubeUrl || `https://www.youtube.com/watch?v=${vlog.youtubeId}`,
      description: vlog.description,
      category: vlog.category || 'Road Trips',
      tags: Array.isArray(vlog.tags) ? vlog.tags.join(', ') : vlog.tags || '',
      locationName: vlog.locationName || 'Kerala, India',
      duration: vlog.duration || '18:00',
      isFeatured: Boolean(vlog.isFeatured),
      isPopular: Boolean(vlog.isPopular)
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVlog) {
        const res = await api.updateVlog(editingVlog._id, formData);
        if (res?.success) {
          setToast({ message: 'Vlog updated successfully!', type: 'success' });
        }
      } else {
        const res = await api.createVlog(formData);
        if (res?.success) {
          setToast({ message: 'Vlog created successfully in MongoDB Atlas!', type: 'success' });
        }
      }
      setModalOpen(false);
      fetchVlogs();
    } catch (err) {
      setToast({ message: err.message || 'Operation failed', type: 'error' });
    }
  };

  const handleDelete = async (id, title) => {
    if (typeof window !== 'undefined' && !window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await api.deleteVlog(id);
      if (res?.success) {
        setToast({ message: 'Vlog deleted successfully', type: 'success' });
        fetchVlogs();
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete vlog', type: 'error' });
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Manage Vlogs</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Publish, edit, or delete video episodes with automatic YouTube parsing
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '10px 20px' }}>
          + Add New Vlog
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton' }}>
          Loading Vlogs...
        </div>
      ) : vlogs.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--stone)' }}>No vlogs published yet. Click "Add New Vlog" to start!</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Category</th>
                <th>Views</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vlogs.map(vlog => (
                <tr key={vlog._id || vlog.slug}>
                  <td style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img
                      src={vlog.thumbnailUrl}
                      alt={vlog.title}
                      style={{ width: '80px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--cream)', maxWidth: '300px' }}>{vlog.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--stone)' }}>Duration: {vlog.duration}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge">{vlog.category}</span>
                  </td>
                  <td>{(vlog.views || 0).toLocaleString()}</td>
                  <td>
                    {vlog.isFeatured && <span className="badge" style={{ background: 'var(--red)', color: '#fff', marginRight: '4px' }}>Featured</span>}
                    {vlog.isPopular && <span className="badge">Popular</span>}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--stone)' }}>
                    {vlog.publishedAt ? new Date(vlog.publishedAt).toLocaleDateString() : 'Recent'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(vlog)}
                        className="share-btn"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        Edit ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(vlog._id, vlog.title)}
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '20px' }}>
              {editingVlog ? 'Edit Vlog Episode' : 'Add New YouTube Vlog'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">YouTube Video URL *</label>
                <input
                  type="text"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  required
                  className="form-input"
                />
                <span style={{ fontSize: '11px', color: 'var(--stone)' }}>
                  Paste any YouTube URL. Video ID and thumbnails are extracted automatically!
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Episode Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Munnar Fog & The Lost Drumstick Suit"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the adventure, road trip story, and timestamps..."
                  required
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="18:30"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    placeholder="Munnar, Kerala"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Kerala, RoadTrip, Food"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', margin: '16px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>⭐ Featured Episode</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  />
                  <span>🔥 Popular / Viral</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingVlog ? 'Save Changes' : 'Publish Episode 🚀'}
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
