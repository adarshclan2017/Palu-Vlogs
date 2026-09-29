'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Winter Mountain Breeze & Ice Chime Audio (Web Audio API)
 * Plays a delicate, magical crystalline snow chime when user taps the mountain title.
 */
const playSnowChimeAudio = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    // Winter wind gust (filtered white noise)
    const bufSize = Math.floor(ctx.sampleRate * 0.8);
    const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const out = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) out[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(850, now + 0.35);
    filter.frequency.linearRampToValueAtTime(320, now + 0.8);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.8);

    // Crystalline ice bell chimes (High harmonic sparkles)
    const iceNotes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
    iceNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.62);
    });
  } catch {
    // fallback
  }
};

const SNOWFLAKE_SYMBOLS = ['❄', '❅', '•', '✦', '✧', '❄', '❅'];

export default function MountainSnowText() {
  const [isBlizzard, setIsBlizzard] = useState(false);
  const [snowflakes, setSnowflakes] = useState([]);
  const [blizzardPuffs, setBlizzardPuffs] = useState([]);
  const blizzardTimerRef = useRef(null);

  // Generate 26 persistent falling snowflakes with organic drift
  useEffect(() => {
    const list = Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      symbol: SNOWFLAKE_SYMBOLS[i % SNOWFLAKE_SYMBOLS.length],
      left: `${(i * 3.8 + Math.random() * 2.5).toFixed(1)}%`,
      size: `${10 + Math.random() * 16}px`,
      duration: `${3.5 + Math.random() * 4.5}s`,
      delay: `${-(Math.random() * 7).toFixed(2)}s`,
      opacity: (0.35 + Math.random() * 0.55).toFixed(2),
      driftX: `${(Math.random() - 0.5) * 45}px`,
      blur: i % 4 === 0 ? '1px' : '0px'
    }));
    setSnowflakes(list);
  }, []);

  const handleInteraction = () => {
    if (isBlizzard) return;
    setIsBlizzard(true);
    playSnowChimeAudio();

    // Spawn 16 swirling blizzard gusts on tap
    const puffs = Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * 2 * Math.PI;
      const dist = 60 + Math.random() * 120;
      return {
        id: `${Date.now()}_${i}`,
        symbol: i % 2 === 0 ? '❄️' : '✨',
        dx: `${Math.cos(angle) * dist}px`,
        dy: `${Math.sin(angle) * dist - 20}px`,
        scale: 0.7 + Math.random() * 0.8
      };
    });
    setBlizzardPuffs(puffs);

    if (blizzardTimerRef.current) clearTimeout(blizzardTimerRef.current);
    blizzardTimerRef.current = setTimeout(() => {
      setIsBlizzard(false);
      setBlizzardPuffs([]);
    }, 2400);
  };

  return (
    <div
      className={`mountain-snow-container ${isBlizzard ? 'blizzard-active' : ''}`}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      role="button"
      tabIndex={0}
      title="Tap for Winter Mountain Snow Blizzard! ❄️🏔️"
    >
      {/* ── Background Mountain Peaks Silhouette & Alpine Fog ── */}
      <div className="mountain-backdrop-layer" aria-hidden="true">
        <svg
          className="mountain-svg"
          viewBox="0 0 900 240"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Deep Mountain Granite Gradient */}
            <linearGradient id="mtnBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#1e293b" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.9" />
            </linearGradient>

            {/* Foreground Mountain Granite Gradient */}
            <linearGradient id="mtnForeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#334155" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>

            {/* Glowing Pure Snow Peak Cap */}
            <linearGradient id="snowCapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
            </linearGradient>

            {/* Alpine Sun / Aurora Rim Glow */}
            <linearGradient id="auroraGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Distant Ridge */}
          <polygon
            points="0,240 70,120 180,170 310,90 440,165 560,80 690,150 810,95 900,160 900,240"
            fill="url(#mtnBackGrad)"
          />

          {/* Distant Snow Caps */}
          <polygon points="60,125 70,120 85,128 75,138" fill="url(#snowCapGrad)" />
          <polygon points="300,98 310,90 325,100 312,112" fill="url(#snowCapGrad)" />
          <polygon points="550,88 560,80 575,90 562,102" fill="url(#snowCapGrad)" />
          <polygon points="800,102 810,95 825,106 813,116" fill="url(#snowCapGrad)" />

          {/* Foreground Majestic Ridge */}
          <polygon
            points="0,240 110,135 240,65 370,140 490,50 630,130 760,40 860,115 900,90 900,240"
            fill="url(#mtnForeGrad)"
          />

          {/* Foreground Snowy Summits */}
          {/* Peak 1 (240, 65) */}
          <polygon points="215,85 240,65 268,88 250,98 238,90 226,96" fill="url(#snowCapGrad)" />
          {/* Peak 2 (490, 50) */}
          <polygon points="460,74 490,50 522,76 505,88 492,80 478,86" fill="url(#snowCapGrad)" />
          {/* Peak 3 (760, 40) */}
          <polygon points="730,68 760,40 792,66 775,80 760,72 748,78" fill="url(#snowCapGrad)" />

          {/* Ridge Rim Lighting Accent */}
          <polyline
            points="0,240 110,135 240,65 370,140 490,50 630,130 760,40 860,115 900,90"
            fill="none"
            stroke="url(#auroraGlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Alpine Drifting Mist Layer */}
        <div className="alpine-mist-fog" />
      </div>

      {/* ── Falling Snow Flurry Layer ── */}
      <div className="snow-flurry-layer" aria-hidden="true">
        {snowflakes.map((s) => (
          <span
            key={s.id}
            className="snowflake-item"
            style={{
              left: s.left,
              fontSize: s.size,
              animationDuration: s.duration,
              animationDelay: s.delay,
              opacity: s.opacity,
              filter: `blur(${s.blur})`,
              '--drift-x': s.driftX
            }}
          >
            {s.symbol}
          </span>
        ))}
      </div>

      {/* ── Interactive Blizzard Puff Burst (on tap) ── */}
      {blizzardPuffs.length > 0 && (
        <div className="blizzard-burst-layer" aria-hidden="true">
          {blizzardPuffs.map((p) => (
            <span
              key={p.id}
              className="blizzard-puff-item"
              style={{
                '--dx': p.dx,
                '--dy': p.dy,
                '--scale': p.scale
              }}
            >
              {p.symbol}
            </span>
          ))}
        </div>
      )}

      {/* ── Main Mountain Snow Typography ── */}
      <h1 className="mountain-title">
        {/* Row 1: PALU */}
        <span className="palu-word-wrapper">
          {/* Natural snow caps sitting on top of the letters */}
          <span className="snow-cap-strip" aria-hidden="true">
            <span className="snow-drift drift-1" />
            <span className="snow-drift drift-2" />
            <span className="snow-drift drift-3" />
            <span className="snow-drift drift-4" />
          </span>
          <span className="word-text word-palu">PALU</span>
        </span>

        <br />

        {/* Row 2: VLOGS. */}
        <span className="vlogs-word-wrapper">
          <span className="snow-cap-strip strip-vlogs" aria-hidden="true">
            <span className="snow-drift drift-5" />
            <span className="snow-drift drift-6" />
            <span className="snow-drift drift-7" />
            <span className="snow-drift drift-8" />
            <span className="snow-drift drift-9" />
          </span>
          <span className="word-text word-vlogs">VLOGS.</span>
        </span>
      </h1>

      {/* Alpine Mountain Peak Badge */}
      <div className="mountain-snow-tag" aria-hidden="true">
        <span>🏔️ SNOW MOUNTAIN EDITION ❄️</span>
      </div>

      <style jsx>{`
        .mountain-snow-container {
          position: relative;
          display: inline-block;
          cursor: pointer;
          user-select: none;
          padding: 8px 12px 14px;
          margin-bottom: 8px;
          border-radius: 18px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mountain-snow-container:hover {
          transform: translateY(-2px);
        }

        .mountain-snow-container:active {
          transform: scale(0.985);
        }

        /* ── Mountain SVG Backdrop ── */
        .mountain-backdrop-layer {
          position: absolute;
          inset: -12px -20px 0 -20px;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
          border-radius: 18px;
        }

        .mountain-svg {
          width: 100%;
          height: 100%;
          opacity: 0.62;
          filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.9));
          transition: opacity 0.4s ease, filter 0.4s ease;
        }

        .blizzard-active .mountain-svg {
          opacity: 0.88;
          filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.65)) drop-shadow(0 15px 30px rgba(0,0,0,0.9));
        }

        /* Drifting Alpine Mist */
        .alpine-mist-fog {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 55%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(226, 232, 240, 0.12) 25%,
            rgba(56, 189, 248, 0.08) 50%,
            rgba(226, 232, 240, 0.12) 75%,
            transparent
          );
          filter: blur(12px);
          animation: alpineMistRoll 18s linear infinite;
        }

        /* ── Falling Snow Flurry ── */
        .snow-flurry-layer {
          position: absolute;
          inset: -25px -15px 0 -15px;
          pointer-events: none;
          z-index: 4;
          overflow: hidden;
        }

        .snowflake-item {
          position: absolute;
          top: -24px;
          color: #ffffff;
          user-select: none;
          pointer-events: none;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 16px rgba(56, 189, 248, 0.6);
          animation: snowflakeFall linear infinite;
        }

        /* ── Blizzard Burst on Tap ── */
        .blizzard-burst-layer {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 10;
        }

        .blizzard-puff-item {
          position: absolute;
          font-size: 22px;
          animation: blizzardFlyOut 0.85s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        /* ── Main Typography ── */
        .mountain-title {
          position: relative;
          z-index: 3;
          font-family: 'Anton', sans-serif;
          font-size: clamp(48px, 7.8vw, 98px);
          line-height: 0.9;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .palu-word-wrapper,
        .vlogs-word-wrapper {
          position: relative;
          display: inline-block;
        }

        /* Mountain Rock & Snow Peak Gradient Fill */
        .word-text {
          display: inline-block;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #e2e8f0 22%,
            #94a3b8 48%,
            #334155 75%,
            #0f172a 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 25px rgba(226, 232, 240, 0.25));
          transition: filter 0.3s ease;
        }

        /* PALU: Crisp Snow Cap Summit */
        .word-palu {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #f1f5f9 25%,
            #94a3b8 55%,
            #1e293b 85%,
            #0f172a 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* VLOGS: Snow-Capped Alpine Gold & Cyan Accent */
        .word-vlogs {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #e0f2fe 20%,
            #38bdf8 42%,
            #f59e0b 70%,
            #d97706 90%,
            #78350f 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 30px rgba(56, 189, 248, 0.45));
        }

        /* Frost Glisten Shimmer Wave */
        .mountain-title::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 40%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(56, 189, 248, 0.25) 55%,
            transparent 65%
          );
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: overlay;
          animation: frostGleamSweep 5s ease-in-out infinite;
        }

        /* ── Top Snow Cap Drift Layer ── */
        .snow-cap-strip {
          position: absolute;
          top: 4px;
          left: 0;
          right: 0;
          height: 12px;
          pointer-events: none;
          z-index: 6;
          display: flex;
          justify-content: space-around;
        }

        .snow-drift {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 1px 4px rgba(255, 255, 255, 0.8), 0 3px 8px rgba(56, 189, 248, 0.5);
          position: relative;
        }

        /* Custom realistic snow drifts on each letter */
        .drift-1 { width: 34%; height: 8px; transform: translateY(-4px) rotate(-2deg); }
        .drift-2 { width: 22%; height: 9px; transform: translateY(-5px) rotate(3deg); }
        .drift-3 { width: 28%; height: 7px; transform: translateY(-3px) rotate(-1deg); }
        .drift-4 { width: 14%; height: 6px; transform: translateY(-4px) rotate(2deg); }

        .drift-5 { width: 18%; height: 8px; transform: translateY(-3px) rotate(-2deg); }
        .drift-6 { width: 24%; height: 9px; transform: translateY(-5px) rotate(1deg); }
        .drift-7 { width: 20%; height: 7px; transform: translateY(-4px) rotate(-3deg); }
        .drift-8 { width: 22%; height: 8px; transform: translateY(-4px) rotate(2deg); }
        .drift-9 { width: 12%; height: 6px; transform: translateY(-3px) rotate(0deg); }

        /* Mountain Snow Tag Badge */
        .mountain-snow-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 3px 10px;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 20px;
          font-family: 'Anton', sans-serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #7dd3fc;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5), 0 0 12px rgba(56, 189, 248, 0.25);
          transition: all 0.3s ease;
        }

        .blizzard-active .mountain-snow-tag {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
        }

        /* ── Animations ── */
        @keyframes snowflakeFall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(140px) translateX(var(--drift-x, 15px)) rotate(180deg);
          }
          100% {
            transform: translateY(280px) translateX(0) rotate(360deg);
          }
        }

        @keyframes alpineMistRoll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes frostGleamSweep {
          0%, 65% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes blizzardFlyOut {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.3) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(var(--scale)) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
