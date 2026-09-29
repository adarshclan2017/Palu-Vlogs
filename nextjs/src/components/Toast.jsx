'use client';
import React, { useEffect } from 'react';

/**
 * Centered Modal Popup Box for Save, Update, and Action Confirmations
 * Displays high-visibility feedback with backdrop blur and action confirmation.
 */
export default function Toast({ message, type = 'success', title, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const displayTitle = title || (isSuccess ? 'Saved Successfully!' : 'Action Notice');

  // Strip leading emojis from message text if already present
  const cleanMessage = typeof message === 'string'
    ? message.replace(/^[\s✅⚠️❌🎉📌💾]+/, '').trim()
    : message;

  // Listen for Escape key to close popup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 11, 15, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out forwards'
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--panel, #181920)',
          border: isSuccess ? '1.5px solid rgba(72, 199, 120, 0.5)' : '1.5px solid rgba(229, 64, 42, 0.5)',
          borderRadius: '20px',
          boxShadow: isSuccess
            ? '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 36px rgba(72, 199, 120, 0.25)'
            : '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 36px rgba(229, 64, 42, 0.25)',
          maxWidth: '440px',
          width: '100%',
          padding: '36px 28px 28px',
          textAlign: 'center',
          position: 'relative',
          color: 'var(--cream, #f5efe6)',
          animation: 'fadeIn 0.25s ease-out forwards'
        }}
      >
        {/* Close 'X' Button at Top Right */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--stone, #94a3b8)',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'var(--stone, #94a3b8)';
            }}
          >
            ✕
          </button>
        )}

        {/* Centered Glowing Status Badge */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: isSuccess
              ? 'radial-gradient(circle, rgba(72,199,120,0.28) 0%, rgba(72,199,120,0.08) 100%)'
              : 'radial-gradient(circle, rgba(229,64,42,0.28) 0%, rgba(229,64,42,0.08) 100%)',
            border: isSuccess ? '2.5px solid #48c778' : '2.5px solid #ff604c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            margin: '0 auto 18px',
            boxShadow: isSuccess ? '0 0 28px rgba(72,199,120,0.4)' : '0 0 28px rgba(229,64,42,0.4)'
          }}
        >
          {isSuccess ? '✅' : '⚠️'}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '25px',
            letterSpacing: '0.03em',
            color: isSuccess ? '#48c778' : '#ff604c',
            marginBottom: '10px',
            textTransform: 'uppercase'
          }}
        >
          {displayTitle}
        </h3>

        {/* Message */}
        <p
          style={{
            color: 'var(--stone, #cbd5e1)',
            fontSize: '15px',
            lineHeight: 1.6,
            marginBottom: '26px'
          }}
        >
          {cleanMessage}
        </p>

        {/* Prominent Action Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px 24px',
              fontSize: '15.5px',
              fontWeight: 700,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            {isSuccess ? 'OK, Got It 👍' : 'Close'}
          </button>
        )}
      </div>
    </div>
  );
}
