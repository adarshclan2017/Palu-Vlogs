'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(() => {
    // Read from cache synchronously to avoid any flash
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('palu_settings_cache');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return null;
  });

  useEffect(() => {
    api.getSettings()
      .then(res => { if (res?.success && res.data) setSettings(res.data); })
      .catch(() => {});
  }, []);

  const channelName = settings?.channelName || 'Palu Vlogs';
  const bio = settings?.bio || 'Four friends, one camera, and a vegetable-costume joke that got completely out of hand. Unscripted Kerala road trips, street food runs, and high-energy laughter.';
  const email = settings?.email || 'contact@paluvlogs.com';
  const subscriberCount = settings?.subscriberCount || '125K';
  const totalViews = settings?.totalViews || '4.8M';
  const youtubeUrl = settings?.youtubeUrl || 'https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1';
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com/paluvlogs';
  const whatsappUrl = settings?.whatsappUrl || 'https://whatsapp.com';

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <div className="footer-brand">🥦 {channelName}</div>
            <p className="footer-desc">{bio}</p>
            <div className="footer-socials">
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Subscribe on YouTube">▶</a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Instagram">📸</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="WhatsApp">💬</a>
            </div>
          </div>

          <div className="footer-col-nav">
            <h4 className="footer-col-title">Explore</h4>
            <nav className="footer-nav">
              {[['/', 'Home'], ['/vlogs', 'Vlogs'], ['/gallery', 'Gallery'], ['/locations', 'Locations'], ['/about', 'About Me'], ['/contact', 'Contact']].map(([href, label]) => (
                <Link key={href} href={href} className="footer-nav-link">{label}</Link>
              ))}
            </nav>
          </div>

          <div className="footer-col-connect">
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-info">
              <span>📧 {email}</span>
              <span>📍 Kerala, India</span>
              <span>🎬 {subscriberCount}+ Subs</span>
              <span>👁 {totalViews}+ Views</span>
            </div>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="footer-sub-btn">
              ▶ Subscribe
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {channelName} — Vegetable Gang. All rights reserved.</span>
          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Made with 🥦 in Kerala</span>
        </div>
      </div>
    </footer>
  );
}
