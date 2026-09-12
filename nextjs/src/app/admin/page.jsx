'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalVlogs: 0,
    totalPhotos: 0,
    totalLocations: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalSubscribers: 0,
    totalViews: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, msgsRes] = await Promise.all([
          api.getStats().catch(() => ({ success: false })),
          api.getMessages().catch(() => ({ success: false }))
        ]);
        if (statsRes?.success) setStats(statsRes.data);
        if (msgsRes?.success && Array.isArray(msgsRes.data)) setRecentMessages(msgsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--cream)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>
            Welcome back to the Palu Vlogs Creator Studio
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/vlogs" className="btn-primary" style={{ fontSize: '13px', padding: '10px 18px' }}>
            + Add New Vlog
          </Link>
          <Link href="/admin/gallery" className="btn-gold" style={{ fontSize: '13px', padding: '10px 18px' }}>
            + Upload Photo
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <h4>🎬 Total Vlogs</h4>
          <div className="stat-num">{stats.totalVlogs}</div>
          <span style={{ fontSize: '12px', color: 'var(--stone)' }}>Published episodes</span>
        </div>

        <div className="stat-card">
          <h4>🖼️ Gallery Photos</h4>
          <div className="stat-num">{stats.totalPhotos}</div>
          <span style={{ fontSize: '12px', color: 'var(--stone)' }}>Moments archived</span>
        </div>

        <div className="stat-card">
          <h4>📍 Visited Places</h4>
          <div className="stat-num">{stats.totalLocations}</div>
          <span style={{ fontSize: '12px', color: 'var(--stone)' }}>Travel destinations</span>
        </div>

        <div className="stat-card">
          <h4>📬 Inquiries</h4>
          <div className="stat-num" style={{ color: stats.unreadMessages > 0 ? 'var(--red)' : 'var(--gold)' }}>
            {stats.totalMessages}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--stone)' }}>
            {stats.unreadMessages} unread messages
          </span>
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--gold)' }}>Recent Contact Messages</h3>
          <Link href="/admin/messages" style={{ fontSize: '13px', color: 'var(--stone)', fontWeight: 700 }}>
            View All ({recentMessages.length}) →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p style={{ color: 'var(--stone)', fontSize: '14px' }}>No contact messages yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map(msg => (
                  <tr key={msg._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--cream)' }}>{msg.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--stone)' }}>{msg.email}</div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ fontWeight: 600 }}>{msg.subject}</div>
                      <div style={{ fontSize: '12px', color: 'var(--stone)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.message}
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--stone)' }}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={msg.isRead ? 'badge' : 'badge badge-red'}>
                        {msg.isRead ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td>
                      <Link href="/admin/messages" className="vlog-link-btn" style={{ fontSize: '12px' }}>
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Setup Guide */}
      <div style={{ background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--cream)', marginBottom: '8px' }}>
          💡 Creator Dashboard Tips
        </h3>
        <p style={{ color: 'var(--stone)', fontSize: '14px', lineHeight: 1.6 }}>
          When adding a new vlog, simply paste any YouTube video link (e.g. <code>https://www.youtube.com/watch?v=...</code> or <code>https://youtu.be/...</code>). The system automatically extracts the YouTube Video ID and generates high-resolution thumbnails!
        </p>
      </div>
    </div>
  );
}
