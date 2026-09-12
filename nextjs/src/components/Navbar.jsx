'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/vlogs', label: 'Vlogs' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/locations', label: 'Locations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="nav-brand">
            <Image src="/assets/images/logo.jpg" alt="Palu Vlogs Logo" width={42} height={42} style={{ borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div className="nav-brand-title">Palu Vlogs</div>
              <div className="nav-brand-sub">Vegetable Gang</div>
            </div>
          </Link>

          <div className="nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={`nav-link${pathname === href ? ' active' : ''}`}>{label}</Link>
            ))}
          </div>

          <div className="nav-actions">
            <Link href="https://youtube.com/@paluvlogs" target="_blank" className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
              ▶ Subscribe
            </Link>
            <Link href="/admin/login" className="admin-nav-pill" style={{ background: 'var(--panel-2)', border: '1px solid var(--line)', color: 'var(--gold)', fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ⚙ Admin
            </Link>
            <button className="mobile-toggle-btn" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-backdrop${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="nav-brand-title">Palu Vlogs</span>
          <button className="mobile-drawer-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="mobile-drawer-links">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={`nav-link${pathname === href ? ' active' : ''}`} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/admin/login" style={{ color: 'var(--gold)' }} onClick={() => setOpen(false)}>⚙ Admin</Link>
        </nav>
      </div>
    </>
  );
}
