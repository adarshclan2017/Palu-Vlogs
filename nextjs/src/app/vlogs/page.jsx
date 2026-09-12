'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import VlogCard from '@/components/VlogCard';
import VideoPlayerModal from '@/components/VideoPlayerModal';

const categories = [
  'All',
  'Road Trips',
  'Pranks & Comedy',
  'Street Food',
  'Backwater Adventures',
  'Behind the Scenes'
];

export default function VlogsPage() {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [activeVideo, setActiveVideo] = useState(null);

  const fetchVlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sort: sortBy === 'views' ? 'views' : 'newest'
      };
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search.trim()) params.search = search.trim();

      const res = await api.getVlogs(params);
      if (res?.success) {
        setVlogs(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || res.data.length);
      }
    } catch (err) {
      console.error('Error fetching vlogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVlogs();
  }, [activeCategory, sortBy, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVlogs();
  };

  return (
    <div className="section-pad">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Video Directory</span>
          <h2>All Vlogs & Episodes</h2>
          <p>
            Explore our complete archive of Kerala road trips, food challenges, and unscripted vegetable adventures.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flexGrow: 1, maxWidth: '480px' }}>
              <input
                type="text"
                placeholder="Search vlogs by title, keyword, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ padding: '10px 16px' }}
              />
              <button type="submit" className="btn-gold" style={{ padding: '10px 18px', whiteSpace: 'nowrap' }}>
                Search 🔍
              </button>
            </form>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--stone)', fontWeight: 700 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="form-select"
                style={{ width: 'auto', padding: '8px 14px', fontSize: '13px' }}
              >
                <option value="newest">Latest Uploads</option>
                <option value="views">Most Popular / Views</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={activeCategory === cat ? 'btn-gold' : 'btn-ghost'}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  borderRadius: 'var(--radius-full)',
                  border: activeCategory === cat ? 'none' : '1px solid var(--line)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div style={{ fontSize: '14px', color: 'var(--stone)', marginBottom: '20px', fontWeight: 600 }}>
          Showing {vlogs.length} of {totalCount} episodes
        </div>

        {/* Vlogs Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton', fontSize: '20px' }}>
            Loading Episodes...
          </div>
        ) : vlogs.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--line)' }}>
            <h3 style={{ color: 'var(--gold)', fontSize: '22px', marginBottom: '8px' }}>No Vlogs Found</h3>
            <p style={{ color: 'var(--stone)' }}>Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="btn-ghost"
              style={{ marginTop: '16px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="vlogs-grid">
            {vlogs.map(vlog => (
              <VlogCard key={vlog._id || vlog.slug} vlog={vlog} onPlay={() => setActiveVideo(vlog)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '48px' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="btn-ghost"
              style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--gold)', fontWeight: 700 }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="btn-ghost"
              style={{ opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && <VideoPlayerModal vlog={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}
