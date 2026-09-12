'use client';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🥦 Palu Vlogs</div>
            <p className="footer-desc">Four friends, one camera, and a vegetable-costume joke that got completely out of hand. Unscripted Kerala road trips, street food runs, and high-energy laughter.</p>
            <div className="footer-socials">
              {[
                { href: 'https://youtube.com/@paluvlogs', icon: '▶' },
                { href: 'https://instagram.com/paluvlogs', icon: '📸' },
                { href: 'https://whatsapp.com', icon: '💬' },
              ].map(({ href, icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-btn">{icon}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Anton', fontSize: 18, color: 'var(--cream)', marginBottom: 20, textTransform: 'uppercase' }}>Explore</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['/', 'Home'], ['/vlogs', 'Vlogs'], ['/gallery', 'Gallery'], ['/locations', 'Locations'], ['/about', 'About Me'], ['/contact', 'Contact']].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: 'var(--stone)', fontSize: 14.5, fontWeight: 600, transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = 'var(--stone)'}>{label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Anton', fontSize: 18, color: 'var(--cream)', marginBottom: 20, textTransform: 'uppercase' }}>Connect</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--stone)', fontSize: 14.5 }}>
              <span>📧 contact@paluvlogs.com</span>
              <span>📍 Kerala, India</span>
              <span>🎬 125K+ Subscribers</span>
              <span>👁 4.8M+ Total Views</span>
            </div>
            <Link href="https://youtube.com/@paluvlogs" target="_blank"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, background: 'var(--red)', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 800, fontSize: 13 }}>
              ▶ Watch on YouTube
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
