import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      alert(err.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '40px', marginBottom: '40px' }}>
          {/* Brand Col */}
          <div>
            <div className="nav-brand" style={{ marginBottom: '14px' }}>
              <img src="/assets/images/logo.jpg" alt="Palu Vlogs" style={{ width: 42, height: 42 }} />
              <div>
                <div className="nav-brand-title">PALU VLOGS</div>
                <div className="nav-brand-sub">Vegetable Gang</div>
              </div>
            </div>
            <p style={{ color: 'var(--stone)', fontSize: '14px', maxWidth: '36ch', lineHeight: 1.6 }}>
              Four friends, one camera, and a vegetable-costume joke that became a movement. Weekly road trips across Kerala and beyond!
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href="https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="share-btn" title="Subscribe to Palu Vlogs on YouTube">📺 YouTube</a>
              <a href="https://instagram.com/paluvlogs" target="_blank" rel="noopener noreferrer" className="share-btn" title="Instagram">📸 Instagram</a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="share-btn" title="WhatsApp">💬 WhatsApp</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--cream)', fontSize: '14px', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.06em' }}>Explore</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--stone)' }}>
              <Link to="/" style={{ transition: 'color 0.2s' }}>Home</Link>
              <Link to="/vlogs" style={{ transition: 'color 0.2s' }}>All Vlogs & Episodes</Link>
              <Link to="/gallery" style={{ transition: 'color 0.2s' }}>Photo Albums</Link>
              <Link to="/locations" style={{ transition: 'color 0.2s' }}>Adventures & Map</Link>
              <Link to="/about" style={{ transition: 'color 0.2s' }}>Our Story</Link>
              <Link to="/contact" style={{ transition: 'color 0.2s' }}>Contact & Collabs</Link>
            </div>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 style={{ color: 'var(--gold)', fontSize: '14px', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.06em' }}>Never Miss an Episode</h4>
            <p style={{ color: 'var(--stone)', fontSize: '13.5px', marginBottom: '14px' }}>
              Join 125K+ fans. Get alerts whenever a new road trip drop or vegetable prank goes live.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                style={{ padding: '10px 14px', fontSize: '13.5px' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 18px', whiteSpace: 'nowrap' }} disabled={loading}>
                {loading ? '...' : subscribed ? 'Joined! 🎉' : 'Notify Me'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--stone)' }}>
          <span>© {new Date().getFullYear()} Palu Vlogs — Vegetable Gang. Real Face, Real Vibes.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/admin/login" style={{ color: 'var(--stone)' }}>Admin Portal</Link>
            <span>·</span>
            <span>Malayalam First · Subtitled Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
