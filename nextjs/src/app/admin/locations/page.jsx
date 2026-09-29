'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';
import ImageUploader from '@/components/ImageUploader';

export default function ManageLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [name, setName] = useState('');
  const [state, setState] = useState('Kerala');
  const [country, setCountry] = useState('India');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [visitedDate, setVisitedDate] = useState('2026');

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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createLocation({
        name,
        state,
        country,
        description,
        coverImage: coverImage || '/assets/images/about_roadtrip.jpg',
        visitedDate
      });
      if (res?.success) {
        setToast({ message: 'Location added successfully!', type: 'success' });
        setModalOpen(false);
        setName('');
        setDescription('');
        setCoverImage('');
        fetchLocations();
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to add location', type: 'error' });
    }
  };

  const handleDelete = async (id, locName) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete destination "${locName}"?`)) return;
    try {
      const res = await api.deleteLocation(id);
      if (res?.success) {
        setToast({ message: 'Location deleted successfully', type: 'success' });
        fetchLocations();
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete location', type: 'error' });
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Manage Destinations</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Add and manage the road trip routes and scenic pins explored by the gang
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '10px 20px' }}>
          + Add New Destination
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton' }}>
          Loading Destinations...
        </div>
      ) : locations.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--stone)' }}>No destinations added yet.</p>
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
                    <img
                      src={loc.coverImage}
                      alt={loc.name}
                      style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
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
                    <button
                      onClick={() => handleDelete(loc._id, loc.name)}
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

      {/* Add Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '20px' }}>
              Add Travel Destination
            </h3>

            <form onSubmit={handleAdd}>
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
                <button type="submit" className="btn-primary">
                  Save Destination 📍
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
