import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-load pages for code splitting
const Home        = lazy(() => import('./pages/Home'));
const Vlogs       = lazy(() => import('./pages/Vlogs'));
const VlogDetails = lazy(() => import('./pages/VlogDetails'));
const Gallery     = lazy(() => import('./pages/Gallery'));
const Locations   = lazy(() => import('./pages/Locations'));
const About       = lazy(() => import('./pages/About'));
const Contact     = lazy(() => import('./pages/Contact'));
const AdminLogin  = lazy(() => import('./pages/AdminLogin'));

// Admin pages
const AdminLayout       = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard         = lazy(() => import('./pages/admin/Dashboard'));
const ManageVlogs       = lazy(() => import('./pages/admin/ManageVlogs'));
const ManageGallery     = lazy(() => import('./pages/admin/ManageGallery'));
const ManageLocations   = lazy(() => import('./pages/admin/ManageLocations'));
const ManageMessages    = lazy(() => import('./pages/admin/ManageMessages'));

// Full-page loading spinner
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    flexDirection: 'column',
    gap: 20
  }}>
    <div style={{
      width: 54,
      height: 54,
      border: '3px solid rgba(255,201,60,0.15)',
      borderTop: '3px solid #ffc93c',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ color: '#a89f8f', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      Loading…
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Layout for public pages (with navbar + footer)
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ── Public routes (Navbar + Footer) ── */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/vlogs" element={<PublicLayout><Vlogs /></PublicLayout>} />
            <Route path="/vlogs/:slug" element={<PublicLayout><VlogDetails /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
            <Route path="/locations" element={<PublicLayout><Locations /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

            {/* ── Admin login (no layout chrome) ── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Protected admin routes ── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard"  element={<Dashboard />} />
              <Route path="vlogs"      element={<ManageVlogs />} />
              <Route path="gallery"    element={<ManageGallery />} />
              <Route path="locations"  element={<ManageLocations />} />
              <Route path="messages"   element={<ManageMessages />} />
            </Route>

            {/* ── 404 fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
