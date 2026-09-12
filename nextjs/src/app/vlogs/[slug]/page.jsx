'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import VlogCard from '@/components/VlogCard';

export default function VlogDetailsPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [vlog, setVlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVlog = async () => {
      setLoading(true);
      try {
        const res = await api.getVlogBySlug(slug);
        if (res?.success && res.data) {
          setVlog(res.data);
          setRelated(res.related || []);
        }
      } catch (err) {
        console.error('Error fetching vlog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVlog();
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton', fontSize: '24px' }}>
        Loading Episode...
      </div>
    );
  }

  if (!vlog) {
    return (
      <div className="section-pad wrap" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--gold)', marginBottom: '16px' }}>Episode Not Found</h2>
        <p style={{ color: 'var(--stone)', marginBottom: '24px' }}>The vlog you are looking for may have been moved or removed.</p>
        <Link href="/vlogs" className="btn-primary">Back to All Vlogs</Link>
      </div>
    );
  }

  const embedUrl = vlog.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${vlog.youtubeId}?autoplay=1&rel=0&modestbranding=1`
    : 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';

  return (
    <div className="vlog-detail-hero">
      <div className="wrap">
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: 'var(--stone)', marginBottom: '20px' }}>
          <Link href="/" style={{ color: 'var(--stone)' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/vlogs" style={{ color: 'var(--stone)' }}>Vlogs</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--gold)' }}>{vlog.title}</span>
        </div>

        {/* Video Player Frame */}
        <div className="vlog-player-frame">
          <iframe
            src={embedUrl}
            title={vlog.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Vlog Details Content */}
        <div className="vlog-detail-content">
          <div className="vlog-detail-header">
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge">{vlog.category}</span>
                {vlog.season && <span className="badge badge-red">Season {vlog.season}</span>}
              </div>

              <h1 className="vlog-detail-title">{vlog.title}</h1>

              <div className="vlog-detail-meta">
                <span>📅 {vlog.publishedAt ? new Date(vlog.publishedAt).toLocaleDateString() : 'Recent'}</span>
                <span>•</span>
                <span>👀 {(vlog.views || 0).toLocaleString()} Views</span>
                <span>•</span>
                <span>📍 {vlog.locationName || 'Kerala, India'}</span>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="vlog-share-bar">
              <button onClick={copyShareLink} className="share-btn">
                {copied ? '✅ Link Copied!' : '🔗 Share'}
              </button>
              <a
                href={typeof window !== 'undefined' ? `https://api.whatsapp.com/send?text=${encodeURIComponent(`${vlog.title} - Watch on Palu Vlogs: ${window.location.href}`)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                style={{ color: '#25D366' }}
              >
                WhatsApp
              </a>
              <a
                href={typeof window !== 'undefined' ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${vlog.title} @paluvlogs`)}&url=${encodeURIComponent(window.location.href)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
              >
                X / Twitter
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="vlog-detail-desc">
            <h4 style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--gold)', marginBottom: '12px' }}>
              About This Episode
            </h4>
            <p style={{ whiteSpace: 'pre-line' }}>{vlog.description}</p>

            {/* Tags */}
            {vlog.tags && vlog.tags.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                <div style={{ fontSize: '12px', color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Tags:
                </div>
                <div className="tag-cloud">
                  {vlog.tags.map((tag, i) => (
                    <span key={i} className="tag-pill">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Vlogs */}
          {related.length > 0 && (
            <div style={{ marginTop: '60px' }}>
              <h3 style={{ fontSize: '26px', color: 'var(--cream)', marginBottom: '24px' }}>
                More {vlog.category} Episodes
              </h3>
              <div className="vlogs-grid">
                {related.map(rel => (
                  <VlogCard key={rel._id || rel.slug} vlog={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
