'use client';

import React, { useState, useRef } from 'react';

/**
 * Cartoon Sound Synthesis for 5 Distinct Animation Styles
 * Uses pure Web Audio API with zero external audio assets.
 */
const getAudioContext = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
};

// 1. Audio: Chaos Smash & Blast
const playSmashBlastAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Revving buzz (0 - 0.5s)
  const vibOsc = ctx.createOscillator();
  const vibGain = ctx.createGain();
  vibOsc.type = 'sawtooth';
  vibOsc.frequency.setValueAtTime(90, now);
  vibOsc.frequency.linearRampToValueAtTime(360, now + 0.48);
  vibGain.gain.setValueAtTime(0.18, now);
  vibGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  vibOsc.connect(vibGain);
  vibGain.connect(ctx.destination);
  vibOsc.start(now);
  vibOsc.stop(now + 0.5);

  // Left thud (0.7s)
  const smash1Osc = ctx.createOscillator();
  const smash1Gain = ctx.createGain();
  smash1Osc.type = 'triangle';
  smash1Osc.frequency.setValueAtTime(240, now + 0.7);
  smash1Osc.frequency.exponentialRampToValueAtTime(45, now + 0.9);
  smash1Gain.gain.setValueAtTime(0.3, now + 0.7);
  smash1Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.92);
  smash1Osc.connect(smash1Gain);
  smash1Gain.connect(ctx.destination);
  smash1Osc.start(now + 0.7);
  smash1Osc.stop(now + 0.92);

  // Right thud (1.15s)
  const smash2Osc = ctx.createOscillator();
  const smash2Gain = ctx.createGain();
  smash2Osc.type = 'triangle';
  smash2Osc.frequency.setValueAtTime(280, now + 1.15);
  smash2Osc.frequency.exponentialRampToValueAtTime(50, now + 1.35);
  smash2Gain.gain.setValueAtTime(0.32, now + 1.15);
  smash2Gain.gain.exponentialRampToValueAtTime(0.01, now + 1.38);
  smash2Osc.connect(smash2Gain);
  smash2Gain.connect(ctx.destination);
  smash2Osc.start(now + 1.15);
  smash2Osc.stop(now + 1.38);

  // Fall Whistle (1.4s)
  const fallOsc = ctx.createOscillator();
  const fallGain = ctx.createGain();
  fallOsc.type = 'sine';
  fallOsc.frequency.setValueAtTime(800, now + 1.4);
  fallOsc.frequency.exponentialRampToValueAtTime(95, now + 1.8);
  fallGain.gain.setValueAtTime(0.18, now + 1.4);
  fallGain.gain.exponentialRampToValueAtTime(0.01, now + 1.82);
  fallOsc.connect(fallGain);
  fallGain.connect(ctx.destination);
  fallOsc.start(now + 1.4);
  fallOsc.stop(now + 1.82);

  // Ground Explosion Blast (1.88s)
  const bufferSize = Math.floor(ctx.sampleRate * 0.65);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(900, now + 1.88);
  filter.frequency.exponentialRampToValueAtTime(40, now + 2.5);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.4, now + 1.88);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
  whiteNoise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  whiteNoise.start(now + 1.88);
  whiteNoise.stop(now + 2.5);

  // Spring boing return (2.7s)
  const boingOsc = ctx.createOscillator();
  const boingGain = ctx.createGain();
  boingOsc.type = 'sine';
  boingOsc.frequency.setValueAtTime(220, now + 2.7);
  boingOsc.frequency.exponentialRampToValueAtTime(640, now + 2.95);
  boingGain.gain.setValueAtTime(0.22, now + 2.7);
  boingGain.gain.exponentialRampToValueAtTime(0.01, now + 3.1);
  boingOsc.connect(boingGain);
  boingGain.connect(ctx.destination);
  boingOsc.start(now + 2.7);
  boingOsc.stop(now + 3.1);
};

// 2. Audio: Rocket Launch & Meteor Crash
const playRocketAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Thruster ignition hiss (0 - 0.6s)
  const bufferSize = Math.floor(ctx.sampleRate * 0.7);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const out = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(250, now);
  filter.frequency.linearRampToValueAtTime(1400, now + 0.6);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.25, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.65);

  // Rocket zoom-up whistle (0.4s - 0.9s)
  const upOsc = ctx.createOscillator();
  const upGain = ctx.createGain();
  upOsc.type = 'sawtooth';
  upOsc.frequency.setValueAtTime(150, now + 0.4);
  upOsc.frequency.exponentialRampToValueAtTime(1800, now + 0.9);
  upGain.gain.setValueAtTime(0.28, now + 0.4);
  upGain.gain.exponentialRampToValueAtTime(0.01, now + 0.92);
  upOsc.connect(upGain);
  upGain.connect(ctx.destination);
  upOsc.start(now + 0.4);
  upOsc.stop(now + 0.92);

  // Meteor falling siren (1.4s - 1.9s)
  const fallOsc = ctx.createOscillator();
  const fallGain = ctx.createGain();
  fallOsc.type = 'sine';
  fallOsc.frequency.setValueAtTime(1200, now + 1.4);
  fallOsc.frequency.exponentialRampToValueAtTime(120, now + 1.9);
  fallGain.gain.setValueAtTime(0.3, now + 1.4);
  fallGain.gain.exponentialRampToValueAtTime(0.01, now + 1.92);
  fallOsc.connect(fallGain);
  fallGain.connect(ctx.destination);
  fallOsc.start(now + 1.4);
  fallOsc.stop(now + 1.92);

  // Meteor ground slam impact (1.92s)
  const slamOsc = ctx.createOscillator();
  const slamGain = ctx.createGain();
  slamOsc.type = 'triangle';
  slamOsc.frequency.setValueAtTime(160, now + 1.92);
  slamOsc.frequency.exponentialRampToValueAtTime(28, now + 2.5);
  slamGain.gain.setValueAtTime(0.45, now + 1.92);
  slamGain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
  slamOsc.connect(slamGain);
  slamGain.connect(ctx.destination);
  slamOsc.start(now + 1.92);
  slamOsc.stop(now + 2.5);
};

// 3. Audio: Pinball Bumper Frenzy
const playPinballAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // 4 rapid bumper bounce chimes
  const notes = [
    { time: 0.25, freq: 523.25 }, // C5
    { time: 0.65, freq: 659.25 }, // E5
    { time: 1.05, freq: 783.99 }, // G5
    { time: 1.45, freq: 1046.50 }, // C6
  ];

  notes.forEach(({ time, freq }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + time);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + time + 0.18);
    gain.gain.setValueAtTime(0.35, now + time);
    gain.gain.exponentialRampToValueAtTime(0.01, now + time + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + 0.22);
  });

  // Dizzy wobble slide (1.8s - 2.5s)
  const dizzyOsc = ctx.createOscillator();
  const dizzyGain = ctx.createGain();
  dizzyOsc.type = 'sine';
  dizzyOsc.frequency.setValueAtTime(440, now + 1.8);
  dizzyOsc.frequency.linearRampToValueAtTime(560, now + 2.0);
  dizzyOsc.frequency.linearRampToValueAtTime(320, now + 2.3);
  dizzyOsc.frequency.linearRampToValueAtTime(600, now + 2.6);
  dizzyGain.gain.setValueAtTime(0.18, now + 1.8);
  dizzyGain.gain.exponentialRampToValueAtTime(0.01, now + 2.65);
  dizzyOsc.connect(dizzyGain);
  dizzyGain.connect(ctx.destination);
  dizzyOsc.start(now + 1.8);
  dizzyOsc.stop(now + 2.65);
};

// 4. Audio: Cosmic Black Hole Vortex
const playVortexAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Sucking vortex pitch drop (0 - 1.2s)
  const vortOsc = ctx.createOscillator();
  const vortGain = ctx.createGain();
  vortOsc.type = 'sawtooth';
  vortOsc.frequency.setValueAtTime(700, now);
  vortOsc.frequency.exponentialRampToValueAtTime(35, now + 1.2);
  vortGain.gain.setValueAtTime(0.24, now);
  vortGain.gain.exponentialRampToValueAtTime(0.01, now + 1.25);
  vortOsc.connect(vortGain);
  vortGain.connect(ctx.destination);
  vortOsc.start(now);
  vortOsc.stop(now + 1.25);

  // Supernova celestial chord burst (1.8s)
  const chordFreqs = [523.25, 659.25, 783.99, 1046.5];
  chordFreqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + 1.8);
    gain.gain.setValueAtTime(0.18, now + 1.8);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 1.8);
    osc.stop(now + 2.6);
  });
};

// 5. Audio: Disco Party Dance Wave
const playDiscoAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Funky synth groove arpeggio (0.1s, 0.4s, 0.7s, 1.0s, 1.3s)
  const groove = [
    { time: 0.1, freq: 261.63 }, // C4
    { time: 0.4, freq: 329.63 }, // E4
    { time: 0.7, freq: 392.00 }, // G4
    { time: 1.0, freq: 523.25 }, // C5
    { time: 1.3, freq: 659.25 }, // E5
  ];

  groove.forEach(({ time, freq }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now + time);
    gain.gain.setValueAtTime(0.2, now + time);
    gain.gain.exponentialRampToValueAtTime(0.01, now + time + 0.24);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + 0.24);
  });

  // Triumphant Brass Chime Finale (1.7s)
  const finale = [523.25, 659.25, 783.99, 1046.5];
  finale.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + 1.7);
    gain.gain.setValueAtTime(0.22, now + 1.7);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 1.7);
    osc.stop(now + 2.7);
  });
};

// 5 Distinct Animation Profiles
const ANIMATION_STYLES = [
  {
    id: 'smashBlast',
    name: 'Chaos Smash & Blast',
    toast: 'SQUAD BLAST! 💥🤣',
    className: 'dp-anim-smash-blast',
    duration: 3300,
    emojis: ['💥', '🔥', '🍉', '⚡', '✨', '⭐', '🎉', '💨', '🍗', '🥒', '🧅', '🎃'],
    soundFn: playSmashBlastAudio
  },
  {
    id: 'rocketLaunch',
    name: 'Rocket Launch & Meteor',
    toast: 'ROCKET LAUNCH! 🚀☄️',
    className: 'dp-anim-rocket',
    duration: 3200,
    emojis: ['🚀', '🔥', '☄️', '💨', '✨', '⚡', '🍉', '💥', '⭐', '💫'],
    soundFn: playRocketAudio
  },
  {
    id: 'pinball',
    name: 'Pinball Bumper Frenzy',
    toast: 'PINBALL FRENZY! ⚡🎯',
    className: 'dp-anim-pinball',
    duration: 3100,
    emojis: ['⚡', '🎯', '✨', '🌟', '💫', '🌀', '🍉', '🔔', '💥', '🎉'],
    soundFn: playPinballAudio
  },
  {
    id: 'vortex',
    name: 'Black Hole Vortex',
    toast: 'COSMIC VORTEX! 🌀🌌',
    className: 'dp-anim-vortex',
    duration: 3200,
    emojis: ['🌀', '🌌', '🪐', '🛸', '✨', '🌟', '🔮', '🍉', '☄️', '💫'],
    soundFn: playVortexAudio
  },
  {
    id: 'discoFunk',
    name: 'Disco Party Groove',
    toast: 'PARTY TIME! 🪩🕺',
    className: 'dp-anim-disco',
    duration: 3200,
    emojis: ['🪩', '🕺', '🎉', '🍉', '🕶️', '🎵', '⭐', '✨', '🌴', '💃'],
    soundFn: playDiscoAudio
  }
];

export default function HeroSquadDP({ profileImage, coverImage, fallback }) {
  const [activeAnim, setActiveAnim] = useState(null); // active animation object
  const [particles, setParticles] = useState([]);
  const [wallImpact, setWallImpact] = useState(null); // 'left' | 'right' | null
  const [comicToast, setComicToast] = useState('');

  const lastStyleIdxRef = useRef(-1);
  const animTimerRef = useRef(null);

  const handleTap = () => {
    if (activeAnim) return; // Prevent double tap during active animation

    // Pick random style without repeating the immediate previous one
    let nextIdx = Math.floor(Math.random() * ANIMATION_STYLES.length);
    if (nextIdx === lastStyleIdxRef.current) {
      nextIdx = (nextIdx + 1) % ANIMATION_STYLES.length;
    }
    lastStyleIdxRef.current = nextIdx;
    const style = ANIMATION_STYLES[nextIdx];

    setActiveAnim(style);
    setComicToast('');

    // Trigger unique synthesized audio
    style.soundFn();

    // Custom Choreography per style:
    if (style.id === 'smashBlast') {
      // Wall impacts
      setTimeout(() => {
        setWallImpact('left');
        setTimeout(() => setWallImpact(null), 350);
      }, 700);

      setTimeout(() => {
        setWallImpact('right');
        setTimeout(() => setWallImpact(null), 350);
      }, 1150);

      // Radial blast explosion particles
      setTimeout(() => {
        spawnParticles(style.emojis, 24, 120, 160);
        setComicToast(style.toast);
      }, 1900);
    } else if (style.id === 'rocketLaunch') {
      // Smoke trail when shooting up
      setTimeout(() => {
        spawnParticles(['💨', '🔥', '✨'], 14, 40, 80);
      }, 350);

      // Meteor slam explosion
      setTimeout(() => {
        spawnParticles(style.emojis, 22, 110, 180);
        setComicToast(style.toast);
      }, 1900);
    } else if (style.id === 'pinball') {
      // 4 bumper flashes
      [250, 650, 1050, 1450].forEach((t, i) => {
        setTimeout(() => {
          setWallImpact(i % 2 === 0 ? 'left' : 'right');
          setTimeout(() => setWallImpact(null), 250);
        }, t);
      });

      setTimeout(() => {
        spawnParticles(style.emojis, 20, 90, 150);
        setComicToast(style.toast);
      }, 1700);
    } else if (style.id === 'vortex') {
      // Vortex singularity suction particles
      setTimeout(() => {
        spawnParticles(['🌀', '✨', '💫'], 12, 50, 90);
      }, 400);

      // Supernova explosion burst
      setTimeout(() => {
        spawnParticles(style.emojis, 26, 130, 200);
        setComicToast(style.toast);
      }, 1800);
    } else if (style.id === 'discoFunk') {
      // Disco confetti rain
      setTimeout(() => {
        spawnParticles(style.emojis, 26, 120, 180);
        setComicToast(style.toast);
      }, 1400);
    }

    // Reset particles
    setTimeout(() => {
      setParticles([]);
    }, style.duration - 400);

    // End animation & clean up
    animTimerRef.current = setTimeout(() => {
      setActiveAnim(null);
      setTimeout(() => setComicToast(''), 2000);
    }, style.duration);
  };

  const spawnParticles = (emojiList, count, minDist, maxDist) => {
    const list = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
      const dist = minDist + Math.random() * (maxDist - minDist);
      return {
        id: `${Date.now()}_${i}`,
        emoji: emojiList[i % emojiList.length],
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 25,
        rot: Math.random() * 720 - 360,
        scale: 0.8 + Math.random() * 0.9
      };
    });
    setParticles(list);
  };

  const imageSrc = coverImage || profileImage || fallback || '/assets/images/hero_team.jpg';

  return (
    <div className="hero-dp-interactive-container">
      {/* Comic Toast */}
      {comicToast && (
        <div className="dp-comic-toast" role="status">
          {comicToast}
        </div>
      )}

      {/* Wall Impact Flashes (Left & Right) */}
      {wallImpact === 'left' && (
        <div className="dp-wall-impact dp-wall-left">
          <span>💥</span>
          <div className="dp-shockwave"></div>
        </div>
      )}
      {wallImpact === 'right' && (
        <div className="dp-wall-impact dp-wall-right">
          <span>💥</span>
          <div className="dp-shockwave"></div>
        </div>
      )}

      {/* Idle Tap Me Hint Badge */}
      {!activeAnim && (
        <div className="dp-tap-hint" onClick={handleTap}>
          <span>TAP ME! 💥</span>
        </div>
      )}

      {/* Main Squad DP Badge */}
      <div
        className={`hero-badge-wrap ${activeAnim ? activeAnim.className : ''}`}
        onClick={handleTap}
        onTouchStart={handleTap}
        title="Tap Squad DP for 5 Crazy Animations! 💥"
      >
        <img
          src={imageSrc}
          alt="Palu Vlogs Squad DP"
          className="hero-badge"
          draggable="false"
        />
      </div>

      {/* Dynamic Blast/Confetti Particle Layer */}
      {particles.length > 0 && (
        <div className="dp-blast-particles-layer" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="dp-blast-item"
              style={{
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                '--rot': `${p.rot}deg`,
                '--scale': p.scale
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      <style jsx>{`
        .hero-dp-interactive-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          cursor: pointer;
        }

        .dp-tap-hint {
          position: absolute;
          top: -12px;
          right: 12px;
          background: #ff4757;
          color: #ffffff;
          font-family: 'Anton', sans-serif;
          font-size: 11px;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 20px;
          border: 1.5px solid #ffffff;
          box-shadow: 0 4px 12px rgba(255, 71, 87, 0.5);
          z-index: 30;
          pointer-events: none;
          animation: hintBounce 1.8s ease-in-out infinite;
        }

        .dp-comic-toast {
          position: absolute;
          top: -42px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ff4757, #ffa502);
          color: #ffffff;
          font-family: 'Anton', sans-serif;
          font-size: 17px;
          letter-spacing: 0.08em;
          padding: 6px 18px;
          border-radius: 24px;
          border: 2px solid #ffffff;
          box-shadow: 0 8px 24px rgba(255, 71, 87, 0.7);
          z-index: 40;
          white-space: nowrap;
          animation: toastPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Impact Shockwaves */
        .dp-wall-impact {
          position: absolute;
          top: 45%;
          transform: translateY(-50%);
          font-size: 38px;
          z-index: 35;
          pointer-events: none;
          animation: wallImpactPop 0.35s ease-out forwards;
        }
        .dp-wall-left { left: -42px; }
        .dp-wall-right { right: -42px; }

        .dp-shockwave {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50px;
          height: 50px;
          border: 3px solid #ff4757;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: shockExpand 0.35s ease-out forwards;
        }

        /* Blast Particle Layer */
        .dp-blast-particles-layer {
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 60;
        }
        .dp-blast-item {
          position: absolute;
          font-size: 26px;
          animation: blastFly 0.85s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        /* ═══════════════════════════════════════════════════
           ANIMATION STYLE 1: CHAOS SMASH & BLAST
           ═══════════════════════════════════════════════════ */
        :global(.hero-badge-wrap.dp-anim-smash-blast) {
          animation: dpChaosSmashBlast 3.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
          z-index: 50;
        }
        @keyframes dpChaosSmashBlast {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          3% { transform: translate(-8px, 6px) rotate(-8deg) scale(1.05); }
          6% { transform: translate(7px, -7px) rotate(10deg) scale(0.98); }
          9% { transform: translate(-9px, -5px) rotate(-12deg) scale(1.08); }
          12% { transform: translate(8px, 7px) rotate(15deg) scale(1.02); }
          15% {
            transform: translate(-10px, 4px) rotate(720deg) scale(1.12);
            filter: drop-shadow(0 0 35px #ff4757) brightness(1.2);
          }
          22% {
            transform: translate(min(-230px, -36vw), -15px) rotate(1080deg) scale(0.68, 1.32);
            filter: drop-shadow(-15px 0 25px #ff4757) brightness(1.4);
          }
          28% {
            transform: translate(min(-140px, -22vw), 0px) rotate(1300deg) scale(1.15, 0.9);
          }
          35% {
            transform: translate(max(230px, 36vw), 10px) rotate(1800deg) scale(0.68, 1.32);
            filter: drop-shadow(15px 0 25px #ffa502) brightness(1.4);
          }
          42% {
            transform: translate(max(130px, 18vw), -10px) rotate(2020deg) scale(1.12, 0.92);
          }
          46% { transform: translate(0px, 20px) rotate(2200deg) scale(0.9, 1.25); }
          55% {
            transform: translate(0px, min(300px, 42vh)) rotate(2520deg) scale(1.45, 0.55);
            filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.9)) brightness(1.3);
          }
          58% {
            transform: translate(0px, min(300px, 42vh)) rotate(2600deg) scale(1.8);
            filter: brightness(2.5) drop-shadow(0 0 60px #ff3838);
            opacity: 1;
          }
          66% {
            transform: translate(0px, min(300px, 42vh)) rotate(2700deg) scale(2.3);
            filter: brightness(3) drop-shadow(0 0 90px #ffa502);
            opacity: 0.15;
          }
          72% { transform: translate(0px, min(300px, 42vh)) scale(0); opacity: 0; }
          84% { transform: translate(0px, -180px) rotate(0deg) scale(0.2); opacity: 0; }
          88% {
            transform: translate(0px, 15px) rotate(-6deg) scale(1.22, 0.88);
            opacity: 1;
            filter: drop-shadow(0 0 35px var(--gold-glow));
          }
          94% { transform: translate(0px, -8px) rotate(3deg) scale(0.95, 1.05); opacity: 1; }
          100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
            opacity: 1;
            filter: drop-shadow(0 20px 60px rgba(0,0,0,.8));
          }
        }

        /* ═══════════════════════════════════════════════════
           ANIMATION STYLE 2: ROCKET LAUNCH & METEOR CRASH
           ═══════════════════════════════════════════════════ */
        :global(.hero-badge-wrap.dp-anim-rocket) {
          animation: dpRocketMeteor 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
          z-index: 50;
        }
        @keyframes dpRocketMeteor {
          0% { transform: translate(0, 0) scale(1); }
          4% { transform: translate(-4px, 2px) scale(0.96, 1.04); }
          8% { transform: translate(5px, -3px) scale(1.05, 0.95); }
          12% {
            transform: translate(0, 10px) scale(1.15, 0.85);
            filter: drop-shadow(0 20px 30px #ff4757) brightness(1.3);
          }
          /* Rocket Shoot Up into outer space */
          20% {
            transform: translate(0, -90vh) rotate(360deg) scale(0.4, 1.8);
            opacity: 0.9;
          }
          26% {
            transform: translate(0, -120vh) rotate(720deg) scale(0.1);
            opacity: 0;
          }
          /* Pause in space */
          42% {
            transform: translate(0, -120vh) rotate(1080deg) scale(0.1);
            opacity: 0;
          }
          /* Meteor Falling Down with fire trail */
          46% {
            transform: translate(0, -50vh) rotate(1440deg) scale(0.8, 1.4);
            opacity: 1;
            filter: drop-shadow(0 -30px 40px #ff3838) brightness(1.8);
          }
          58% {
            transform: translate(0, min(260px, 36vh)) rotate(1800deg) scale(1.5, 0.5);
            filter: drop-shadow(0 20px 40px #ff9f1a) brightness(2.2);
          }
          /* Ground Crash Shock */
          65% {
            transform: translate(0, min(230px, 32vh)) rotate(1800deg) scale(1.2, 0.8);
          }
          74% {
            transform: translate(0, min(140px, 20vh)) rotate(1790deg) scale(0.9, 1.15);
          }
          88% {
            transform: translate(0, -15px) rotate(1805deg) scale(1.1, 0.92);
          }
          95% { transform: translate(0, 5px) rotate(1800deg) scale(0.98, 1.02); }
          100% {
            transform: translate(0, 0) rotate(1800deg) scale(1);
            filter: drop-shadow(0 20px 60px rgba(0,0,0,.8));
          }
        }

        /* ═══════════════════════════════════════════════════
           ANIMATION STYLE 3: PINBALL BUMPER FRENZY
           ═══════════════════════════════════════════════════ */
        :global(.hero-badge-wrap.dp-anim-pinball) {
          animation: dpPinballFrenzy 3.1s cubic-bezier(0.1, 0.9, 0.2, 1) forwards !important;
          z-index: 50;
        }
        @keyframes dpPinballFrenzy {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          /* Bumper 1: Top-Left */
          8% {
            transform: translate(min(-200px, -30vw), -90px) rotate(-360deg) scale(0.7, 1.3);
            filter: drop-shadow(-15px -10px 25px #00d2d3) brightness(1.3);
          }
          /* Bumper 2: Bottom-Right */
          20% {
            transform: translate(max(200px, 30vw), 90px) rotate(720deg) scale(1.3, 0.7);
            filter: drop-shadow(15px 10px 25px #ff9f43) brightness(1.3);
          }
          /* Bumper 3: Top-Right */
          34% {
            transform: translate(max(180px, 28vw), -80px) rotate(1440deg) scale(0.75, 1.25);
            filter: drop-shadow(15px -10px 25px #ff4757) brightness(1.4);
          }
          /* Bumper 4: Bottom-Left */
          48% {
            transform: translate(min(-190px, -28vw), 80px) rotate(2160deg) scale(1.25, 0.75);
            filter: drop-shadow(-15px 10px 25px #5f27cd) brightness(1.3);
          }
          /* Dizzy wobble in center */
          60% {
            transform: translate(0, 0) rotate(2520deg) scale(1.25, 0.85);
            filter: drop-shadow(0 0 35px var(--gold-glow));
          }
          70% { transform: translate(-12px, -6px) rotate(2540deg) scale(0.85, 1.2); }
          80% { transform: translate(10px, 6px) rotate(2500deg) scale(1.15, 0.9); }
          90% { transform: translate(-4px, 2px) rotate(2525deg) scale(0.96, 1.04); }
          100% {
            transform: translate(0, 0) rotate(2520deg) scale(1);
            filter: drop-shadow(0 20px 60px rgba(0,0,0,.8));
          }
        }

        /* ═══════════════════════════════════════════════════
           ANIMATION STYLE 4: COSMIC BLACK HOLE VORTEX
           ═══════════════════════════════════════════════════ */
        :global(.hero-badge-wrap.dp-anim-vortex) {
          animation: dpCosmicVortex 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
          z-index: 50;
        }
        @keyframes dpCosmicVortex {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          10% {
            transform: translate(0, 0) rotate(360deg) scale(1.25);
            filter: drop-shadow(0 0 45px #341f97) brightness(1.5);
          }
          /* Suction into singularity */
          25% {
            transform: translate(0, 0) rotate(1440deg) scale(0.5);
            filter: drop-shadow(0 0 55px #5f27cd) brightness(2);
          }
          38% {
            transform: translate(0, 0) rotate(2880deg) scale(0.02);
            opacity: 0.3;
          }
          44% {
            transform: translate(0, 0) rotate(3600deg) scale(0);
            opacity: 0;
          }
          /* Vacuum silence */
          54% {
            transform: translate(0, 0) rotate(3600deg) scale(0);
            opacity: 0;
          }
          /* Supernova burst out */
          58% {
            transform: translate(0, 0) rotate(3600deg) scale(2.4);
            opacity: 1;
            filter: drop-shadow(0 0 90px #00d2d3) brightness(3);
          }
          72% {
            transform: translate(0, 0) rotate(3720deg) scale(0.85);
            filter: drop-shadow(0 0 50px #54a0ff) brightness(1.6);
          }
          85% { transform: translate(0, 0) rotate(3580deg) scale(1.12); }
          94% { transform: translate(0, 0) rotate(3605deg) scale(0.96); }
          100% {
            transform: translate(0, 0) rotate(3600deg) scale(1);
            opacity: 1;
            filter: drop-shadow(0 20px 60px rgba(0,0,0,.8));
          }
        }

        /* ═══════════════════════════════════════════════════
           ANIMATION STYLE 5: DISCO FUNK PARTY GROOVE
           ═══════════════════════════════════════════════════ */
        :global(.hero-badge-wrap.dp-anim-disco) {
          animation: dpDiscoFunk 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
          z-index: 50;
        }
        @keyframes dpDiscoFunk {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          /* Funky beat bounces */
          6% {
            transform: translate(-18px, -15px) rotate(-14deg) scale(1.15, 0.85);
            filter: drop-shadow(0 0 35px #ff4757) brightness(1.2);
          }
          14% {
            transform: translate(20px, 12px) rotate(16deg) scale(0.88, 1.18);
            filter: drop-shadow(0 0 35px #10ac84) brightness(1.3);
          }
          22% {
            transform: translate(-22px, 10px) rotate(-18deg) scale(1.2, 0.8);
            filter: drop-shadow(0 0 35px #ff9f43) brightness(1.3);
          }
          30% {
            transform: translate(18px, -14px) rotate(14deg) scale(0.85, 1.22);
            filter: drop-shadow(0 0 35px #0abde3) brightness(1.4);
          }
          /* 3D Coin Flip Spin */
          44% {
            transform: translate(0, -30px) rotateY(540deg) scale(1.3);
            filter: drop-shadow(0 0 50px #ee5253) brightness(1.6);
          }
          56% {
            transform: translate(0, 0) rotateY(1080deg) scale(0.9, 1.25);
            filter: drop-shadow(0 0 60px #feca57) brightness(1.5);
          }
          /* Victory Rubber Hose Pose */
          70% {
            transform: translate(0, 20px) scale(1.4, 0.7);
            filter: drop-shadow(0 0 45px #ff6b6b);
          }
          82% {
            transform: translate(0, -12px) scale(0.92, 1.12);
          }
          92% { transform: translate(0, 4px) scale(1.04, 0.97); }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            filter: drop-shadow(0 20px 60px rgba(0,0,0,.8));
          }
        }

        /* Utility Keyframes */
        @keyframes blastFly {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.4) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(var(--scale)) rotate(var(--rot));
          }
        }

        @keyframes wallImpactPop {
          0% { transform: translateY(-50%) scale(0.2); opacity: 0; }
          40% { transform: translateY(-50%) scale(1.4); opacity: 1; }
          100% { transform: translateY(-50%) scale(1); opacity: 0; }
        }

        @keyframes shockExpand {
          0% { width: 10px; height: 10px; opacity: 1; }
          100% { width: 90px; height: 90px; opacity: 0; }
        }

        @keyframes hintBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes toastPop {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
