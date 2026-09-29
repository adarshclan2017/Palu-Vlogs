'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';
import ImageUploader from '@/components/ImageUploader';

const EMPTY_FORM = {
  title: '',
  youtubeUrl: '',
  description: '',
  tags: 'Vegetable Gang, Kanniyakumari',
  locationName: 'Kanniyakumari, Tamil Nadu',
  duration: '',
  views: '',
  isFeatured: false,
  isPopular: false,
  thumbnailUrl: ''
};

export default function ManageVlogsPage() {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVlog, setEditingVlog] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(null); // { type: 'success'|'error'|'partial', msg }

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
    setFormData(EMPTY_FORM);
    setFetchStatus(null);
    setModalOpen(true);
  };

  const openEditModal = (vlog) => {
    setEditingVlog(vlog);
    setFormData({
      title: vlog.title,
      youtubeUrl: vlog.youtubeUrl || `https://www.youtube.com/watch?v=${vlog.youtubeId}`,
      description: vlog.description,
      tags: Array.isArray(vlog.tags) ? vlog.tags.join(', ') : vlog.tags || '',
      locationName: vlog.locationName || 'Kanniyakumari, Tamil Nadu',
      duration: vlog.duration || '',
      views: vlog.views || '',
      isFeatured: Boolean(vlog.isFeatured),
      isPopular: Boolean(vlog.isPopular),
      thumbnailUrl: vlog.thumbnailUrl || ''
    });
    setFetchStatus(null);
    setModalOpen(true);
  };

  // ── Fetch YouTube metadata ──────────────────────────────────────
  const handleFetchYouTubeMeta = async () => {
    const url = formData.youtubeUrl.trim();
    if (!url) {
      setFetchStatus({ type: 'error', msg: 'Please enter a YouTube URL first.' });
      return;
    }
    setIsFetching(true);
    setFetchStatus(null);
    try {
      const res = await fetch(`/api/youtube-meta?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      if (!json.success) {
        setFetchStatus({ type: 'error', msg: json.message || 'Failed to fetch YouTube data.' });
        return;
      }

      const d = json.data;
      setFormData(prev => ({
        ...prev,
        title: d.title || prev.title,
        description: d.description || prev.description,
        duration: d.duration || prev.duration,
        views: d.viewCount != null ? d.viewCount : prev.views,
        thumbnailUrl: d.thumbnailUrl || prev.thumbnailUrl,
      }));

      if (json.partial) {
        setFetchStatus({
          type: 'partial',
          msg: '✅ Title fetched! Duration & views require a YouTube API key (add YOUTUBE_API_KEY to .env.local).'
        });
      } else {
        setFetchStatus({ type: 'success', msg: '✅ All details fetched successfully from YouTube!' });
      }
    } catch (err) {
      setFetchStatus({ type: 'error', msg: err.message || 'Network error fetching YouTube data.' });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
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
      await fetchVlogs();
    } catch (err) {
      setToast({ message: err.message || 'Operation failed', type: 'error' });
    } finally {
      setIsSaving(false);
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

  const statusColors = {
    success: 'var(--green, #4ade80)',
    partial: 'var(--gold)',
    error: '#ff604c',
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Manage Vlogs</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Publish, edit, or delete video episodes — auto-fetch details from YouTube
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
          <p style={{ color: 'var(--stone)' }}>No vlogs published yet. Click &quot;Add New Vlog&quot; to start!</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Video</th>
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
                      <div style={{ fontSize: '12px', color: 'var(--stone)' }}>Duration: {vlog.duration || 'N/A'}</div>
                    </div>
                  </td>
                  <td>{vlog.views != null ? Number(vlog.views).toLocaleString() : '—'}</td>
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
              {/* YouTube URL + Fetch Button */}
              <div className="form-group">
                <label className="form-label">YouTube Video URL *</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) => { setFormData({ ...formData, youtubeUrl: e.target.value }); setFetchStatus(null); }}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    required
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleFetchYouTubeMeta}
                    disabled={isFetching}
                    style={{
                      padding: '10px 16px',
                      background: isFetching ? 'var(--stone)' : 'var(--gold)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: isFetching ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      fontSize: '13px',
                      flexShrink: 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {isFetching ? '⏳ Fetching...' : '🔍 Fetch Details'}
                  </button>
                </div>
                {fetchStatus && (
                  <p style={{ fontSize: '12px', color: statusColors[fetchStatus.type] || 'var(--stone)', marginTop: '6px' }}>
                    {fetchStatus.msg}
                  </p>
                )}
                <span style={{ fontSize: '11px', color: 'var(--stone)' }}>
                  Click &quot;Fetch Details&quot; to auto-fill title, description, duration &amp; views from YouTube.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Episode Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Kanyakumari Sunrise Memories"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the adventure, the team, timestamps..."
                  required
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 18:30 (auto-filled)"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Views (number)</label>
                  <input
                    type="number"
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                    placeholder="e.g. 12000 (auto-filled)"
                    className="form-input"
                    min="0"
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
                    placeholder="Kanniyakumari, Tamil Nadu"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Kanniyakumari, RoadTrip, Food"
                    className="form-input"
                  />
                </div>
              </div>

              <ImageUploader
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                label="Custom Thumbnail (Optional — auto-generated from YouTube by default)"
                helpText="Upload a custom cover photo or leave empty to use YouTube thumbnail"
              />

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
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                  style={{ opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                >
                  {isSaving ? 'Publishing... ⏳' : (editingVlog ? 'Save Changes' : 'Publish Episode 🚀')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast title={toast.title} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
