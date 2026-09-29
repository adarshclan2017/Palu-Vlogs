'use client';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <div className="footer-brand">🥦 Palu Vlogs</div>
            <p className="footer-desc">
              Four friends, one camera, and a vegetable-costume joke that got completely out of hand. Unscripted Kerala road trips, street food runs, and high-energy laughter.
            </p>
            <div className="footer-socials">
              {[
                { href: 'https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1', icon: '▶' },
                { href: 'https://instagram.com/paluvlogs', icon: '📸' },
                { href: 'https://whatsapp.com', icon: '💬' },
              ].map(({ href, icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Subscribe on YouTube">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col-nav">
            <h4 className="footer-col-title">Explore</h4>
            <nav className="footer-nav">
              {[['/', 'Home'], ['/vlogs', 'Vlogs'], ['/gallery', 'Gallery'], ['/locations', 'Locations'], ['/about', 'About Me'], ['/contact', 'Contact']].map(([href, label]) => (
                <Link key={href} href={href} className="footer-nav-link">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-col-connect">
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-info">
              <span>📧 contact@paluvlogs.com</span>
              <span>📍 Kerala, India</span>
              <span>🎬 125K+ Subs</span>
              <span>👁 4.8M+ Views</span>
            </div>
            <Link
              href="https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1"
              target="_blank"
              className="footer-sub-btn"
            >
              ▶ Subscribe
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} Palu Vlogs — Vegetable Gang. All rights reserved.</span>
          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Made with 🥦 in Kerala</span>
        </div>
      </div>
    </footer>
  );
}
