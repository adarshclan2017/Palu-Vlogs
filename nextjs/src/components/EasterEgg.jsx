'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function EasterEgg() {
  const [unlocked, setUnlocked] = useState(false);
  const inputBuffer = useRef('');
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;

      const char = e.key.toLowerCase();
      if (/^[a-z]$/.test(char)) {
        inputBuffer.current = (inputBuffer.current + char).slice(-9);
        if (inputBuffer.current.endsWith('paluvlogs')) {
          setUnlocked(true);
          inputBuffer.current = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Confetti cannon animation on unlock
  useEffect(() => {
    if (!unlocked) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#ffffff', '#fbbf24'];
    const particles = Array.from({ length: 120 }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 20,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      life: 1,
      decay: Math.random() * 0.012 + 0.008
    }));

    let active = true;
    const render = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particles) {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.vx *= 0.98; // air drag
          p.rotation += p.vRot;
          p.life -= p.decay;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      }

      if (alive) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [unlocked]);

  if (!unlocked) return null;

  return (
    <div className="easter-egg-overlay" onClick={() => setUnlocked(false)}>
      <canvas ref={canvasRef} className="easter-egg-canvas" />

      <div className="easter-egg-card" onClick={(e) => e.stopPropagation()}>
        <div className="easter-egg-icon">🎉 👑 🛵</div>
        <h2 className="easter-egg-title">SECRET SQUAD UNLOCKED!</h2>
        <p className="easter-egg-subtitle">
          You typed <strong>"paluvlogs"</strong> and unlocked the hidden Vegetable Gang VIP Pass!
        </p>

        <div className="easter-egg-perks">
          <div className="perk-item">
            <span>⭐</span>
            <span>Honorary Vegetable Gang Member badge</span>
          </div>
          <div className="perk-item">
            <span>🛵</span>
            <span>Reserved pillion seat on our next Kerala road trip</span>
          </div>
          <div className="perk-item">
            <span>🍲</span>
            <span>Free unscripted porotta & chai at any thatte kada</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-gold"
          onClick={() => setUnlocked(false)}
          style={{ width: '100%', marginTop: '20px', padding: '12px' }}
        >
          Claim VIP Badge & Return 🚀
        </button>
      </div>
    </div>
  );
}
