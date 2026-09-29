'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/vlogs', label: 'Vlogs' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/locations', label: 'Locations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

/**
 * Natural Non-Robotic Speech Synthesis:
 * Automatically selects modern Natural/Neural human voices (Microsoft Natural, Google, Apple Samantha, etc.)
 */
const speakWelcomeVoice = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance("Welcome to Palu Vlogs!");

    const voices = window.speechSynthesis.getVoices();

    // Priority 1: Modern Natural / Neural / Online human cloud voices
    let selectedVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online'))
    );

    // Priority 2: High quality Google / Apple / Premium human voices
    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Aria') ||
            v.name.includes('Jenny') ||
            v.name.includes('Serena') ||
            v.name.includes('Karen') ||
            v.name.includes('Daniel') ||
            v.name.includes('Victoria'))
      );
    }

    // Priority 3: Non-robotic English (excluding older robotic desktop synthesizers)
    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          !v.name.toLowerCase().includes('desktop') &&
          !v.name.toLowerCase().includes('david') &&
          !v.name.toLowerCase().includes('zira')
      );
    }

    // Priority 4: Any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Natural human cadence settings: friendly, warm, not robotic
    utterance.pitch = 1.05;
    utterance.rate = 0.95;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech error:', err);
  }
};

/**
 * Magical Welcoming Bell Chime via Web Audio API
 */
const playWelcomeFanfare = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    // 4 Joyful sparkling bells: F5 -> A5 -> C6 -> F6
    const bellNotes = [698.46, 880.0, 1046.5, 1396.91];
    bellNotes.forEach((freq, idx) => {
      const startTime = now + idx * 0.075;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.24, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.68);
    });

    // Warm harmonic pad chord
    const padOsc = ctx.createOscillator();
    const padGain = ctx.createGain();
    padOsc.type = 'triangle';
    padOsc.frequency.setValueAtTime(349.23, now);
    padGain.gain.setValueAtTime(0.14, now);
    padGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    padOsc.connect(padGain);
    padGain.connect(ctx.destination);
    padOsc.start(now);
    padOsc.stop(now + 0.98);
  } catch {
    // fallback
  }
};

const WELCOME_SPARKLES = ['✨', '⭐', '🎉', '🍉', '🌴', '🎬', '💫', '🔥'];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Welcome Animation State
  const [isWelcomeActive, setIsWelcomeActive] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const welcomeTimeoutRef = useRef(null);
  const [profileLogo, setProfileLogo] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('palu_settings_cache');
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed.profileImage || '/assets/images/logo.jpg';
        }
      } catch {}
    }
    return '/assets/images/logo.jpg';
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data?.profileImage) {
          setProfileLogo(data.data.profileImage);
        }
      })
      .catch(() => {});
  }, []);

  // Preload and cache speech voices on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const triggerWelcome = () => {
    if (isWelcomeActive) return; // Prevent double trigger while active

    setIsWelcomeActive(true);

    // 1. Play joyful intro chime
    playWelcomeFanfare();

    // 2. Speak welcome with natural human voice (blended right after initial bell)
    setTimeout(() => {
      speakWelcomeVoice();
    }, 120);

    // 3. Generate floating sparkle burst
    const newSparkles = Array.from({ length: 14 }).map((_, i) => ({
      id: `${Date.now()}_${i}`,
      emoji: WELCOME_SPARKLES[i % WELCOME_SPARKLES.length],
      dx: (Math.random() - 0.5) * 140,
      dy: -30 - Math.random() * 55,
      rot: (Math.random() - 0.5) * 360,
      scale: 0.8 + Math.random() * 0.7,
    }));
    setSparkles(newSparkles);

    // 4. Auto reset after animation & speech finishes
    if (welcomeTimeoutRef.current) clearTimeout(welcomeTimeoutRef.current);
    welcomeTimeoutRef.current = setTimeout(() => {
      setIsWelcomeActive(false);
      setSparkles([]);
    }, 3400);
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    triggerWelcome();
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <>
      <nav className={`navbar ${isWelcomeActive ? 'navbar-welcome-glow' : ''}`}>
        <div className="navbar-inner">
          {/* Palu Vlogs Brand with Interactive Welcome Trigger */}
          <div
            className={`nav-brand-interactive ${isWelcomeActive ? 'anim-active' : ''}`}
            onClick={handleBrandClick}
            onTouchStart={(e) => {
              // Smooth touch trigger
              if (!isWelcomeActive) {
                e.preventDefault();
                handleBrandClick(e);
              }
            }}
            role="button"
            tabIndex={0}
            title="Tap Palu Vlogs for Welcome Voice & Animation! 🎉"
          >
            <div className="nav-brand-logo-wrap">
              <img
                src={profileLogo}
                alt="Palu Vlogs Logo"
                className="nav-brand-logo-img"
                style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
              />
              {isWelcomeActive && <div className="nav-brand-halo" />}
            </div>

            <div className="nav-brand-text-col">
              <div className="nav-brand-title">
                {'Palu Vlogs'.split('').map((char, idx) => (
                  <span
                    key={idx}
                    className="brand-letter"
                    style={{ '--char-idx': idx }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
              <div className="nav-brand-sub">Vegetable Gang</div>
            </div>

            {/* Floating Sparkle Particles */}
            {sparkles.length > 0 && (
              <div className="nav-brand-sparkles" aria-hidden="true">
                {sparkles.map((s) => (
                  <span
                    key={s.id}
                    className="brand-sparkle-item"
                    style={{
                      '--dx': `${s.dx}px`,
                      '--dy': `${s.dy}px`,
                      '--rot': `${s.rot}deg`,
                      '--scale': s.scale,
                    }}
                  >
                    {s.emoji}
                  </span>
                ))}
              </div>
            )}

            {/* Comic Welcome Speech Bubble */}
            {isWelcomeActive && (
              <div className="nav-welcome-bubble" role="status">
                <span className="welcome-wave">👋</span>
                <span className="welcome-text">Welcome to Palu Vlogs! 🌴✨</span>
                <div className="welcome-bubble-arrow" />
              </div>
            )}
          </div>

          <div className="nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link${pathname === href ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <Link
              href="https://www.youtube.com/channel/UCoNA4nItu7DK9ziX2wi7VRg?sub_confirmation=1"
              target="_blank"
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              ▶ Subscribe
            </Link>
            <Link
              href="/admin/login"
              className="admin-nav-pill"
              style={{
                background: 'var(--panel-2)',
                border: '1px solid var(--line)',
                color: 'var(--gold)',
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              ⚙ Admin
            </Link>
            <button
              className="mobile-toggle-btn"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`mobile-backdrop${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
      />
      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        <div className="mobile-drawer-header">
          <div
            className="nav-brand-interactive"
            onClick={triggerWelcome}
            style={{ cursor: 'pointer' }}
          >
            <span className="nav-brand-title">Palu Vlogs</span>
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="mobile-drawer-links">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${pathname === href ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            style={{ color: 'var(--gold)' }}
            onClick={() => setOpen(false)}
          >
            ⚙ Admin
          </Link>
        </nav>
      </div>

      <style jsx>{`
        .nav-brand-interactive {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-brand-interactive:hover {
          transform: scale(1.04);
        }

        .nav-brand-interactive:active {
          transform: scale(0.97);
        }

        .nav-brand-logo-wrap {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 50%;
        }

        :global(.nav-brand-logo-img) {
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--gold);
          box-shadow: 0 0 12px var(--gold-glow);
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Logo Spin and Halo on Tap */
        .anim-active :global(.nav-brand-logo-img) {
          animation: logoWelcomeSpin 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .nav-brand-halo {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid #ffc93c;
          box-shadow: 0 0 20px #ffc93c, inset 0 0 14px #ff4757;
          animation: haloPulse 1.2s ease-out infinite;
          pointer-events: none;
        }

        .nav-brand-text-col {
          display: flex;
          flex-direction: column;
        }

        .nav-brand-title {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          color: var(--cream);
          line-height: 1;
          display: flex;
          align-items: center;
          letter-spacing: 0.02em;
        }

        .nav-brand-sub {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: color 0.3s ease;
        }

        /* Letter Wave & Shimmer on Active Animation */
        .anim-active .brand-letter {
          display: inline-block;
          animation: letterJumpWave 0.75s ease-in-out infinite alternate;
          animation-delay: calc(var(--char-idx) * 45ms);
          color: #ffc93c;
          text-shadow: 0 0 18px rgba(255, 201, 60, 0.9), 0 0 35px rgba(255, 71, 87, 0.8);
        }

        .anim-active .nav-brand-sub {
          color: #ff4757;
          text-shadow: 0 0 10px rgba(255, 71, 87, 0.7);
        }

        /* Welcome Speech Bubble */
        .nav-welcome-bubble {
          position: absolute;
          top: 50px;
          left: 0;
          background: linear-gradient(135deg, #ff4757, #ffa502);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid #ffffff;
          box-shadow: 0 10px 30px rgba(255, 71, 87, 0.7), 0 0 20px rgba(255, 201, 60, 0.5);
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          z-index: 120;
          pointer-events: none;
          animation: bubbleDrop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .welcome-wave {
          font-size: 18px;
          display: inline-block;
          animation: handWave 0.8s ease-in-out infinite alternate;
        }

        .welcome-text {
          font-family: 'Anton', sans-serif;
          font-size: 15px;
          letter-spacing: 0.05em;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .welcome-bubble-arrow {
          position: absolute;
          top: -8px;
          left: 28px;
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 8px solid #ffffff;
        }

        /* Floating Sparkles */
        .nav-brand-sparkles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 130;
        }

        .brand-sparkle-item {
          position: absolute;
          font-size: 20px;
          animation: sparkleFloat 1.2s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }

        /* Navbar glow ripple */
        :global(.navbar.navbar-welcome-glow) {
          border-bottom-color: rgba(255, 201, 60, 0.6) !important;
          box-shadow: 0 4px 28px rgba(255, 71, 87, 0.35), 0 0 25px rgba(255, 201, 60, 0.2);
        }

        @keyframes letterJumpWave {
          0% {
            transform: translateY(0) scale(1);
          }
          100% {
            transform: translateY(-8px) scale(1.22);
          }
        }

        @keyframes logoWelcomeSpin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          40% {
            transform: rotate(180deg) scale(1.25);
          }
          75% {
            transform: rotate(360deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes haloPulse {
          0% {
            transform: scale(0.9);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.45);
            opacity: 0;
          }
        }

        @keyframes bubbleDrop {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.7);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes handWave {
          0% {
            transform: rotate(-15deg);
          }
          100% {
            transform: rotate(25deg);
          }
        }

        @keyframes sparkleFloat {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.3) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(var(--scale)) rotate(var(--rot));
          }
        }
      `}</style>
    </>
  );
}
