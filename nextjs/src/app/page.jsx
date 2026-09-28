'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import VlogCard from '@/components/VlogCard';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import PhotoLightbox from '@/components/PhotoLightbox';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [latestVlogs, setLatestVlogs] = useState([]);
  const [popularVlogs, setPopularVlogs] = useState([]);
  const [featuredVlog, setFeaturedVlog] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, vlogsRes, photosRes, locsRes] = await Promise.all([
          api.getSettings().catch(() => ({ success: false })),
          api.getVlogs({ limit: 8 }).catch(() => ({ success: false })),
          api.getPhotos({ limit: 8 }).catch(() => ({ success: false })),
          api.getLocations().catch(() => ({ success: false }))
        ]);

        if (settingsRes?.success) setSettings(settingsRes.data);
        if (vlogsRes?.success && Array.isArray(vlogsRes.data)) {
          const all = vlogsRes.data;
          setLatestVlogs(all.slice(0, 6));
          const feat = all.find(v => v.isFeatured) || all[0];
          setFeaturedVlog(feat);
          const popular = [...all].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
          setPopularVlogs(popular);
        }
        if (photosRes?.success && Array.isArray(photosRes.data)) setPhotos(photosRes.data);
        if (locsRes?.success && Array.isArray(locsRes.data)) setLocations(locsRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* ---------- HERO SECTION ---------- */}
      <header className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <span className="pulse-dot"></span>
                Fresh Episode Every Sunday
              </div>

              <h1>
                ORU PALU<br />
                <span className="accent">VLOGS.</span>
              </h1>

              <p className="hero-tag">
                {settings?.bio ||
                  'Four friends, one camera, and a running vegetable-costume joke that got completely out of hand. Unscripted Kerala road trips, street food runs, and high-energy laughter.'}
              </p>

              <div className="hero-actions">
                {featuredVlog && (
                  <button className="btn-primary" onClick={() => setActiveVideo(featuredVlog)}>
                    ▶ Watch Latest Vlog
                  </button>
                )}
                <a
                  href="https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  title="Subscribe to Palu Vlogs on YouTube"
                >
                  Subscribe on YouTube 🔔
                </a>
              </div>

              <div className="hero-stats">
                <div>
                  <b>{settings?.subscriberCount || '125K'}</b>
                  <span>Subscribers</span>
                </div>
                <div>
                  <b>{settings?.totalViews || '4.8M'}</b>
                  <span>Channel Views</span>
                </div>
                <div>
                  <b>100%</b>
                  <span>Real Face · Real Vibes</span>
                </div>
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-badge-wrap">
                <img
                  src={settings?.coverImage || '/assets/images/hero_team.jpg'}
                  alt="Palu Vlogs Squad"
                  className="hero-badge"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>FUN</span><span>·</span><span>VIBES</span><span>·</span><span>MEMORIES</span><span>·</span><span>CHAOS</span><span>·</span>
            <span>ORU PALU VLOGS</span><span>·</span><span>THE VEGETABLE GANG</span><span>·</span><span>ROAD TRIPS</span><span>·</span><span>STREET FOOD</span><span>·</span>
            <span>FUN</span><span>·</span><span>VIBES</span><span>·</span><span>MEMORIES</span><span>·</span><span>CHAOS</span><span>·</span>
            <span>ORU PALU VLOGS</span><span>·</span><span>THE VEGETABLE GANG</span><span>·</span><span>ROAD TRIPS</span><span>·</span><span>STREET FOOD</span><span>·</span>
          </div>
        </div>
      </header>

      {/* ---------- FEATURED VLOG SPOTLIGHT ---------- */}
      {featuredVlog && (
        <section className="section-pad" style={{ background: 'var(--panel)' }}>
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">Spotlight</span>
              <h2>Featured Road Trip</h2>
              <p>The episode that defined our season. Click below to stream directly on our custom player!</p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '40px',
                alignItems: 'center',
                background: 'var(--panel-2)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                padding: '24px'
              }}
            >
              <div
                className="vlog-thumb-wrap"
                style={{ borderRadius: 'var(--radius-md)', aspectRatio: '16/9' }}
                onClick={() => setActiveVideo(featuredVlog)}
              >
                <img
                  src={featuredVlog.thumbnailUrl}
                  alt={featuredVlog.title}
                  className="vlog-thumb"
                />
                <div className="vlog-badge" style={{ background: 'var(--red)', color: '#fff' }}>
                  ⭐ Featured
                </div>
                <div className="vlog-duration">{featuredVlog.duration}</div>
                <div className="vlog-play-overlay">
                  <div className="play-circle" style={{ width: 64, height: 64, fontSize: 24 }}>
                    ▶
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge">{featuredVlog.category}</span>
                  <span style={{ fontSize: '13px', color: 'var(--stone)' }}>
                    👀 {(featuredVlog.views || 0).toLocaleString()} views
                  </span>
                </div>

                <h3 style={{ fontSize: '28px', color: 'var(--cream)', marginBottom: '14px', lineHeight: 1.15 }}>
                  {featuredVlog.title}
                </h3>

                <p style={{ color: 'var(--stone)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                  {featuredVlog.description}
                </p>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <button className="btn-primary" onClick={() => setActiveVideo(featuredVlog)}>
                    ▶ Watch Now
                  </button>
                  <Link href={`/vlogs/${featuredVlog.slug}`} className="btn-ghost">
                    Episode Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- LATEST VLOGS GRID ---------- */}
      <section className="section-pad">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="kicker">Fresh Drops</span>
              <h2>Latest Vlogs & Episodes</h2>
              <p>Catch up on our recent road journeys, prank challenges, and food expeditions.</p>
            </div>
            <Link href="/vlogs" className="btn-ghost">
              Browse All Vlogs ({latestVlogs.length}) →
            </Link>
          </div>

          <div className="vlogs-grid">
            {latestVlogs.map(vlog => (
              <VlogCard key={vlog._id || vlog.slug} vlog={vlog} onPlay={() => setActiveVideo(vlog)} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- POPULAR EPISODES ---------- */}
      {popularVlogs.length > 0 && (
        <section className="section-pad" style={{ background: 'var(--panel)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">Most Watched</span>
              <h2>Fan Favorites & Viral Hits</h2>
              <p>The episodes that racked up hundreds of thousands of views and meme moments.</p>
            </div>

            <div className="vlogs-grid">
              {popularVlogs.map(vlog => (
                <VlogCard key={vlog._id || vlog.slug} vlog={vlog} onPlay={() => setActiveVideo(vlog)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- RECENT PHOTOS REEL STRIP ---------- */}
      {photos.length > 0 && (
        <section className="section-pad" style={{ overflow: 'hidden' }}>
          <div className="wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <span className="kicker">Behind The Lens</span>
                <h2>Recent Photos & Frames</h2>
                <p>Candid road trip snaps and costume chaos. Click any polaroid to enlarge!</p>
              </div>
              <Link href="/gallery" className="btn-ghost">
                View Photo Gallery →
              </Link>
            </div>

            <div className="gallery-grid">
              {photos.slice(0, 8).map((photo, idx) => (
                <div key={photo._id || idx} className="gallery-card" onClick={() => setLightboxIndex(idx)}>
                  <img src={photo.imageUrl} alt={photo.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-caption">{photo.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- PLACES VISITED PREVIEW ---------- */}
      {locations.length > 0 && (
        <section className="section-pad" style={{ background: 'var(--panel-2)', borderTop: '1px solid var(--line)' }}>
          <div className="wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <span className="kicker">Adventures</span>
                <h2>Places We've Explored</h2>
                <p>The destinations across Kerala and Southern India where our cameras rolled.</p>
              </div>
              <Link href="/locations" className="btn-ghost">
                Explore All Destinations →
              </Link>
            </div>

            <div className="locations-grid">
              {locations.map((loc, idx) => (
                <div key={loc._id || idx} className="location-card">
                  <div className="location-img-frame">
                    <img src={loc.coverImage} alt="" className="location-bg-blur" aria-hidden="true" />
                    <img src={loc.coverImage} alt={loc.name} className="location-cover" loading="lazy" />
                  </div>
                  <div className="location-body">
                    <div className="location-coords">
                      📍 {loc.state}, {loc.country} · {loc.visitedDate}
                    </div>
                    <h3 className="location-title">{loc.name}</h3>
                    <p style={{ color: 'var(--stone)', fontSize: '14.5px', lineHeight: 1.6, flexGrow: 1 }}>
                      {loc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- ABOUT PREVIEW ---------- */}
      <section className="section-pad">
        <div className="wrap">
          <div className="about-hero-grid">
            <div className="about-img-frame">
              <img src="/assets/images/about_roadtrip.jpg" alt="Palu Vlogs Highway Squad" />
            </div>

            <div>
              <span className="kicker">The Story</span>
              <h2 style={{ fontSize: '38px', marginBottom: '16px' }}>Four Friends. One Camera. Zero Plan.</h2>
              <p style={{ color: 'var(--stone)', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px' }}>
                We started filming our weekend scooter trips across Kerala with no script and no budget. One day, Potato Star showed up in a vegetable suit as a prank — and our audience loved it so much that every member received a vegetable persona.
              </p>
              <p style={{ color: 'var(--cream)', fontSize: '16px', fontWeight: 600, lineHeight: 1.7, marginBottom: '24px' }}>
                Today, Palu Vlogs is a family of 125,000+ subscribers who ride along with us on every hairpin turn and roadside food stop.
              </p>
              <Link href="/about" className="btn-primary">
                Read Our Full Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      {activeVideo && <VideoPlayerModal vlog={activeVideo} onClose={() => setActiveVideo(null)} />}

      {/* Photo Lightbox */}
      {lightboxIndex >= 0 && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
