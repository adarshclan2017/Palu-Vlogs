'use client';
import React, { useState } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.sendMessage(formData);
      if (res.success) {
        setToast({ message: 'Message sent successfully! Email notification dispatched 📬', type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to send message', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-pad">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Get in Touch</span>
          <h2>Contact & Collaborations</h2>
          <p>
            Have a road trip recommendation, hotel/stay invite, business inquiry, or fan message? Reach out to the Vegetable Gang below!
          </p>
        </div>

        <div className="contact-grid">
          {/* Form */}
          <div className="contact-card">
            <h3 style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '20px' }}>
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Anandhu Krishna"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. anandhu@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Wayanad Homestay Collaboration / Fan Mail"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? 'Sending Message...' : 'Send Message ✉️'}
              </button>
            </form>
          </div>

          {/* Info Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="contact-info-card">
              <h4 style={{ fontFamily: 'Anton', fontSize: '20px', color: 'var(--gold)' }}>
                Direct Channels
              </h4>

              <div className="contact-info-row">
                <div className="contact-icon">📧</div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700 }}>Business Email</div>
                  <div style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: 600 }}>contact@paluvlogs.com</div>
                </div>
              </div>

              <div className="contact-info-row">
                <div className="contact-icon">📍</div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700 }}>Base Location</div>
                  <div style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: 600 }}>Kanniyakumari, Tamil Nadu, India</div>
                </div>
              </div>

              <div className="contact-info-row">
                <div className="contact-icon">💬</div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700 }}>WhatsApp Community</div>
                  <div style={{ fontSize: '15px', color: 'var(--cream)', fontWeight: 600 }}>Official Palu Vlogs Channel</div>
                </div>
              </div>
            </div>

            {/* Quick FAQs */}
            <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
              <h4 style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--cream)', marginBottom: '14px' }}>
                Frequently Asked Questions
              </h4>
              <div style={{ fontSize: '14px', color: 'var(--stone)', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '10px' }}>
                  <strong style={{ color: 'var(--cream)' }}>Q: Can we join your next road trip?</strong><br />
                  A: We announce open fan meetups and rides on our Instagram community before major drops!
                </p>
                <p>
                  <strong style={{ color: 'var(--cream)' }}>Q: Where do you get the vegetable costumes?</strong><br />
                  A: Custom tailored in Kochi and local market shops along our routes!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
