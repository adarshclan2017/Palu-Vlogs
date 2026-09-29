'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';
import ImageUploader from '@/components/ImageUploader';

export default function ManageLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [toast, setToast] = useState(null);

  const [name, setName] = useState('');
  const [state, setState] = useState('Kerala');
  const [country, setCountry] = useState('India');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [visitedDate, setVisitedDate] = useState('2026');
  const [isSaving, setIsSaving] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await api.getLocations();
      if (res?.success && Array.isArray(res.data)) setLocations(res.data);
    } catch (err) {
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openAddModal = () => {
    setEditingLocation(null);
    setName('');
    setState('Kerala');
    setCountry('India');
    setDescription('');
    setCoverImage('');
    setVisitedDate('2026');
    setModalOpen(true);
  };

  const openEditModal = (loc) => {
    setEditingLocation(loc);
    setName(loc.name || '');
    setState(loc.state || 'Kerala');
    setCountry(loc.country || 'India');
    setDescription(loc.description || '');
    setCoverImage(loc.coverImage || '');
    setVisitedDate(loc.visitedDate || '2026');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        state: state.trim(),
        country: country.trim(),
        description: description.trim(),
        coverImage: coverImage ? coverImage.trim() : '',
        visitedDate: visitedDate.trim()
      };

      let res;
      if (editingLocation) {
        res = await api.updateLocation(editingLocation._id, payload);
      } else {
        res = await api.createLocation(payload);
      }

      if (res?.success) {
        setToast({
          message: editingLocation ? 'Destination updated successfully! 📍' : 'Destination added successfully! 📍',
          type: 'success'
        });
        setModalOpen(false);
        setEditingLocation(null);
        await fetchLocations();
      } else {
        setToast({ message: res?.message || 'Operation failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to save destination', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, locName) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete destination "${locName}"?`)) return;
    try {
      const res = await api.deleteLocation(id);
      if (res?.success) {
        setToast({ message: 'Destination deleted successfully', type: 'success' });
        fetchLocations();
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete destination', type: 'error' });
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Places Explored (Destinations)</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Add, update, or remove the road trip routes and scenic spots explored by the gang
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary" style={{ padding: '10px 20px' }}>
          + Add New Destination
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton' }}>
          Loading Destinations...
        </div>
      ) : locations.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--stone)' }}>No destinations added yet. Click "+ Add New Destination" to start!</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Destination</th>
                <th>Region</th>
                <th>Visited</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(loc => (
                <tr key={loc._id}>
                  <td>
                    {loc.coverImage ? (
                      <img
                        src={loc.coverImage}
                        alt={loc.name}
                        style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ width: '80px', height: '50px', background: 'var(--panel-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '20px' }}>
                        📍
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--cream)' }}>{loc.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--stone)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {loc.description}
                    </div>
                  </td>
                  <td>📍 {loc.state}, {loc.country}</td>
                  <td>{loc.visitedDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(loc)}
                        className="share-btn"
                        style={{ padding: '4px 10px', fontSize: '12px', color: 'var(--gold)' }}
                      >
                        Edit ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(loc._id, loc.name)}
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
              {editingLocation ? '✏️ Edit Travel Destination' : '📍 Add Travel Destination'}
            </h3>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Destination Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Athirappilly Waterfalls"
                  required
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <ImageUploader
                value={coverImage}
                onChange={setCoverImage}
                label="Destination Cover Image"
                helpText="Select scenic cover photo from device or drag & drop"
              />

              <div className="form-group">
                <label className="form-label">Visited Period</label>
                <input
                  type="text"
                  value={visitedDate}
                  onChange={(e) => setVisitedDate(e.target.value)}
                  placeholder="e.g. October 2025"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Highlight key scenery, road condition, and memories..."
                  required
                  rows={3}
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
                  {isSaving ? 'Saving... ⏳' : (editingLocation ? 'Update Destination 💾' : 'Save Destination 📍')}
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
