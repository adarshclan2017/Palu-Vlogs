'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function Footer({ initialSettings = null }) {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const channelName = settings?.channelName || 'Palu Vlogs';
  const bio = settings?.bio || "A passionate group of teams and friends from Kanniyakumari, capturing unscripted road journeys, coastal rides, and authentic moments. Started in April 2026 — for us, it's not about the views, it's about the memories.";
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
              {[['/', 'Home'], ['/vlogs', 'Vlogs'], ['/gallery', 'Gallery'], ['/locations', 'Locations'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
                <Link key={href} href={href} className="footer-nav-link">{label}</Link>
              ))}
            </nav>
          </div>

          <div className="footer-col-connect">
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-info">
              <span>📧 {email}</span>
              <span>📍 Kanniyakumari, Tamil Nadu, India</span>
              <span>🎬 {subscriberCount}+ Subs</span>
              <span>👁 {totalViews}+ Views</span>
            </div>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="footer-sub-btn">
              ▶ Subscribe
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {channelName}. All rights reserved.</span>
          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Made with ❤️ in Kanniyakumari</span>
        </div>
      </div>
    </footer>
  );
}
