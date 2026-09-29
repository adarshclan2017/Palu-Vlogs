'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@paluvlogs.com');
  const [password, setPassword] = useState('');
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('palu_settings_cache');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.profileImage) setLogo(parsed.profileImage);
        }
      } catch {}
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(email.trim().toLowerCase(), password.trim());
      if (res?.success && res.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('palu_token', res.token);
          localStorage.setItem('palu_user', JSON.stringify(res.user));
          sessionStorage.setItem('palu_trigger_broken_ui', 'true');
          localStorage.setItem('palu_trigger_broken_ui', 'true');
          document.cookie = `palu_token=${res.token}; path=/; max-age=2592000; SameSite=Lax`;
          window.location.href = '/admin?break_ui=true';
          return;
        }
        sessionStorage.setItem('palu_trigger_broken_ui', 'true');
        localStorage.setItem('palu_trigger_broken_ui', 'true');
        router.push('/admin?break_ui=true');
      }
    } catch (err) {
      setToast({ message: err.message || 'Invalid email or password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--line-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255, 201, 60, 0.15)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          {logo ? (
            <img
              src={logo}
              alt="Palu Vlogs"
              style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px', border: '3px solid var(--gold)', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                margin: '0 auto 14px',
                border: '3px solid var(--gold)',
                background: 'var(--gold)',
                color: '#12100e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 900,
                fontFamily: 'Anton, sans-serif'
              }}
            >
              P
            </div>
          )}
          <h2 style={{ fontFamily: 'Anton', fontSize: '28px', color: 'var(--gold)', letterSpacing: '0.02em' }}>
            Admin Portal
          </h2>
          <p style={{ color: 'var(--stone)', fontSize: '13.5px', marginTop: '4px' }}>
            Sign in to manage vlogs, gallery, and channel settings
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              className="form-input"
              placeholder="admin@paluvlogs.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In 🔐'}
          </button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
