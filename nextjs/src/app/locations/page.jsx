'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoc, setSelectedLoc] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.getLocations();
        if (res?.success) {
          setLocations(res.data);
          if (res.data.length > 0) setSelectedLoc(res.data[0]);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="section-pad">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Travel Diary</span>
          <h2>Adventures & Locations Visited</h2>
          <p>
            From the hairpin bends of Munnar to the quiet backwaters of Alleppey. Here are the places that have shaped our vlogging journey.
          </p>
        </div>

        {/* Interactive Highlight Bar */}
        {selectedLoc && (
          <div className="location-spotlight">
            <div>
              <span className="badge">Featured Destination</span>
              <h3 style={{ fontSize: '32px', color: 'var(--gold)', marginTop: '8px', marginBottom: '6px' }}>
                {selectedLoc.name}
              </h3>
              <div style={{ fontSize: '13px', color: 'var(--stone)', marginBottom: '14px' }}>
                📍 {selectedLoc.state}, {selectedLoc.country} · Visited: {selectedLoc.visitedDate} · Lat: {selectedLoc.coordinates?.lat}, Lng: {selectedLoc.coordinates?.lng}
              </div>
              <p style={{ color: 'var(--cream)', fontSize: '15.5px', lineHeight: 1.65 }}>
                {selectedLoc.description}
              </p>
            </div>

            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '240px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0c0b' }}>
              <img src={selectedLoc.coverImage} alt="" className="location-bg-blur" aria-hidden="true" />
              <img
                src={selectedLoc.coverImage}
                alt={selectedLoc.name}
                style={{ position: 'relative', zIndex: 1, maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
              />
            </div>
          </div>
        )}

        {/* Locations Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton', fontSize: '20px' }}>
            Loading Adventures...
          </div>
        ) : locations.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--line)' }}>
            <h3 style={{ color: 'var(--gold)', fontSize: '20px', marginBottom: '8px' }}>No Destinations Added Yet 📍</h3>
            <p style={{ color: 'var(--stone)', fontSize: '14px' }}>New locations and travel spots will appear here once added in the admin panel.</p>
          </div>
        ) : (
          <div className="locations-grid">
            {locations.map(loc => (
              <div
                key={loc._id}
                className="location-card"
                onClick={() => setSelectedLoc(loc)}
                style={{ cursor: 'pointer' }}
              >
                <div className="location-img-frame">
                  <img
                    src={loc.coverImage || '/assets/images/about_roadtrip.jpg'}
                    alt=""
                    className="location-bg-blur"
                    aria-hidden="true"
                  />
                  <img
                    src={loc.coverImage || '/assets/images/about_roadtrip.jpg'}
                    alt={loc.name}
                    className="location-cover"
                    loading="lazy"
                  />
                </div>
                <div className="location-body">
                  <div className="location-coords">
                    📍 {loc.state}, {loc.country} • {loc.visitedDate}
                  </div>
                  <h3 className="location-title">{loc.name}</h3>
                  <p style={{ color: 'var(--stone)', fontSize: '14.5px', lineHeight: 1.6, flexGrow: 1 }}>
                    {loc.description}
                  </p>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--stone)' }}>
                      GPS: {loc.coordinates?.lat}° N, {loc.coordinates?.lng}° E
                    </span>
                    <span style={{ color: 'var(--gold)', fontSize: '12.5px', fontWeight: 800 }}>
                      View Focus →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
