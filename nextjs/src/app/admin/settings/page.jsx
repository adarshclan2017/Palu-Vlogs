'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';
import ImageUploader from '@/components/ImageUploader';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const DEFAULTS = {
    channelName: 'Palu Vlogs',
    tagline: 'Oru Palu Vlogs — Vegetable Gang | Fun · Vibes · Memories · Chaos',
    bio: 'Four friends, one camera, and a running vegetable-costume joke that got completely out of hand. Unscripted Kerala road trips, street food runs, and high-energy laughter.',
    profileImage: '/assets/images/logo.jpg',
    coverImage: '/assets/images/hero_team.jpg',
    youtubeUrl: 'https://youtube.com/@paluvlogs',
    instagramUrl: 'https://instagram.com/paluvlogs',
    whatsappUrl: 'https://whatsapp.com/channel/paluvlogs',
    email: 'contact@paluvlogs.com',
    subscriberCount: '125K',
    totalViews: '4.8M',
    featuredVlogSlug: 'great-eggplant-market-heist'
  };

  const [formData, setFormData] = useState(() => {
    // Use cached settings immediately so the form never shows wrong defaults
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('palu_settings_cache') : null;
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULTS;
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res?.success && res.data) {
          setFormData((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateSettings(formData);
      if (res?.success) {
        setToast({ message: '✅ Channel settings updated successfully!', type: 'success' });
      } else {
        setToast({ message: res?.message || 'Failed to update settings', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Error updating settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--gold)', fontSize: '18px', textAlign: 'center' }}>
        Loading Channel Settings...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Site & Channel Settings</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Customize your channel branding, social media links, statistics, and bio
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary"
          style={{ padding: '10px 24px' }}
        >
          {saving ? 'Saving...' : '💾 Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-settings-grid">
        {/* Brand Information */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--gold)', marginBottom: '18px' }}>
            🏷️ Channel Branding
          </h3>

          <div className="form-group">
            <label className="form-label">Channel Name</label>
            <input
              type="text"
              name="channelName"
              value={formData.channelName || ''}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tagline / Slogan</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Creator Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows={4}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Display Statistics */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--gold)', marginBottom: '18px' }}>
            📊 Displayed Counters & Hero
          </h3>

          <div className="form-group">
            <label className="form-label">Subscribers Display (e.g. 125K, 500K)</label>
            <input
              type="text"
              name="subscriberCount"
              value={formData.subscriberCount || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Views Display (e.g. 4.8M)</label>
            <input
              type="text"
              name="totalViews"
              value={formData.totalViews || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Featured Vlog Slug</label>
            <input
              type="text"
              name="featuredVlogSlug"
              value={formData.featuredVlogSlug || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Social Links */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--gold)', marginBottom: '18px' }}>
            🌐 Social Media & Contact Links
          </h3>

          <div className="form-group">
            <label className="form-label">YouTube Channel URL</label>
            <input
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instagram Profile URL</label>
            <input
              type="url"
              name="instagramUrl"
              value={formData.instagramUrl || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp Channel URL</label>
            <input
              type="url"
              name="whatsappUrl"
              value={formData.whatsappUrl || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact / Inquiry Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Media & Images */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--gold)', marginBottom: '18px' }}>
            🖼️ Logo & Cover Images
          </h3>

          <ImageUploader
            value={formData.profileImage}
            onChange={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
            label="Channel Profile / Logo"
            helpText="Click to select logo from device or drag & drop"
          />

          <ImageUploader
            value={formData.coverImage}
            onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
            label="Cover / Banner Image"
            helpText="Click to select hero banner from device or drag & drop"
          />

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {saving ? 'Saving Changes...' : '💾 Update Settings'}
            </button>
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
