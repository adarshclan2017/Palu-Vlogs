'use client';

import React, { useState, useRef } from 'react';

/**
 * Cartoon Sound Synthesis for Squad DP Smash & Blast Animation
 * Uses pure Web Audio API with zero external assets.
 */
const playSmashBlastAudio = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // 1. Vibration / Engine Rev (0s - 0.5s)
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

    // 2. Smash Left Impact (at 0.7s)
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

    // 3. Smash Right Impact (at 1.15s)
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

    // 4. Whistle Fall Down (1.4s - 1.8s)
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

    // 5. Ground Slam & Explosion Blast (at 1.88s)
    const bufferSize = Math.floor(ctx.sampleRate * 0.65);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
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

    // Low boom bass shock
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(140, now + 1.88);
    boomOsc.frequency.exponentialRampToValueAtTime(25, now + 2.5);
    boomGain.gain.setValueAtTime(0.45, now + 1.88);
    boomGain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(now + 1.88);
    boomOsc.stop(now + 2.5);

    // 6. Return Spring "Boing!" (at 2.7s)
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
  } catch {
    // Graceful fallback
  }
};

const BLAST_EMOJIS = ['💥', '🔥', '🍉', '⚡', '✨', '⭐', '🎉', '💨', '🍗', '🥒', '🧅', '🎃'];

/**
 * Interactive Hero Squad DP with Crazy Tap Animation:
 * Vibrates furiously -> Spins ultra fast -> Smashes Left & Right walls -> Falls down -> BLASTS into particles -> Bounces back restored!
 */
export default function HeroSquadDP({ profileImage, coverImage, fallback }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);
  const [leftSmash, setLeftSmash] = useState(false);
  const [rightSmash, setRightSmash] = useState(false);
  const [comicToast, setComicToast] = useState('');

  const animTimerRef = useRef(null);

  const handleTap = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setComicToast('');

    // Play cartoon audio sequence
    playSmashBlastAudio();

    // 1. Smash Left trigger (at ~700ms)
    setTimeout(() => {
      setLeftSmash(true);
      setTimeout(() => setLeftSmash(false), 350);
    }, 700);

    // 2. Smash Right trigger (at ~1150ms)
    setTimeout(() => {
      setRightSmash(true);
      setTimeout(() => setRightSmash(false), 350);
    }, 1150);

    // 3. Blast Particles trigger (at ~1900ms)
    setTimeout(() => {
      const newParticles = Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
        const dist = 110 + Math.random() * 160;
        return {
          id: i,
          emoji: BLAST_EMOJIS[i % BLAST_EMOJIS.length],
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 30,
          rot: Math.random() * 720 - 360,
          scale: 0.8 + Math.random() * 0.9
        };
      });
      setParticles(newParticles);
      setComicToast('SQUAD BLAST! 💥🤣');
    }, 1900);

    // Clear particles after blast
    setTimeout(() => {
      setParticles([]);
    }, 2800);

    // 4. Return & Reset animation state
    animTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => setComicToast(''), 2200);
    }, 3300);
  };

  const imageSrc = profileImage || coverImage || fallback;

  return (
    <div className="hero-dp-interactive-container">
      {/* Comic Toast */}
      {comicToast && (
        <div className="dp-comic-toast" role="status">
          {comicToast}
        </div>
      )}

      {/* Left Wall Impact Flash */}
      {leftSmash && (
        <div className="dp-wall-impact dp-wall-left">
          <span>💥</span>
          <div className="dp-shockwave"></div>
        </div>
      )}

      {/* Right Wall Impact Flash */}
      {rightSmash && (
        <div className="dp-wall-impact dp-wall-right">
          <span>💥</span>
          <div className="dp-shockwave"></div>
        </div>
      )}

      {/* Tap Me Hint Badge (Visible when idle) */}
      {!isAnimating && (
        <div className="dp-tap-hint" onClick={handleTap}>
          <span>TAP ME! 💥</span>
        </div>
      )}

      {/* Main Squad DP Badge */}
      <div
        className={`hero-badge-wrap ${isAnimating ? 'dp-chaos-smash' : ''}`}
        onClick={handleTap}
        onTouchStart={handleTap}
        title="Tap Squad DP for Crazy Smash & Blast! 💥"
      >
        <img
          src={imageSrc}
          alt="Palu Vlogs Squad DP"
          className="hero-badge"
          draggable="false"
        />
      </div>

      {/* Blast Particles Layer */}
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
          top: -38px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ff4757, #ffa502);
          color: #ffffff;
          font-family: 'Anton', sans-serif;
          font-size: 17px;
          letter-spacing: 0.08em;
          padding: 6px 16px;
          border-radius: 24px;
          border: 2px solid #ffffff;
          box-shadow: 0 8px 24px rgba(255, 71, 87, 0.7);
          z-index: 40;
          white-space: nowrap;
          animation: toastPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Full Crazy Smash & Blast Animation Sequence */
        :global(.hero-badge-wrap.dp-chaos-smash) {
          animation: dpChaosSmashBlast 3.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
          z-index: 50;
        }

        /* Impact Shockwaves on Walls */
        .dp-wall-impact {
          position: absolute;
          top: 45%;
          transform: translateY(-50%);
          font-size: 38px;
          z-index: 35;
          pointer-events: none;
          animation: wallImpactPop 0.35s ease-out forwards;
        }
        .dp-wall-left {
          left: -40px;
        }
        .dp-wall-right {
          right: -40px;
        }

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
          top: 60%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 60;
        }

        .dp-blast-item {
          position: absolute;
          font-size: 24px;
          animation: blastFly 0.85s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes dpChaosSmashBlast {
          /* 0% - 15%: Vibrate violently & spin fast */
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          3% { transform: translate(-8px, 6px) rotate(-8deg) scale(1.05); }
          6% { transform: translate(7px, -7px) rotate(10deg) scale(0.98); }
          9% { transform: translate(-9px, -5px) rotate(-12deg) scale(1.08); }
          12% { transform: translate(8px, 7px) rotate(15deg) scale(1.02); }
          15% {
            transform: translate(-10px, 4px) rotate(720deg) scale(1.12);
            filter: drop-shadow(0 0 35px #ff4757) brightness(1.2);
          }

          /* 16% - 28%: SMASH LEFT into wall! */
          22% {
            transform: translate(min(-220px, -36vw), -15px) rotate(1080deg) scale(0.68, 1.32);
            filter: drop-shadow(-15px 0 25px #ff4757) brightness(1.4);
          }
          28% {
            transform: translate(min(-140px, -22vw), 0px) rotate(1300deg) scale(1.15, 0.9);
          }

          /* 29% - 42%: SMASH RIGHT into wall! */
          35% {
            transform: translate(max(220px, 36vw), 10px) rotate(1800deg) scale(0.68, 1.32);
            filter: drop-shadow(15px 0 25px #ffa502) brightness(1.4);
          }
          42% {
            transform: translate(max(130px, 18vw), -10px) rotate(2020deg) scale(1.12, 0.92);
          }

          /* 43% - 56%: FALL DOWN with gravity! */
          46% {
            transform: translate(0px, 20px) rotate(2200deg) scale(0.9, 1.25);
          }
          55% {
            transform: translate(0px, min(300px, 42vh)) rotate(2520deg) scale(1.45, 0.55);
            filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.9)) brightness(1.3);
          }

          /* 57% - 74%: BLAST EXPLOSION! */
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
          72% {
            transform: translate(0px, min(300px, 42vh)) scale(0);
            opacity: 0;
          }

          /* 73% - 84%: Limbo (hidden during blast) */
          84% {
            transform: translate(0px, -180px) rotate(0deg) scale(0.2);
            opacity: 0;
          }

          /* 85% - 100%: RESURRECTION / RETURN with spring bounce */
          88% {
            transform: translate(0px, 15px) rotate(-6deg) scale(1.22, 0.88);
            opacity: 1;
            filter: drop-shadow(0 0 35px var(--gold-glow));
          }
          94% {
            transform: translate(0px, -8px) rotate(3deg) scale(0.95, 1.05);
            opacity: 1;
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
            opacity: 1;
            filter: drop-shadow(0 20px 60px rgba(0,0,0,.8));
          }
        }

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
