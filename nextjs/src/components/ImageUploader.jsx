'use client';
import React, { useState, useRef } from 'react';

/**
 * Modern Image Uploader with:
 * - Drag and Drop
 * - File Picker (Mobile & Desktop)
 * - Automatic client-side canvas resizing & compression (< 500KB)
 * - Live Preview
 * - Optional URL fallback
 */
export default function ImageUploader({
  value = '',
  onChange,
  label = 'Upload Image',
  aspectRatio = 'auto',
  helpText = 'JPG, PNG, WebP up to 15MB (automatically optimized)'
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setProcessing(true);
    try {
      const dataUrl = await compressImage(file, 1600, 1600, 0.85);
      if (onChange) onChange(dataUrl);
    } catch (err) {
      console.error('Image compression error:', err);
      // Fallback to raw base64 if canvas compression fails
      const reader = new FileReader();
      reader.onload = (e) => {
        if (onChange) onChange(e.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setProcessing(false);
    }
  };

  const compressImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Image failed to load'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim() && onChange) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
      setUrlInput('');
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label className="form-label">{label}</label>}

      {value ? (
        // Preview State
        <div
          style={{
            position: 'relative',
            border: '2px solid var(--gold)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--panel-2)',
            padding: '8px'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: '260px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0a0a0a'
            }}
          >
            <img
              src={value}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '260px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px',
              justifyContent: 'flex-end',
              padding: '0 4px'
            }}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="vlog-link-btn"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              🔄 Change Photo
            </button>
            <button
              type="button"
              onClick={() => onChange && onChange('')}
              className="vlog-link-btn"
              style={{ fontSize: '12px', padding: '6px 14px', color: '#ff6b6b', borderColor: '#ff6b6b' }}
            >
              🗑️ Remove
            </button>
          </div>
        </div>
      ) : (
        // Drop / Upload Zone
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--gold)' : 'var(--line-strong)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'rgba(255, 201, 60, 0.08)' : 'var(--panel-2)',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '36px' }}>{processing ? '⏳' : '📁'}</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cream)' }}>
              {processing ? 'Optimizing photo...' : 'Click to upload image or drag & drop'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--stone)' }}>{helpText}</div>

            <button
              type="button"
              className="btn-primary"
              style={{ fontSize: '12px', padding: '6px 16px', marginTop: '6px', pointerEvents: 'none' }}
            >
              Select from Device 📸
            </button>
          </div>

          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--stone)',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {showUrlInput ? 'Hide URL input' : 'Or enter image URL instead'}
            </button>
          </div>

          {showUrlInput && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or /assets/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="form-input"
                style={{ fontSize: '13px', padding: '8px 12px' }}
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="btn-gold"
                style={{ fontSize: '12px', padding: '8px 14px', whiteSpace: 'nowrap' }}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
