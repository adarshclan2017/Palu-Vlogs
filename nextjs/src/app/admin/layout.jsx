'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // If login page, don't show admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
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
