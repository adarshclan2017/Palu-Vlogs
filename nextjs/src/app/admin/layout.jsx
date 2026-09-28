'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

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

  // If login page, don't show admin sidebar
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
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
