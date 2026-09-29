'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.getLocations();
        if (res?.success) {
          setLocations(res.data);
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
          <h2>Locations Visited</h2>
          <p>
            From the hairpin bends of Munnar to the quiet backwaters of Alleppey. Here are the places that have shaped our vlogging journey.
          </p>
        </div>

        {/* Locations Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton', fontSize: '20px' }}>
            Loading Locations...
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
              >
                {loc.coverImage ? (
                  <div className="location-img-frame">
                    <img
                      src={loc.coverImage}
                      alt=""
                      className="location-bg-blur"
                      aria-hidden="true"
                    />
                    <img
                      src={loc.coverImage}
                      alt={loc.name}
                      className="location-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div style={{ height: '160px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                    📍
                  </div>
                )}
                <div className="location-body">
                  <div className="location-coords">
                    📍 {loc.state}, {loc.country} • {loc.visitedDate}
                  </div>
                  <h3 className="location-title">{loc.name}</h3>
                  <p style={{ color: 'var(--stone)', fontSize: '14.5px', lineHeight: 1.6, flexGrow: 1 }}>
                    {loc.description}
                  </p>
                  {loc.coordinates?.lat && (
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--stone)' }}>
                        GPS: {loc.coordinates?.lat}° N, {loc.coordinates?.lng}° E
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
