import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <img src="/assets/images/logo.jpg" alt="Palu Vlogs" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid var(--gold)' }} />
        <div>
          <div style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--cream)', lineHeight: 1 }}>PALU VLOGS</div>
          <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>Admin Portal</div>
        </div>
      </div>

      <div style={{ padding: '0 8px' }}>
        <div style={{ fontSize: '12px', color: 'var(--stone)' }}>Logged in as:</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cream)' }}>{user?.name || 'Administrator'}</div>
      </div>

      <nav className="admin-nav-list">
        <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span>📊</span>
          <span>Dashboard Overview</span>
        </NavLink>
        <NavLink to="/admin/vlogs" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span>🎬</span>
          <span>Manage Vlogs</span>
        </NavLink>
        <NavLink to="/admin/gallery" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span>🖼️</span>
          <span>Photo Gallery</span>
        </NavLink>
        <NavLink to="/admin/locations" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span>📍</span>
          <span>Adventures & Maps</span>
        </NavLink>
        <NavLink to="/admin/messages" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span>📬</span>
          <span>Contact Inquiries</span>
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <span>⚙️</span>
          <span>Website Settings</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/" className="btn-ghost" style={{ justifyContent: 'center', fontSize: '13px', padding: '10px' }}>
          👁️ View Public Site
        </Link>
        <button
          onClick={logout}
          className="btn-primary"
          style={{ justifyContent: 'center', fontSize: '13px', padding: '10px', background: 'rgba(229, 64, 42, 0.2)', border: '1px solid rgba(229, 64, 42, 0.4)', color: '#ff604c', boxShadow: 'none' }}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
