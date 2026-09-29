'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Broken UI Sound Synthesis via Web Audio API:
 * - Glass shatter crash & heavy impact
 * - Electrical sparks & glitch sizzle
 * - Futuristic sci-fi repair laser sweep
 * - System reboot success chime
 */
const playBrokenUiAudio = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    // 1. Heavy Impact Crash & Glass Shatter (0s)
    const bufSize = Math.floor(ctx.sampleRate * 0.75);
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const out = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) out[i] = Math.random() * 2 - 1;

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const shatterFilter = ctx.createBiquadFilter();
    shatterFilter.type = 'highpass';
    shatterFilter.frequency.setValueAtTime(1400, now);
    shatterFilter.frequency.exponentialRampToValueAtTime(300, now + 0.5);

    const shatterGain = ctx.createGain();
    shatterGain.gain.setValueAtTime(0.4, now);
    shatterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noiseSrc.connect(shatterFilter);
    shatterFilter.connect(shatterGain);
    shatterGain.connect(ctx.destination);
    noiseSrc.start(now);
    noiseSrc.stop(now + 0.65);

    // Deep Thud Boom
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(180, now);
    boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.7);
    boomGain.gain.setValueAtTime(0.45, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(now);
    boomOsc.stop(now + 0.75);

    // 2. Electrical Glitch Sparks (0.3s, 0.75s, 1.25s)
    [0.3, 0.75, 1.25].forEach((delay) => {
      const sparkOsc = ctx.createOscillator();
      const sparkGain = ctx.createGain();
      sparkOsc.type = 'sawtooth';
      sparkOsc.frequency.setValueAtTime(900 + Math.random() * 800, now + delay);
      sparkOsc.frequency.linearRampToValueAtTime(200, now + delay + 0.12);
      sparkGain.gain.setValueAtTime(0.2, now + delay);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);
      sparkOsc.connect(sparkGain);
      sparkGain.connect(ctx.destination);
      sparkOsc.start(now + delay);
      sparkOsc.stop(now + delay + 0.16);
    });

    // 3. Sci-Fi Scanning Repair Laser (2.5s)
    const scanOsc = ctx.createOscillator();
    const scanGain = ctx.createGain();
    scanOsc.type = 'sine';
    scanOsc.frequency.setValueAtTime(1400, now + 2.5);
    scanOsc.frequency.exponentialRampToValueAtTime(320, now + 3.4);
    scanGain.gain.setValueAtTime(0.18, now + 2.5);
    scanGain.gain.exponentialRampToValueAtTime(0.001, now + 3.45);
    scanOsc.connect(scanGain);
    scanGain.connect(ctx.destination);
    scanOsc.start(now + 2.5);
    scanOsc.stop(now + 3.45);

    // 4. System Reboot Triumph Chime (3.6s)
    const rebootNotes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    rebootNotes.forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(freq, now + 3.6 + idx * 0.08);
      chimeGain.gain.setValueAtTime(0.25, now + 3.6 + idx * 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 3.6 + idx * 0.08 + 0.7);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 3.6 + idx * 0.08);
      chimeOsc.stop(now + 3.6 + idx * 0.08 + 0.72);
    });
  } catch {
    // fallback
  }
};

const GLITCH_PARTICLES = ['💥', '⚡', '⚠️', '🔥', '💻', '🧱', '🚨', '🔩'];

export default function AdminBrokenUI() {
  const [isBroken, setIsBroken] = useState(false);
  const [particles, setParticles] = useState([]);
  const [statusText, setStatusText] = useState('');
  const [countdown, setCountdown] = useState(4);
  const timerRef = useRef(null);
  const countIntervalRef = useRef(null);

  // Apply or remove the broken class directly on document.body for instant, global CSS impact
  useEffect(() => {
    if (isBroken) {
      document.body.classList.add('admin-is-broken-mode');
    } else {
      document.body.classList.remove('admin-is-broken-mode');
    }
    return () => {
      document.body.classList.remove('admin-is-broken-mode');
    };
  }, [isBroken]);

  // Check login flag on mount (sessionStorage, localStorage, or query param ?break_ui=true)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTrigger = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasParam = urlParams.get('break_ui') === 'true' || urlParams.has('broken');
      const hasLocal = localStorage.getItem('palu_trigger_broken_ui') === 'true';
      const hasSession = sessionStorage.getItem('palu_trigger_broken_ui') === 'true';

      if (hasParam || hasLocal || hasSession) {
        localStorage.removeItem('palu_trigger_broken_ui');
        sessionStorage.removeItem('palu_trigger_broken_ui');

        if (hasParam && window.history.replaceState) {
          window.history.replaceState({}, '', window.location.pathname);
        }

        // Start broken animation immediately
        setTimeout(() => {
          triggerBrokenEffect();
        }, 150);
      }
    };

    checkTrigger();

    // Listen for custom trigger event
    const handleCustomTrigger = () => {
      triggerBrokenEffect();
    };
    window.addEventListener('palu_trigger_broken_ui', handleCustomTrigger);
    return () => {
      window.removeEventListener('palu_trigger_broken_ui', handleCustomTrigger);
    };
  }, []);

  const triggerBrokenEffect = () => {
    if (isBroken) return;
    setIsBroken(true);
    setStatusText('🚨 CRITICAL ERROR: ADMIN UI SYSTEM OVERLOAD!');
    setCountdown(4);

    // Play broken glass, earthquake & reboot audio
    playBrokenUiAudio();

    // Spawn 22 chaotic flying debris particles
    const newParticles = Array.from({ length: 22 }).map((_, i) => ({
      id: `${Date.now()}_${i}`,
      symbol: GLITCH_PARTICLES[i % GLITCH_PARTICLES.length],
      dx: `${(Math.random() - 0.5) * 450}px`,
      dy: `${(Math.random() - 0.3) * 350}px`,
      rot: `${(Math.random() - 0.5) * 720}deg`,
      scale: 0.8 + Math.random() * 0.9,
    }));
    setParticles(newParticles);

    // Countdown timer 4 -> 0
    let count = 4;
    countIntervalRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 1) {
        setStatusText('💻 RE-ASSEMBLING UI PIECES VIA SCANNER...');
      }
    }, 1000);

    // Complete repair & restore at 4.4 seconds
    timerRef.current = setTimeout(() => {
      restoreSystem();
    }, 4400);
  };

  const restoreSystem = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countIntervalRef.current) clearInterval(countIntervalRef.current);
    setIsBroken(false);
    setParticles([]);
    setStatusText('');
    document.body.classList.remove('admin-is-broken-mode');
  };

  return (
    <>
      {/* Quick Trigger Button in Top Header */}
      <button
        type="button"
        className="admin-break-ui-btn"
        onClick={triggerBrokenEffect}
        title="Trigger Broken UI Animation! 💥"
      >
        <span className="btn-spark">⚡</span>
        <span>Break UI 💥</span>
      </button>

      {/* When UI is Broken: Full-screen Glass Cracks, Glitch Fissures, and Warning Dialog */}
      {isBroken && (
        <div className="broken-ui-overlay" aria-live="assertive">
          {/* Glass Cracks SVG Pattern */}
          <svg className="glass-cracks-svg" viewBox="0 0 1000 700" preserveAspectRatio="none">
            {/* Center impact crater */}
            <circle cx="500" cy="350" r="16" fill="#ffffff" opacity="0.95" />
            <circle cx="500" cy="350" r="48" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />
            <circle cx="500" cy="350" r="120" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeDasharray="14 8" />

            {/* Fracture lines spreading across the entire screen */}
            <path
              d="M500,350 L200,80 L80,0 M500,350 L750,110 L940,30 M500,350 L860,420 L1000,510 M500,350 L640,620 L720,700 M500,350 L320,590 L180,700 M500,350 L120,410 L0,450 M500,350 L420,180 L380,0"
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            {/* Secondary web branches */}
            <path
              d="M320,190 L180,260 M200,80 L280,30 M750,110 L680,40 M860,420 L920,330 M640,620 L550,680 M320,590 L400,660 M120,410 L90,520"
              stroke="rgba(255, 71, 87, 0.9)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Cyber Glitch Scanlines */}
          <div className="broken-scanlines" />

          {/* Laser Scanning Repair Beam */}
          <div className="repair-laser-beam" />

          {/* Flying Debris Particles */}
          <div className="broken-particles-layer">
            {particles.map((p) => (
              <span
                key={p.id}
                className="broken-particle"
                style={{
                  '--dx': p.dx,
                  '--dy': p.dy,
                  '--rot': p.rot,
                  '--scale': p.scale,
                }}
              >
                {p.symbol}
              </span>
            ))}
          </div>

          {/* Central Comic Broken Alert Card */}
          <div className="broken-alert-box">
            <div className="alert-box-header">
              <span className="alert-siren">🚨</span>
              <span>ADMIN PORTAL DESTROYED!</span>
              <span className="alert-siren">🚨</span>
            </div>

            <p className="alert-subtext">
              {statusText || 'Too much chaos detected! Gravity is disabled & background is cracked!'}
            </p>

            <div className="alert-countdown-bar">
              <div className="countdown-pill">
                Auto-Repairing in: <b>{countdown}s</b>
              </div>
              <button
                type="button"
                className="btn-repair-now"
                onClick={restoreSystem}
              >
                🛠️ Restore Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS injected permanently for body.admin-is-broken-mode */}
      <style jsx global>{`
        /* ── Break UI Button in Header ── */
        .admin-break-ui-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(255, 165, 2, 0.25));
          border: 1px solid rgba(255, 71, 87, 0.5);
          color: #ffc93c;
          font-family: 'Anton', sans-serif;
          font-size: 11.5px;
          letter-spacing: 0.05em;
          padding: 5px 11px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 10px rgba(255, 71, 87, 0.25);
        }
        .admin-break-ui-btn:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, rgba(255, 71, 87, 0.4), rgba(255, 165, 2, 0.45));
          border-color: #ff4757;
          box-shadow: 0 0 18px rgba(255, 71, 87, 0.6);
        }
        .btn-spark {
          animation: sparkPulse 1.2s infinite;
        }

        /* ══════════════════════════════════════════════════════
           TOTAL BROKEN UI EFFECT (Toggled via body class)
           ══════════════════════════════════════════════════════ */
        body.admin-is-broken-mode,
        body.admin-is-broken-mode .admin-layout,
        body.admin-is-broken-mode .admin-main {
          background-color: #0d0808 !important;
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(255, 71, 87, 0.35) 0%, transparent 65%),
            linear-gradient(45deg, #180808 25%, #2a0b0b 25%, #2a0b0b 50%, #180808 50%, #180808 75%, #2a0b0b 75%, #2a0b0b 100%) !important;
          background-size: cover, 36px 36px !important;
          animation: backgroundGlitchFlicker 0.18s infinite alternate !important;
        }

        body.admin-is-broken-mode .admin-layout {
          animation: uiEarthquake 0.45s ease-in-out infinite alternate !important;
          perspective: 1200px !important;
        }

        /* Sidebar snaps loose & tilts heavily sideways */
        body.admin-is-broken-mode .admin-sidebar {
          transform: rotate(-14deg) translate(-25px, 60px) scale(0.96) !important;
          border-color: #ff4757 !important;
          box-shadow: 0 25px 60px rgba(255, 71, 87, 0.7) !important;
          filter: drop-shadow(0 0 25px #ff3838) !important;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }

        /* Mobile Header droops down crookedly */
        body.admin-is-broken-mode .admin-mobile-header {
          transform: rotate(6deg) translateY(28px) !important;
          border-color: #ffa502 !important;
        }

        /* Stat Cards tumble down and tilt in different directions */
        body.admin-is-broken-mode .admin-stats-grid .stat-card:nth-child(1) {
          transform: rotate(-12deg) translateY(38px) scale(0.92) !important;
          border-color: #ff4757 !important;
          box-shadow: -10px 15px 30px rgba(255, 71, 87, 0.5) !important;
        }
        body.admin-is-broken-mode .admin-stats-grid .stat-card:nth-child(2) {
          transform: rotate(15deg) translateY(48px) scale(0.94) !important;
          border-color: #ffa502 !important;
          box-shadow: 10px 18px 30px rgba(255, 165, 2, 0.5) !important;
        }
        body.admin-is-broken-mode .admin-stats-grid .stat-card:nth-child(3) {
          transform: rotate(-18deg) translateY(55px) scale(0.9) !important;
          border-color: #ff4757 !important;
        }
        body.admin-is-broken-mode .admin-stats-grid .stat-card:nth-child(4) {
          transform: rotate(10deg) translateY(42px) scale(0.93) !important;
          border-color: #38bdf8 !important;
        }

        /* Main Table / Panels disconnect and tilt */
        body.admin-is-broken-mode .admin-table-wrap, 
        body.admin-is-broken-mode .stat-card, 
        body.admin-is-broken-mode .admin-card {
          border-style: dashed !important;
          animation: cardWobble 0.8s ease-in-out infinite alternate !important;
        }

        /* Chromatic Aberration & Glitch text shadow on all titles */
        body.admin-is-broken-mode .admin-topbar h1, 
        body.admin-is-broken-mode .admin-sidebar-brand, 
        body.admin-is-broken-mode .stat-card .num {
          text-shadow: -3px 0 #ff4757, 3px 0 #00d2d3, 0 0 15px #ffa502 !important;
        }

        @keyframes sparkPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.4); }
        }

        @keyframes uiEarthquake {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-4px, 3px) rotate(-0.5deg); }
          50% { transform: translate(5px, -3px) rotate(0.6deg); }
          75% { transform: translate(-3px, -4px) rotate(-0.4deg); }
          100% { transform: translate(4px, 4px) rotate(0.5deg); }
        }

        @keyframes backgroundGlitchFlicker {
          0% { filter: brightness(1) contrast(1.1); }
          50% { filter: brightness(1.35) contrast(1.45) hue-rotate(15deg); }
          100% { filter: brightness(0.9) contrast(1.2); }
        }

        @keyframes cardWobble {
          0% { transform: skewX(-1.5deg); }
          100% { transform: skewX(1.5deg); }
        }
      `}</style>

      {/* Broken UI Screen Overlay Styles */}
      <style jsx>{`
        .broken-ui-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99999;
          overflow: hidden;
        }

        .glass-cracks-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 25px #ff4757);
          animation: cracksFlicker 0.25s infinite alternate;
        }

        .broken-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.25) 2px,
            transparent 2px,
            transparent 4px
          );
          opacity: 0.7;
        }

        /* Scanning repair laser sweeping from top to bottom */
        .repair-laser-beam {
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          background: linear-gradient(90deg, #38bdf8, #2ecc71, #ffc93c, #38bdf8);
          box-shadow: 0 0 35px #2ecc71, 0 0 60px #38bdf8;
          animation: laserScan 4.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* Broken particles */
        .broken-particles-layer {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .broken-particle {
          position: absolute;
          font-size: 32px;
          animation: particleFly 1.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        /* Center Alert Box */
        .broken-alert-box {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(18, 10, 10, 0.96);
          border: 3px solid #ff4757;
          border-radius: 16px;
          padding: 24px 30px;
          max-width: 480px;
          width: 90%;
          text-align: center;
          box-shadow: 0 0 50px rgba(255, 71, 87, 0.85), inset 0 0 25px rgba(255, 71, 87, 0.4);
          pointer-events: auto;
          animation: alertPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .alert-box-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: 'Anton', sans-serif;
          font-size: 24px;
          color: #ff4757;
          letter-spacing: 0.05em;
          text-shadow: 0 0 16px rgba(255, 71, 87, 0.8);
        }

        .alert-siren {
          font-size: 26px;
          animation: sirenSpin 0.7s infinite linear;
        }

        .alert-subtext {
          font-size: 14px;
          color: #e2e8f0;
          margin: 12px 0 20px;
          line-height: 1.5;
        }

        .alert-countdown-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: rgba(0, 0, 0, 0.6);
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .countdown-pill {
          font-size: 13px;
          color: #ffc93c;
          font-weight: 600;
        }

        .countdown-pill b {
          font-family: 'Anton', sans-serif;
          font-size: 18px;
          color: #ff4757;
          margin-left: 4px;
        }

        .btn-repair-now {
          background: #2ecc71;
          color: #000;
          font-family: 'Anton', sans-serif;
          font-size: 13px;
          letter-spacing: 0.05em;
          border: none;
          padding: 7px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
          box-shadow: 0 0 15px rgba(46, 204, 113, 0.6);
        }

        .btn-repair-now:hover {
          transform: scale(1.08);
          background: #27ae60;
        }

        @keyframes laserScan {
          0% { top: -20px; opacity: 1; }
          75% { top: 95vh; opacity: 1; }
          100% { top: 100vh; opacity: 0; }
        }

        @keyframes particleFly {
          0% { opacity: 1; transform: translate(0, 0) scale(0.3) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(var(--scale)) rotate(var(--rot)); }
        }

        @keyframes alertPop {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        @keyframes sirenSpin {
          0% { transform: scale(1); }
          50% { transform: scale(1.3) rotate(15deg); }
          100% { transform: scale(1); }
        }

        @keyframes cracksFlicker {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
