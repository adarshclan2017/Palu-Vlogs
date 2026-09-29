'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    try {
      const res = await api.getStats();
      if (res?.success && typeof res.data?.unreadMessages === 'number') {
        setUnreadCount(res.data.unreadMessages);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('palu_user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch (e) {}
      }
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    // Poll every 25 seconds for new message notifications
    const timer = setInterval(fetchUnread, 25000);

    // Listen for custom event when messages are updated in admin/messages page
    const handleUpdate = () => fetchUnread();
    if (typeof window !== 'undefined') {
      window.addEventListener('palu_messages_updated', handleUpdate);
    }
    return () => {
      clearInterval(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('palu_messages_updated', handleUpdate);
      }
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('palu_token');
      localStorage.removeItem('palu_user');
      document.cookie = 'palu_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    if (onClose) onClose();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard Overview', icon: '📊', exact: true },
    { href: '/admin/vlogs', label: 'Manage Vlogs', icon: '🎬' },
    { href: '/admin/gallery', label: 'Photo Gallery', icon: '🖼️' },
    { href: '/admin/locations', label: 'Adventures & Maps', icon: '📍' },
    { href: '/admin/messages', label: 'Contact Inquiries', icon: '📬', badge: unreadCount },
    { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/images/logo.jpg" alt="Palu Vlogs" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid var(--gold)' }} />
          <div>
            <div style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--cream)', lineHeight: 1 }}>PALU VLOGS</div>
            <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>Admin Portal</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="admin-sidebar-close"
          aria-label="Close admin menu"
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '0 8px 16px', borderBottom: '1px solid var(--line)', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--stone)' }}>Logged in as:</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cream)' }}>{user?.name || 'Administrator'}</div>
      </div>

      <nav className="admin-nav-list">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => { if (onClose) onClose(); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span
                  className="admin-unread-badge"
                  title={`${item.badge} new message${item.badge > 1 ? 's' : ''}`}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px' }}>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('palu_trigger_broken_ui'));
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.22), rgba(255, 165, 2, 0.22))',
            border: '1px solid rgba(255, 71, 87, 0.5)',
            color: '#ffc93c',
            fontFamily: 'Anton, sans-serif',
            fontSize: '13px',
            letterSpacing: '0.04em',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(255, 71, 87, 0.3)'
          }}
        >
          💥 Shatter & Break UI
        </button>
        <Link
          href="/"
          className="btn-ghost"
          style={{ justifyContent: 'center', fontSize: '13px', padding: '10px' }}
          onClick={() => { if (onClose) onClose(); }}
        >
          👁️ View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="btn-primary"
          style={{ justifyContent: 'center', fontSize: '13px', padding: '10px', background: 'rgba(229, 64, 42, 0.2)', border: '1px solid rgba(229, 64, 42, 0.4)', color: '#ff604c', boxShadow: 'none' }}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}
