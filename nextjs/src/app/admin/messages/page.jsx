'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';

export default function ManageMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.getMessages();
      if (res?.success && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const notifySidebarUpdate = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('palu_messages_updated'));
    }
  };

  const handleToggleRead = async (id) => {
    try {
      const res = await api.toggleMessageRead(id);
      if (res?.success) {
        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: !m.isRead } : m));
        notifySidebarUpdate();
      }
    } catch (err) {
      setToast({ message: 'Failed to update message status', type: 'error' });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api.markAllMessagesAsRead();
      if (res?.success) {
        setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
        setToast({ message: 'All messages marked as read! ✓', type: 'success' });
        notifySidebarUpdate();
      }
    } catch (err) {
      setToast({ message: 'Failed to mark all as read', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await api.deleteMessage(id);
      if (res?.success) {
        setToast({ message: 'Message deleted', type: 'success' });
        setMessages(prev => prev.filter(m => m._id !== id));
        notifySidebarUpdate();
      }
    } catch (err) {
      setToast({ message: 'Failed to delete message', type: 'error' });
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'read') return m.isRead;
    return true;
  });

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '32px', color: 'var(--cream)', margin: 0 }}>Contact Inquiries</h1>
            {unreadCount > 0 ? (
              <span className="badge badge-red" style={{ fontSize: '13px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot" style={{ width: 8, height: 8 }} />
                {unreadCount} NEW UNREAD
              </span>
            ) : (
              <span className="badge" style={{ fontSize: '12px', padding: '4px 10px', color: '#48c778', borderColor: 'rgba(72,199,120,0.3)' }}>
                ✓ All Caught Up
              </span>
            )}
          </div>
          <p style={{ color: 'var(--stone)', fontSize: '14px', marginTop: '6px' }}>
            Manage fan mail, brand partnerships, and road trip collaboration requests
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-gold"
              style={{ fontSize: '13px', padding: '10px 18px' }}
            >
              ✓ Mark All Read ({unreadCount})
            </button>
          )}
          <button
            onClick={fetchMessages}
            className="btn-ghost"
            style={{ fontSize: '13px', padding: '10px 16px' }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'btn-primary' : 'btn-ghost'}
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-full)' }}
        >
          All Inquiries ({messages.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'btn-primary' : 'btn-ghost'}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            borderRadius: 'var(--radius-full)',
            background: filter === 'unread' ? 'var(--red)' : undefined,
            borderColor: unreadCount > 0 ? 'var(--red)' : undefined,
            color: filter !== 'unread' && unreadCount > 0 ? '#ff604c' : undefined
          }}
        >
          🔴 Unread ({unreadCount})
        </button>

        <button
          onClick={() => setFilter('read')}
          className={filter === 'read' ? 'btn-primary' : 'btn-ghost'}
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-full)' }}
        >
          ✓ Read ({messages.length - unreadCount})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'Anton', fontSize: '20px' }}>
          Loading Inquiries...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: 'var(--panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
          <h3 style={{ color: 'var(--gold)', fontSize: '20px', marginBottom: '6px' }}>
            {filter === 'unread' ? 'No unread inquiries!' : 'No messages found.'}
          </h3>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            {filter === 'unread' ? 'You have reviewed all incoming messages.' : 'New messages submitted through the public contact form will appear here.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Sender</th>
                <th style={{ width: '40%' }}>Subject & Message</th>
                <th style={{ width: '14%' }}>Date</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '12%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map(msg => {
                const isNew = !msg.isRead;
                return (
                  <tr
                    key={msg._id}
                    style={{
                      background: isNew ? 'rgba(229, 64, 42, 0.06)' : 'transparent',
                      borderLeft: isNew ? '3px solid var(--red)' : '3px solid transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isNew && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />}
                        <div style={{ fontWeight: 700, color: 'var(--cream)', fontSize: '14px' }}>{msg.name}</div>
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        style={{ fontSize: '12px', color: 'var(--gold)', display: 'block', marginTop: '3px' }}
                      >
                        {msg.email}
                      </a>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: isNew ? 'var(--gold)' : 'var(--cream)', marginBottom: '4px', fontSize: '14px' }}>
                        {msg.subject}
                      </div>
                      <div style={{ fontSize: '13px', color: isNew ? 'var(--cream)' : 'var(--stone)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                        {msg.message}
                      </div>
                    </td>

                    <td style={{ fontSize: '12px', color: 'var(--stone)', whiteSpace: 'nowrap' }}>
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td>
                      <button
                        onClick={() => handleToggleRead(msg._id)}
                        className={isNew ? 'badge badge-red' : 'badge'}
                        style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="Click to toggle status"
                      >
                        {isNew ? '● NEW UNREAD' : '✓ READ'}
                      </button>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="share-btn"
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                        >
                          Reply ✉️
                        </a>
                        <button
                          onClick={() => handleToggleRead(msg._id)}
                          className="share-btn"
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                          title={isNew ? 'Mark as Read' : 'Mark as Unread'}
                        >
                          {isNew ? '✓ Read' : 'Mark New'}
                        </button>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="share-btn"
                          style={{ fontSize: '12px', padding: '5px 10px', color: '#ff604c' }}
                          title="Delete inquiry"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
