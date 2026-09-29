'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * High-Fidelity Audio Synthesis:
 * - Ambient winter breeze
 * - Avalanche rumble on tap
 * - Crystalline ice freeze shimmer
 */
const playAvalancheAudio = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    // 1. Low-frequency mountain tremor / avalanche rumble (0s - 0.7s)
    const rumbleBufSize = Math.floor(ctx.sampleRate * 0.75);
    const rumbleBuf = ctx.createBuffer(1, rumbleBufSize, ctx.sampleRate);
    const rumbleOut = rumbleBuf.getChannelData(0);
    for (let i = 0; i < rumbleBufSize; i++) rumbleOut[i] = Math.random() * 2 - 1;
    const rumbleSrc = ctx.createBufferSource();
    rumbleSrc.buffer = rumbleBuf;
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(140, now);
    rumbleFilter.frequency.linearRampToValueAtTime(50, now + 0.7);
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.35, now);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    rumbleSrc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);
    rumbleSrc.start(now);
    rumbleSrc.stop(now + 0.75);

    // 2. High ice crack & crystalline freeze sparkles (0.2s - 0.9s)
    const sparkleNotes = [1318.51, 1567.98, 2093.0, 2637.02]; // E6, G6, C7, E7
    sparkleNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.18 + idx * 0.08);
      gain.gain.setValueAtTime(0.16, now + 0.18 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 + idx * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.18 + idx * 0.08);
      osc.stop(now + 0.18 + idx * 0.08 + 0.52);
    });
  } catch {
    // Graceful fallback
  }
};

const LETTERS_PALU = [
  { char: 'P', icicleHeight: 18, snowWidth: '88%' },
  { char: 'A', isPeak: true, icicleHeight: 14, snowWidth: '95%' },
  { char: 'L', icicleHeight: 12, snowWidth: '78%' },
  { char: 'U', icicleHeight: 20, snowWidth: '90%' },
];

const LETTERS_VLOGS = [
  { char: 'V', isValley: true, icicleHeight: 16, snowWidth: '92%' },
  { char: 'L', icicleHeight: 12, snowWidth: '76%' },
  { char: 'O', icicleHeight: 22, snowWidth: '85%' },
  { char: 'G', icicleHeight: 15, snowWidth: '88%' },
  { char: 'S', icicleHeight: 18, snowWidth: '92%' },
  { char: '.', isDot: true, icicleHeight: 8, snowWidth: '100%' },
];

export default function MountainSnowText() {
  const [isAvalanche, setIsAvalanche] = useState(false);
  const [fallingFlakes, setFallingFlakes] = useState([]);
  const [avalancheChunks, setAvalancheChunks] = useState([]);
  const avalancheTimeoutRef = useRef(null);

  // Generate 24 ambient fluttering snow particles
  useEffect(() => {
    const flakes = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.2 + (i % 2 === 0 ? 1 : 2.5)).toFixed(1)}%`,
      size: `${8 + (i % 5) * 3}px`,
      duration: `${4 + (i % 4) * 1.5}s`,
      delay: `${-(i * 0.35).toFixed(2)}s`,
      drift: `${(i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 10)}px`,
      opacity: (0.4 + (i % 4) * 0.18).toFixed(2),
      symbol: i % 3 === 0 ? '❄' : i % 2 === 0 ? '❅' : '•',
    }));
    setFallingFlakes(flakes);
  }, []);

  const handleTrigger = () => {
    if (isAvalanche) return;
    setIsAvalanche(true);
    playAvalancheAudio();

    // Spawn 18 flying avalanche chunks & ice debris tumbling down
    const chunks = Array.from({ length: 18 }).map((_, i) => {
      const angle = (Math.PI / 4) + (Math.random() * (Math.PI / 2)); // fall downwards
      const dist = 60 + Math.random() * 110;
      return {
        id: `${Date.now()}_${i}`,
        symbol: ['❄️', '🌨️', '🧊', '💨', '✨'][i % 5],
        dx: `${(Math.random() - 0.5) * 160}px`,
        dy: `${Math.sin(angle) * dist + 40}px`,
        scale: 0.7 + Math.random() * 0.7,
        rot: `${(Math.random() - 0.5) * 720}deg`,
      };
    });
    setAvalancheChunks(chunks);

    if (avalancheTimeoutRef.current) clearTimeout(avalancheTimeoutRef.current);
    avalancheTimeoutRef.current = setTimeout(() => {
      setIsAvalanche(false);
      setAvalancheChunks([]);
    }, 2800);
  };

  return (
    <div
      className={`glacier-mountain-hero ${isAvalanche ? 'avalanche-active' : ''}`}
      onClick={handleTrigger}
      onTouchStart={handleTrigger}
      role="button"
      tabIndex={0}
      title="Tap to trigger Mountain Avalanche & Snow Freeze! 🏔️❄️"
    >
      {/* ── Layer 1: Aurora Borealis Sky Ribbon ── */}
      <div className="aurora-sky-ribbon" aria-hidden="true" />

      {/* ── Layer 2: Geometric Mountain Ridges (Vector Backdrop) ── */}
      <div className="mountain-ridge-backdrop" aria-hidden="true">
        <svg viewBox="0 0 1000 280" preserveAspectRatio="none" className="ridge-svg">
          <defs>
            <linearGradient id="ridgeFarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#1e293b" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="ridgeNearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#64748b" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="sunRimGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#ffc93c" />
              <stop offset="100%" stopColor="#e5402a" />
            </linearGradient>
          </defs>

          {/* Distant Mountain Summits */}
          <polygon
            points="0,280 80,140 220,70 360,160 500,45 640,150 780,60 920,130 1000,90 1000,280"
            fill="url(#ridgeFarGrad)"
          />

          {/* Near Mountain Ridges with Jagged Chiseled Peaks */}
          <polygon
            points="0,280 120,160 270,85 410,170 540,55 690,165 830,75 940,140 1000,105 1000,280"
            fill="url(#ridgeNearGrad)"
          />

          {/* Snowy Peak Highlights */}
          <polygon points="255,95 270,85 288,98 274,106 265,102" fill="#ffffff" opacity="0.95" />
          <polygon points="522,66 540,55 562,70 545,80 534,74" fill="#ffffff" opacity="0.95" />
          <polygon points="815,86 830,75 848,88 834,98 824,92" fill="#ffffff" opacity="0.95" />

          {/* Rim light highlight */}
          <polyline
            points="0,280 120,160 270,85 410,170 540,55 690,165 830,75 940,140 1000,105"
            fill="none"
            stroke="url(#sunRimGlow)"
            strokeWidth="2"
            opacity="0.8"
          />
        </svg>

        {/* Alpine Valley Mist */}
        <div className="valley-mist-band" />
      </div>

      {/* ── Layer 3: Ambient Falling Snowflakes ── */}
      <div className="ambient-snow-field" aria-hidden="true">
        {fallingFlakes.map((f) => (
          <span
            key={f.id}
            className="snow-flake-particle"
            style={{
              left: f.left,
              fontSize: f.size,
              animationDuration: f.duration,
              animationDelay: f.delay,
              opacity: f.opacity,
              '--drift-val': f.drift,
            }}
          >
            {f.symbol}
          </span>
        ))}
      </div>

      {/* ── Layer 4: Interactive Avalanche Tumbling Chunks ── */}
      {avalancheChunks.length > 0 && (
        <div className="avalanche-debris-layer" aria-hidden="true">
          {avalancheChunks.map((c) => (
            <span
              key={c.id}
              className="avalanche-chunk"
              style={{
                '--dx': c.dx,
                '--dy': c.dy,
                '--scale': c.scale,
                '--rot': c.rot,
              }}
            >
              {c.symbol}
            </span>
          ))}
        </div>
      )}

      {/* ── Layer 5: Main Mountain Typography: PALU VLOGS. ── */}
      <h1 className="glacier-title">
        {/* ROW 1: PALU */}
        <span className="mountain-word word-palu-group">
          {LETTERS_PALU.map((l, idx) => (
            <span key={idx} className={`mountain-letter-box ${l.isPeak ? 'peak-letter' : ''}`}>
              {/* Snowcap on top of letter */}
              <span className={`letter-snow-crown ${isAvalanche ? 'snow-slide-off' : ''}`}>
                <span className="snow-puff puff-left" />
                <span className="snow-puff puff-center" style={{ width: l.snowWidth }} />
                <span className="snow-puff puff-right" />
              </span>

              {/* The Chiseled Mountain Letter */}
              <span className="letter-glyph glyph-palu" data-text={l.char}>
                {l.char}
              </span>

              {/* Hanging Crystalline Icicles */}
              <span
                className="hanging-icicle"
                style={{
                  height: `${l.icicleHeight}px`,
                  left: idx % 2 === 0 ? '25%' : '65%',
                }}
              >
                <span className="icicle-drip" />
              </span>
            </span>
          ))}
        </span>

        <br />

        {/* ROW 2: VLOGS. */}
        <span className="mountain-word word-vlogs-group">
          {LETTERS_VLOGS.map((l, idx) => (
            <span
              key={idx}
              className={`mountain-letter-box ${l.isDot ? 'dot-letter' : ''} ${l.isValley ? 'valley-letter' : ''}`}
            >
              {/* Snowcap on top of letter */}
              <span className={`letter-snow-crown ${isAvalanche ? 'snow-slide-off' : ''}`}>
                <span className="snow-puff puff-left" />
                <span className="snow-puff puff-center" style={{ width: l.snowWidth }} />
                <span className="snow-puff puff-right" />
              </span>

              {/* The Chiseled Mountain Letter with Gold/Cyan Alpine Glaze */}
              <span className="letter-glyph glyph-vlogs" data-text={l.char}>
                {l.char}
              </span>

              {/* Hanging Crystalline Icicles */}
              {!l.isDot && (
                <span
                  className="hanging-icicle"
                  style={{
                    height: `${l.icicleHeight}px`,
                    left: idx % 2 === 0 ? '30%' : '70%',
                  }}
                >
                  <span className="icicle-drip" />
                </span>
              )}
            </span>
          ))}
        </span>
      </h1>

      {/* Interactive Mountain Altitude Tag */}
      <div className="mountain-altitude-badge">
        <span className="altitude-pulse">❄️</span>
        <span className="altitude-text">ELEVATION 2,695M · MUNNAR FROST PEAK</span>
        <span className="altitude-tap-hint">(TAP FOR AVALANCHE!)</span>
      </div>

      <style jsx>{`
        .glacier-mountain-hero {
          position: relative;
          display: inline-block;
          cursor: pointer;
          user-select: none;
          padding: 10px 14px 16px;
          margin-bottom: 6px;
          transition: transform 0.25s ease;
        }

        .glacier-mountain-hero:hover {
          transform: translateY(-3px);
        }

        /* Tremor effect when avalanche triggers */
        .avalanche-active {
          animation: mountainTremor 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        /* ── Aurora Borealis Sky Ribbon ── */
        .aurora-sky-ribbon {
          position: absolute;
          top: -18px;
          left: -20px;
          right: -20px;
          height: 60px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(56, 189, 248, 0.2) 20%,
            rgba(52, 211, 153, 0.25) 45%,
            rgba(244, 114, 182, 0.2) 75%,
            transparent
          );
          filter: blur(14px);
          pointer-events: none;
          z-index: 1;
          animation: auroraGlow 7s ease-in-out infinite alternate;
        }

        /* ── Mountain Ridge Backdrop ── */
        .mountain-ridge-backdrop {
          position: absolute;
          inset: -14px -24px 0 -24px;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
          border-radius: 16px;
        }

        .ridge-svg {
          width: 100%;
          height: 100%;
          opacity: 0.65;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.9));
          transition: opacity 0.3s ease;
        }

        .valley-mist-band {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 45%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(241, 245, 249, 0.1) 25%,
            rgba(56, 189, 248, 0.12) 50%,
            rgba(241, 245, 249, 0.1) 75%,
            transparent
          );
          filter: blur(10px);
          animation: mistFloat 16s linear infinite;
        }

        /* ── Ambient Falling Snow ── */
        .ambient-snow-field {
          position: absolute;
          inset: -20px -15px 0 -15px;
          pointer-events: none;
          z-index: 4;
          overflow: hidden;
        }

        .snow-flake-particle {
          position: absolute;
          top: -20px;
          color: #ffffff;
          user-select: none;
          pointer-events: none;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 16px #38bdf8;
          animation: snowFallAnim linear infinite;
        }

        /* ── Avalanche Tumbling Debris ── */
        .avalanche-debris-layer {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 15;
        }

        .avalanche-chunk {
          position: absolute;
          font-size: 26px;
          animation: chunkTumble 1.1s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }

        /* ── Main Typography ── */
        .glacier-title {
          position: relative;
          z-index: 3;
          font-family: 'Anton', sans-serif;
          font-size: clamp(48px, 8vw, 100px);
          line-height: 0.92;
          margin: 0;
          letter-spacing: 0.03em;
        }

        .mountain-word {
          display: inline-flex;
          align-items: flex-end;
          gap: 2px;
        }

        .mountain-letter-box {
          position: relative;
          display: inline-block;
        }

        /* Letter Glyph - 3D Chiseled Mountain Texture */
        .letter-glyph {
          position: relative;
          display: block;
          color: transparent;
          user-select: none;
          transition: filter 0.3s ease;
        }

        /* PALU: Mountain Granite Summit with Glacier Ice */
        .glyph-palu {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #e0f2fe 18%,
            #7dd3fc 36%,
            #475569 62%,
            #1e293b 88%,
            #0f172a 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 20px rgba(56, 189, 248, 0.4));
        }

        /* VLOGS: Alpine Sunset Gold + Arctic Cyan Rim */
        .glyph-vlogs {
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #e0f2fe 15%,
            #38bdf8 34%,
            #f59e0b 60%,
            #d97706 82%,
            #78350f 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 25px rgba(255, 201, 60, 0.4));
        }

        /* Peak Letter ('A') - Pointed Mountain Crest */
        .peak-letter .glyph-palu {
          transform: translateY(-2px);
          filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 30px #ffffff);
        }

        /* ── Snow Crown (Resting along top of each letter) ── */
        .letter-snow-crown {
          position: absolute;
          top: -5px;
          left: 2px;
          right: 2px;
          height: 10px;
          pointer-events: none;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        .snow-puff {
          background: #ffffff;
          border-radius: 20px;
          height: 8px;
          box-shadow: 0 1px 3px rgba(255, 255, 255, 0.9), 0 2px 6px rgba(56, 189, 248, 0.5);
        }

        .puff-left {
          width: 25%;
          height: 6px;
          margin-right: -4px;
        }

        .puff-center {
          height: 9px;
          background: linear-gradient(180deg, #ffffff, #e2e8f0);
        }

        .puff-right {
          width: 25%;
          height: 7px;
          margin-left: -4px;
        }

        /* Avalanche slide-off animation */
        .snow-slide-off {
          animation: snowSlideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* ── Hanging Crystalline Icicles ── */
        .hanging-icicle {
          position: absolute;
          bottom: -8px;
          width: 4px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(56, 189, 248, 0.45));
          border-radius: 0 0 3px 3px;
          pointer-events: none;
          z-index: 4;
          box-shadow: 0 2px 6px rgba(56, 189, 248, 0.6);
        }

        .icicle-drip {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          background: #38bdf8;
          border-radius: 50%;
          opacity: 0.8;
          animation: waterDrop 3.5s ease-in-out infinite;
        }

        /* ── Mountain Altitude Badge ── */
        .mountain-altitude-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 5px 14px;
          background: rgba(15, 23, 42, 0.85);
          border: 1.5px solid rgba(56, 189, 248, 0.45);
          border-radius: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), 0 0 16px rgba(56, 189, 248, 0.3);
          transition: all 0.3s ease;
        }

        .altitude-pulse {
          font-size: 14px;
          animation: pulseIcon 1.8s ease-in-out infinite;
        }

        .altitude-text {
          font-family: 'Anton', sans-serif;
          font-size: 11.5px;
          letter-spacing: 0.1em;
          color: #7dd3fc;
        }

        .altitude-tap-hint {
          font-family: 'Anton', sans-serif;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #ffc93c;
        }

        .avalanche-active .mountain-altitude-badge {
          background: rgba(56, 189, 248, 0.3);
          border-color: #38bdf8;
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.8);
        }

        /* ── Keyframe Animations ── */
        @keyframes mountainTremor {
          10%, 90% { transform: translate3d(-2px, 1px, 0); }
          20%, 80% { transform: translate3d(3px, -2px, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 2px, 0); }
          40%, 60% { transform: translate3d(3px, -1px, 0); }
        }

        @keyframes snowSlideDown {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          40% {
            transform: translateY(18px) scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(45px) scale(0.6);
            opacity: 0;
          }
        }

        @keyframes chunkTumble {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.4) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(var(--scale)) rotate(var(--rot));
          }
        }

        @keyframes snowFallAnim {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(140px) translateX(var(--drift-val, 15px)) rotate(180deg);
          }
          100% {
            transform: translateY(280px) translateX(0) rotate(360deg);
          }
        }

        @keyframes auroraGlow {
          0% { opacity: 0.3; transform: scaleX(0.9); }
          100% { opacity: 0.8; transform: scaleX(1.1); }
        }

        @keyframes mistFloat {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes waterDrop {
          0%, 80% { transform: translate(-50%, 0) scale(0.8); opacity: 0.8; }
          90% { transform: translate(-50%, 14px) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, 24px) scale(0.2); opacity: 0; }
        }

        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}
