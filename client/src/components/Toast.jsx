import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${type === 'error' ? 'toast-error' : ''}`}>
        <span>{type === 'error' ? '⚠️' : '✅'}</span>
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '12px' }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
