import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Toast from '../../components/Toast';

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    state: 'Kerala',
    country: 'India',
    description: '',
    coverImage: '/assets/images/about_roadtrip.jpg',
    visitedDate: '2026',
    lat: '10.0',
    lng: '76.5'
  });

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await api.getLocations();
      if (res.success) setLocations(res.data);
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
    setEditingLoc(null);
    setFormData({
      name: '',
      state: 'Kerala',
      country: 'India',
      description: '',
      coverImage: '/assets/images/about_roadtrip.jpg',
      visitedDate: '2026',
      lat: '10.0889',
      lng: '77.0595'
    });
    setModalOpen(true);
  };

  const openEditModal = (loc) => {
    setEditingLoc(loc);
    setFormData({
      name: loc.name,
      state: loc.state,
      country: loc.country,
      description: loc.description,
      coverImage: loc.coverImage,
      visitedDate: loc.visitedDate || '2026',
      lat: loc.coordinates?.lat?.toString() || '10.0',
      lng: loc.coordinates?.lng?.toString() || '76.5'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('state', formData.state);
      form.append('country', formData.country);
      form.append('description', formData.description);
      form.append('coverImage', formData.coverImage);
      form.append('visitedDate', formData.visitedDate);
      form.append('lat', formData.lat);
      form.append('lng', formData.lng);

      if (editingLoc) {
        await api.updateLocation(editingLoc._id, form);
        setToast({ message: 'Location updated successfully!', type: 'success' });
      } else {
        await api.createLocation(form);
        setToast({ message: 'Location created successfully!', type: 'success' });
      }
      setModalOpen(false);
      fetchLocations();
    } catch (err) {
      setToast({ message: err.message || 'Operation failed', type: 'error' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete destination "${name}"?`)) return;
    try {
      const res = await api.deleteLocation(id);
      if (res.success) {
        setToast({ message: 'Location deleted', type: 'success' });
        fetchLocations();
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete', type: 'error' });
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Manage Travel Destinations</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Add, update, or remove road trip destinations across Kerala
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
      ) : (
        <div className="locations-grid">
          {locations.map(loc => (
            <div key={loc._id} className="location-card">
              <div className="location-img-frame">
                <img src={loc.coverImage} alt={loc.name} className="location-cover" />
              </div>
              <div className="location-body">
                <div className="location-coords">📍 {loc.state}, {loc.country} · {loc.visitedDate}</div>
                <h3 className="location-title">{loc.name}</h3>
                <p style={{ color: 'var(--stone)', fontSize: '14px', lineHeight: 1.6, flexGrow: 1 }}>
                  {loc.description}
                </p>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                  <button onClick={() => openEditModal(loc)} className="share-btn" style={{ fontSize: '12px', padding: '4px 12px' }}>
                    Edit ✏️
                  </button>
                  <button onClick={() => handleDelete(loc._id, loc.name)} className="share-btn" style={{ fontSize: '12px', padding: '4px 12px', color: '#ff604c' }}>
                    Delete 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>

            <h3 style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '20px' }}>
              {editingLoc ? 'Edit Destination' : 'Add New Destination'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Location Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Munnar Tea Hills"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="text"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="text"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image Path</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                {editingLoc ? 'Save Changes' : 'Create Location 📍'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ManageLocations;
