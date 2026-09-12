import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@paluvlogs.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
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
          <img
            src="/assets/images/logo.jpg"
            alt="Palu Vlogs"
            style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px', border: '3px solid var(--gold)' }}
          />
          <h2 style={{ fontFamily: 'Anton', fontSize: '28px', color: 'var(--gold)', letterSpacing: '0.02em' }}>
            Admin Portal
          </h2>
          <p style={{ color: 'var(--stone)', fontSize: '13.5px', marginTop: '4px' }}>
            Sign in to manage vlogs, gallery, and inquiries
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
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In 🔐'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            padding: '14px',
            background: 'var(--panel-2)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--line)',
            fontSize: '12px',
            color: 'var(--stone)',
            textAlign: 'center'
          }}
        >
          <strong style={{ color: 'var(--gold)' }}>Seeded Admin Credentials:</strong><br />
          Email: <code>admin@paluvlogs.com</code><br />
          Password: <code>Admin@123</code>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminLogin;
