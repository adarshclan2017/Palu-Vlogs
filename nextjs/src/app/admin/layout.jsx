'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthorized(true);
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('palu_token') : null;
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Close mobile drawer whenever pathname changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // If login page, don't show admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '18px' }}>
        Verifying Admin Access...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Mobile Top Header */}
      <header className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="admin-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle admin navigation menu"
          >
            ☰
          </button>
          <img src="/assets/images/logo.jpg" alt="Palu Vlogs" style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--gold)' }} />
          <span style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--cream)', letterSpacing: '0.02em' }}>
            PALU STUDIO
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/" className="btn-ghost" style={{ fontSize: '12px', padding: '6px 10px' }}>
            👁️ Site
          </Link>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      <div
        className={`admin-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
