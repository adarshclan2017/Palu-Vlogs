import React from 'react';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import dataStore from '@/lib/dataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  await connectDB(8000).catch(() => {});
  const s = await dataStore.getSettings().catch(() => null);
  const name = s?.channelName || 'Palu Vlogs';
  return {
    title: `About ${name} — Our Journey & Story`,
    description: s?.bio || `Learn the story behind ${name}, our adventures, and channel journey.`,
  };
}

export default async function AboutPage() {
  await connectDB(8000).catch(() => {});
  const rawSettings = await dataStore.getSettings().catch(() => null);
  const settings = rawSettings ? JSON.parse(JSON.stringify(rawSettings)) : null;

  const channelName = settings?.channelName || 'Palu Vlogs';
  const tagline = settings?.tagline || 'Fun · Vibes · Memories · Chaos';
  const bio = settings?.bio || 'Four friends, one camera, and unscripted road trips across scenic routes, street food runs, and high-energy laughter.';
  const subscriberCount = settings?.subscriberCount || '125K';
  const totalViews = settings?.totalViews || '4.8M';
  const coverImage = settings?.coverImage || null;
  const profileImage = settings?.profileImage || null;
  const youtubeUrl = settings?.youtubeUrl || 'https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1';
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com/paluvlogs';

  return (
    <div className="section-pad">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Who We Are</span>
          <h2>The {channelName} Journey</h2>
          <p>{tagline}</p>
        </div>

        {/* Hero Banner / Cover Display if available */}
        {(coverImage || profileImage) && (
          <div style={{ marginBottom: '48px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--panel)', position: 'relative' }}>
            <div style={{ height: '320px', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={coverImage || profileImage}
                alt={channelName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,15,19,0.92) 0%, rgba(14,15,19,0.4) 60%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: '28px', left: '32px', right: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '36px', color: 'var(--cream)', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {channelName}
                  </h1>
                  <p style={{ color: 'var(--gold)', fontSize: '15px', fontWeight: 600, margin: '6px 0 0' }}>
                    {tagline}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 18px', fontSize: '14px' }}>
                    YouTube Channel 🔔
                  </a>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '8px 18px', fontSize: '14px' }}>
                    Instagram 📸
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Channel Story & About from Database */}
        <div style={{ background: 'var(--panel)', padding: '44px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', marginBottom: '48px' }}>
          <h3 style={{ fontSize: '32px', color: 'var(--gold)', marginBottom: '18px' }}>
            How It All Began
          </h3>
          <p style={{ color: 'var(--stone)', fontSize: '16.5px', lineHeight: 1.8, marginBottom: '18px' }}>
            {bio}
          </p>
          <p style={{ color: 'var(--stone)', fontSize: '16px', lineHeight: 1.8, marginBottom: '18px' }}>
            What began as spontaneous road trips exploring Kerala's mountain passes and coastal highways quickly transformed into an energetic community of travelers, food lovers, and creators. We ride with open minds, capture authentic unfiltered moments, and celebrate the journey over the destination.
          </p>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--line)' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gold)', fontFamily: 'Anton, sans-serif' }}>
                {subscriberCount}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Subscribers
              </div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cream)', fontFamily: 'Anton, sans-serif' }}>
                {totalViews}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Views
              </div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cream)', fontFamily: 'Anton, sans-serif' }}>
                100%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Real Unscripted Vibes
              </div>
            </div>
          </div>
        </div>

        {/* Gear & Channel Milestones */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div style={{ background: 'var(--panel-2)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <h4 style={{ fontFamily: 'Anton', fontSize: '22px', color: 'var(--gold)', marginBottom: '14px' }}>
              🎥 The Production Gear
            </h4>
            <ul className="about-features-list">
              <li className="about-feature-item">Sony FX3 & A7 IV with 24-70mm GM II lens</li>
              <li className="about-feature-item">GoPro Hero 12 Black mounted on helmet for road POV</li>
              <li className="about-feature-item">DJI Mini 4 Pro drone for aerial Kerala landscapes</li>
              <li className="about-feature-item">Rode Wireless PRO mics with wind deadcats for high-speed riding</li>
              <li className="about-feature-item">Apple M3 Max MacBook Pro with DaVinci Resolve Studio</li>
            </ul>
          </div>

          <div style={{ background: 'var(--panel-2)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <h4 style={{ fontFamily: 'Anton', fontSize: '22px', color: 'var(--gold)', marginBottom: '14px' }}>
              🏆 Channel Milestones
            </h4>
            <ul className="about-features-list">
              <li className="about-feature-item"><strong>May 2024:</strong> First video uploaded (The Scooter Experiment)</li>
              <li className="about-feature-item"><strong>Nov 2024:</strong> 10,000 Subscribers milestone achieved</li>
              <li className="about-feature-item"><strong>June 2025:</strong> 50,000 Subscribers & YouTube Silver Creator Award</li>
              <li className="about-feature-item"><strong>Jan 2026:</strong> 100,000 Subscribers & 4.5M+ total views</li>
              <li className="about-feature-item"><strong>Present:</strong> Season 2 Live with community episodes!</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/vlogs" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 28px' }}>
            Watch Our Episodes →
          </Link>
        </div>
      </div>
    </div>
  );
}
