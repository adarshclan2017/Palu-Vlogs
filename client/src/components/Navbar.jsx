import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="nav-brand">
            <img src="/assets/images/logo.jpg" alt="Palu Vlogs" />
            <div>
              <div className="nav-brand-title">PALU VLOGS</div>
              <div className="nav-brand-sub">Vegetable Gang</div>
            </div>
          </Link>

          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/vlogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Vlogs
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Gallery
            </NavLink>
            <NavLink to="/locations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Adventures
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Contact
            </NavLink>
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link to="/admin" className="admin-nav-pill">
                  ⚙️ Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="admin-nav-pill"
                  style={{ background: 'rgba(229, 64, 42, 0.15)', borderColor: 'rgba(229, 64, 42, 0.3)', color: '#ff604c', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="admin-nav-pill" title="Admin Portal">
                🔒 Admin
              </Link>
            )}

            <a
              href="https://youtube.com/@paluvlogs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              <span>Subscribe</span>
              <span>▶</span>
            </a>

            <button className="mobile-toggle-btn" onClick={toggleMobile} aria-label="Toggle Navigation">
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`} onClick={closeMobile}></div>
      <aside className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="nav-brand">
            <img src="/assets/images/logo.jpg" alt="Palu Vlogs" style={{ width: 34, height: 34 }} />
            <span style={{ fontFamily: 'Anton', fontSize: 18 }}>PALU VLOGS</span>
          </div>
          <button className="mobile-drawer-close" onClick={closeMobile}>✕</button>
        </div>

        <div className="mobile-drawer-links">
          <Link to="/" className="nav-link" onClick={closeMobile}>Home</Link>
          <Link to="/vlogs" className="nav-link" onClick={closeMobile}>Vlogs</Link>
          <Link to="/gallery" className="nav-link" onClick={closeMobile}>Gallery</Link>
          <Link to="/locations" className="nav-link" onClick={closeMobile}>Adventures</Link>
          <Link to="/about" className="nav-link" onClick={closeMobile}>About</Link>
          <Link to="/contact" className="nav-link" onClick={closeMobile}>Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="nav-link" style={{ color: 'var(--gold)' }} onClick={closeMobile}>Dashboard</Link>
              <button onClick={() => { logout(); closeMobile(); }} style={{ background: 'none', border: 'none', color: '#ff604c', textAlign: 'left', font: 'inherit', fontWeight: 700, cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <Link to="/admin/login" className="nav-link" onClick={closeMobile}>Admin Login</Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
