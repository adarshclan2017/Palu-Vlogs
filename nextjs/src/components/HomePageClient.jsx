'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import VlogCard from '@/components/VlogCard';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import PhotoLightbox from '@/components/PhotoLightbox';
import HeroSquadDP from '@/components/HeroSquadDP';
import MountainSnowText from '@/components/MountainSnowText';
import VisitorBadge from '@/components/VisitorBadge';

export default function HomePageClient({
  initialSettings = null,
  initialVlogs = [],
  initialPhotos = [],
  initialLocations = []
}) {
  // Use server-provided settings on frame 1 — guaranteed zero flicker on refresh
  const [settings, setSettings] = useState(initialSettings);
  const [latestVlogs, setLatestVlogs] = useState(() => initialVlogs.slice(0, 6));
  const [popularVlogs, setPopularVlogs] = useState(() =>
    [...initialVlogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3)
  );
  const [featuredVlog, setFeaturedVlog] = useState(() =>
    initialVlogs.find((v) => v.isFeatured) || initialVlogs[0] || null
  );
  const [photos, setPhotos] = useState(initialPhotos);
  const [locations, setLocations] = useState(() => initialLocations.slice(0, 4));

  // Modals state
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const handleRandomVlog = () => {
    const pool = initialVlogs.length > 0 ? initialVlogs : latestVlogs;
    if (!pool || pool.length === 0) return;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setActiveVideo(random);
  };

  const handlePhotoUpdate = (photoId, newReactions) => {
    setPhotos((prev) =>
      prev.map((p) => (p._id === photoId ? { ...p, reactions: newReactions } : p))
    );
  };

  // Background sync in case settings were updated while page was open
  useEffect(() => {
    const refreshData = async () => {
      try {
        const settingsRes = await api.getSettings().catch(() => null);
        if (settingsRes?.success && settingsRes.data) {
          setSettings(settingsRes.data);
        }
      } catch {}
    };
    refreshData();
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

              <MountainSnowText />

              <p className="hero-tag">
                {settings?.bio ||
                  "A passionate group of teams and friends from Kanniyakumari, capturing unscripted road journeys, coastal rides, and authentic moments. Started in April 2026 — for us, it's not about the views, it's about the memories."}
              </p>

              <div className="hero-actions">
                {featuredVlog && (
                  <button className="btn-primary" onClick={() => setActiveVideo(featuredVlog)}>
                    ▶ Watch Latest Vlog
                  </button>
                )}
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleRandomVlog}
                  title="Watch a random vlog from our channel"
                >
                  🎲 Surprise Me
                </button>
                <a
                  href="https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  title="Subscribe to Palu Vlogs on YouTube"
                >
                  Subscribe 🔔
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
                  <VisitorBadge />
                  <span>Verified Visitors</span>
                </div>
              </div>
            </div>

            <div className="hero-art">
              <HeroSquadDP
                coverImage={settings?.coverImage}
                profileImage={settings?.profileImage}
                fallback=""
              />
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>FUN</span><span>·</span><span>VIBES</span><span>·</span><span>MEMORIES</span><span>·</span><span>CHAOS</span><span>·</span>
            <span>PALU VLOGS</span><span>·</span><span>THE VEGETABLE GANG</span><span>·</span><span>ROAD TRIPS</span><span>·</span><span>STREET FOOD</span><span>·</span>
            <span>FUN</span><span>·</span><span>VIBES</span><span>·</span><span>MEMORIES</span><span>·</span><span>CHAOS</span><span>·</span>
            <span>PALU VLOGS</span><span>·</span><span>THE VEGETABLE GANG</span><span>·</span><span>ROAD TRIPS</span><span>·</span><span>STREET FOOD</span><span>·</span>
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

            <div className="featured-vlog-spotlight">
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

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => setActiveVideo(featuredVlog)}>
                    ▶ Watch Now
                  </button>
                  <Link href={`/vlogs/${featuredVlog.slug}`} className="btn-ghost">
                    Episode Details →
                  </Link>
                  <button
                    type="button"
                    className="vlog-wa-btn"
                    onClick={() => {
                      const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
                      const text = `Watch the featured episode of Palu Vlogs: "${featuredVlog.title}" 🛵🎬\n${siteUrl}/vlogs/${featuredVlog.slug}`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    💬 WhatsApp
                  </button>
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
              <p>Catch up on our recent road journeys, challenges, and food expeditions.</p>
            </div>
            <Link href="/vlogs" className="btn-ghost">
              Browse All Vlogs ({latestVlogs.length}) →
            </Link>
          </div>

          {latestVlogs.length > 0 ? (
            <div className="vlogs-grid">
              {latestVlogs.map((vlog) => (
                <VlogCard key={vlog._id || vlog.slug} vlog={vlog} onPlay={() => setActiveVideo(vlog)} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--line)' }}>
              <h3 style={{ color: 'var(--gold)', fontSize: '20px', marginBottom: '8px' }}>No Vlogs Uploaded Yet 🎬</h3>
              <p style={{ color: 'var(--stone)', fontSize: '14px' }}>Fresh episodes and unscripted road trips will appear here soon.</p>
            </div>
          )}
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
              {popularVlogs.map((vlog) => (
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
                <p>Candid road trip snaps and memorable moments. Click any polaroid to enlarge!</p>
              </div>
              <Link href="/gallery" className="btn-ghost">
                View Photo Gallery →
              </Link>
            </div>

            <div className="gallery-grid">
              {photos.slice(0, 8).map((photo, idx) => {
                const raw = photo.reactions || {};
                const r = raw instanceof Map ? Object.fromEntries(raw) : raw;
                const totalReactions = Object.values(r).reduce((acc, c) => acc + (Number(c) || 0), 0);
                return (
                  <div key={photo._id || idx} className="gallery-card" onClick={() => setLightboxIndex(idx)}>
                    <div className="gallery-img-container">
                      <img src={photo.imageUrl} alt={photo.title} className="gallery-img" loading="lazy" />
                      {totalReactions > 0 && (
                        <div className="gallery-reaction-pill">
                          <span>❤️</span>
                          <span className="gallery-pill-total">{totalReactions}</span>
                        </div>
                      )}
                    </div>
                    <div className="gallery-caption">{photo.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------- LOCATIONS VISITED PREVIEW ---------- */}
      {locations.length > 0 && (
        <section className="section-pad" style={{ background: 'var(--panel-2)', borderTop: '1px solid var(--line)' }}>
          <div className="wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <h2>Locations Visited</h2>
                <p>The destinations across Kanniyakumari and beyond where our cameras rolled.</p>
              </div>
              <Link href="/locations" className="btn-ghost">
                View All Locations ({locations.length}) →
              </Link>
            </div>

            <div className="locations-grid">
              {locations.map((loc, idx) => (
                <div key={loc._id || idx} className="location-card">
                  {loc.coverImage ? (
                    <div className="location-img-frame">
                      <img src={loc.coverImage} alt="" className="location-bg-blur" aria-hidden="true" />
                      <img src={loc.coverImage} alt={loc.name} className="location-cover" loading="lazy" />
                    </div>
                  ) : (
                    <div style={{ height: '140px', background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                      📍
                    </div>
                  )}
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
          <div style={{ background: 'var(--panel)', padding: '48px 36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <span className="kicker">The Story</span>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>It's Not About The Views. It's About The Memories.</h2>
            <p style={{ color: 'var(--stone)', fontSize: '16px', lineHeight: 1.7, marginBottom: '16px', maxWidth: '720px', margin: '0 auto 16px' }}>
              {settings?.bio ||
                "We are a group of teams and friends from Kanniyakumari. Our journey began in April 2026 with unscripted road trips, scenic rides, and unfiltered laughs. For our squad, it has never been about chasing views — it's all about the memories we create together."}
            </p>
            <p style={{ color: 'var(--cream)', fontSize: '16px', fontWeight: 600, lineHeight: 1.7, marginBottom: '28px', maxWidth: '720px', margin: '0 auto 28px' }}>
              Today, {settings?.channelName || 'Palu Vlogs'} is a growing family of {settings?.subscriberCount || '125K'}+ subscribers riding along on every coastal road and adventure.
            </p>
            <Link href="/about" className="btn-primary" style={{ display: 'inline-flex' }}>
              Read Our Full Story →
            </Link>
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
          onPhotoUpdate={handlePhotoUpdate}
        />
      )}
    </div>
  );
}
