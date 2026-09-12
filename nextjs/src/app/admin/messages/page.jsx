'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';

export default function ManageMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.getMessages();
      if (res?.success && Array.isArray(res.data)) setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id) => {
    try {
      const res = await api.toggleMessageRead(id);
      if (res?.success) {
        setMessages(messages.map(m => m._id === id ? { ...m, isRead: !m.isRead } : m));
      }
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await api.deleteMessage(id);
      if (res?.success) {
        setToast({ message: 'Message deleted', type: 'success' });
        setMessages(messages.filter(m => m._id !== id));
      }
    } catch (err) {
      setToast({ message: 'Failed to delete message', type: 'error' });
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Contact Inquiries</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Manage fan mail, brand partnerships, and stay recommendations
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton' }}>
          Loading Inquiries...
        </div>
      ) : messages.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--stone)' }}>No messages received yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject & Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg._id} style={{ background: !msg.isRead ? 'rgba(255, 201, 60, 0.03)' : 'transparent' }}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--cream)' }}>{msg.name}</div>
                    <a href={`mailto:${msg.email}`} style={{ fontSize: '12.5px', color: 'var(--gold)' }}>
                      {msg.email}
                    </a>
                  </td>

                  <td style={{ maxWidth: '420px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--cream)', marginBottom: '4px' }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: '13.5px', color: 'var(--stone)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                      {msg.message}
                    </div>
                  </td>

                  <td style={{ fontSize: '12px', color: 'var(--stone)', whiteSpace: 'nowrap' }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      onClick={() => handleToggleRead(msg._id)}
                      className={msg.isRead ? 'badge' : 'badge badge-red'}
                      style={{ cursor: 'pointer' }}
                      title="Click to toggle status"
                    >
                      {msg.isRead ? 'Read' : 'New Inactive'}
                    </button>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="share-btn"
                        style={{ fontSize: '12px', padding: '4px 10px' }}
                      >
                        Reply ✉️
                      </a>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="share-btn"
                        style={{ fontSize: '12px', padding: '4px 10px', color: '#ff604c' }}
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
