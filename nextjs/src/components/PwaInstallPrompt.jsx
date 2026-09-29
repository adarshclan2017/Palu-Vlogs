'use client';
import React, { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration failed:', err);
        });
      });
    }

    // 2. Check if already running in standalone mode (installed)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // 3. Check if user already dismissed this session
    const isDismissed = sessionStorage.getItem('palu_pwa_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }

    // 4. Listen for Chrome/Android/Desktop install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 5. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    if (isIosDevice && isSafari && !isStandaloneMode) {
      setIsIos(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('palu_pwa_dismissed', 'true');
    } catch {}
  };

  if (isStandalone || dismissed || (!isInstallable && !isIos)) {
    return null;
  }

  return (
    <aside className="pwa-install-banner" aria-label="Install App Banner">
      <div className="pwa-banner-content">
        <div className="pwa-icon-box">
          <img src="/icons/icon-192.png" alt="Palu Vlogs Logo" className="pwa-banner-logo" />
        </div>

        <div className="pwa-text-box">
          <h4 className="pwa-banner-title">Install Palu Vlogs App</h4>
          <p className="pwa-banner-desc">
            {isIos
              ? 'Tap Share ⎋ and choose "Add to Home Screen" ➕ for instant access!'
              : 'Add to your home screen for quick offline access and fast streaming!'}
          </p>
        </div>

        <div className="pwa-actions-box">
          {!isIos && (
            <button
              type="button"
              className="pwa-install-btn"
              onClick={handleInstallClick}
            >
              📲 Install Now
            </button>
          )}
          <button
            type="button"
            className="pwa-dismiss-btn"
            onClick={handleDismiss}
            aria-label="Dismiss install banner"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
