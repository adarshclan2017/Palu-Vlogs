'use client';
import { useEffect, useState, useRef } from 'react';

const IDLE_TIMEOUT = 10000;

export default function IdleSleepAnimation() {
  const [phase, setPhase] = useState('hidden');
  const timerRef = useRef(null);
  const phaseRef = useRef('hidden');

  const wake = () => {
    clearTimeout(timerRef.current);
    if (phaseRef.current !== 'hidden') {
      phaseRef.current = 'hidden';
      setPhase('hidden');
    }
    timerRef.current = setTimeout(() => {
      phaseRef.current = 'stretch';
      setPhase('stretch');
      setTimeout(() => {
        if (phaseRef.current === 'stretch') {
          phaseRef.current = 'sleep';
          setPhase('sleep');
        }
      }, 3000);
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const events = ['scroll', 'mousemove', 'mousedown', 'keydown', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, wake, { passive: true }));
    wake();
    return () => {
      events.forEach(e => window.removeEventListener(e, wake));
      clearTimeout(timerRef.current);
    };
  }, []);

  if (phase === 'hidden') return null;

  const isSleep = phase === 'sleep';

  return (
    <div className="sk-overlay" onClick={wake}>
      <div className="sk-wrapper">

        {/* ── STRETCH PHASE: standing person arms up ── */}
        {!isSleep && (
          <svg viewBox="0 0 200 400" className="sk-svg sk-stretch-svg"
               xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="sk2">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="5" result="n"/>
                <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            <g filter="url(#sk2)" stroke="#f0e6c8" fill="none"
               strokeLinecap="round" strokeLinejoin="round">

              {/* HEAD */}
              <circle cx="100" cy="58" r="40" strokeWidth="3.5"/>
              {/* Hair */}
              <path d="M 64 46 Q 70 18 100 14 Q 130 18 136 46" strokeWidth="2.5"/>

              {/* Eyes — half open (yawning) */}
              <path d="M 82 52 Q 88 58 94 52" strokeWidth="3"/>
              <path d="M 106 52 Q 112 58 118 52" strokeWidth="3"/>

              {/* Eyebrows raised */}
              <path d="M 80 40 Q 88 34 96 38" strokeWidth="2.5"/>
              <path d="M 104 38 Q 112 34 120 40" strokeWidth="2.5"/>

              {/* WIDE YAWN MOUTH */}
              <ellipse cx="100" cy="75" rx="18" ry="15" strokeWidth="3"
                className="sk-mouth-yawn"/>
              {/* Teeth */}
              <line x1="90" y1="63" x2="90" y2="70" strokeWidth="2"/>
              <line x1="100" y1="62" x2="100" y2="69" strokeWidth="2"/>
              <line x1="110" y1="63" x2="110" y2="70" strokeWidth="2"/>

              {/* NECK */}
              <line x1="88" y1="96" x2="85" y2="120" strokeWidth="3"/>
              <line x1="112" y1="96" x2="115" y2="120" strokeWidth="3"/>

              {/* BODY */}
              <path d="M 70 122 Q 65 120 62 130 L 58 210 Q 64 222 100 224 Q 136 222 142 210 L 138 130 Q 135 120 130 122 Z" strokeWidth="3.5"/>
              <path d="M 82 135 Q 100 142 118 135" strokeWidth="1.8"/>

              {/* LEFT ARM — raised up */}
              <g className="sk-arm-up-l" style={{transformOrigin:'70px 128px'}}>
                <line x1="70" y1="128" x2="40" y2="60" strokeWidth="3.5"/>
                <line x1="40" y1="60" x2="18" y2="8" strokeWidth="3"/>
                {/* Hand */}
                <path d="M 18 8 Q 8 4 4 12 Q 2 20 10 22" strokeWidth="2.5"/>
                <path d="M 10 20 Q 4 28 10 32 Q 16 34 20 26" strokeWidth="2.5"/>
                <path d="M 18 26 Q 14 34 20 37 Q 26 38 28 30" strokeWidth="2.5"/>
                <path d="M 27 29 Q 26 38 32 38 Q 38 37 38 28" strokeWidth="2.5"/>
                <path d="M 36 26 Q 38 18 32 12 Q 26 8 20 10" strokeWidth="2.5"/>
                <path d="M 4 12 Q -2 6 2 0 Q 8 -4 14 4" strokeWidth="2.5"/>
              </g>

              {/* RIGHT ARM — raised up */}
              <g className="sk-arm-up-r" style={{transformOrigin:'130px 128px'}}>
                <line x1="130" y1="128" x2="160" y2="60" strokeWidth="3.5"/>
                <line x1="160" y1="60" x2="182" y2="8" strokeWidth="3"/>
                {/* Hand */}
                <path d="M 182 8 Q 192 4 196 12 Q 198 20 190 22" strokeWidth="2.5"/>
                <path d="M 190 20 Q 196 28 190 32 Q 184 34 180 26" strokeWidth="2.5"/>
                <path d="M 182 26 Q 186 34 180 37 Q 174 38 172 30" strokeWidth="2.5"/>
                <path d="M 173 29 Q 174 38 168 38 Q 162 37 162 28" strokeWidth="2.5"/>
                <path d="M 164 26 Q 162 18 168 12 Q 174 8 180 10" strokeWidth="2.5"/>
                <path d="M 196 12 Q 202 6 198 0 Q 192 -4 186 4" strokeWidth="2.5"/>
              </g>

              {/* LEFT LEG */}
              <line x1="85" y1="223" x2="75" y2="320" strokeWidth="3.5"/>
              <line x1="75" y1="320" x2="68" y2="385" strokeWidth="3.2"/>
              {/* Left foot */}
              <path d="M 68 385 Q 52 388 40 398 Q 38 406 50 408 Q 66 410 78 402 Q 82 396 76 390" strokeWidth="2.8"/>

              {/* RIGHT LEG */}
              <line x1="115" y1="223" x2="125" y2="320" strokeWidth="3.5"/>
              <line x1="125" y1="320" x2="132" y2="385" strokeWidth="3.2"/>
              {/* Right foot */}
              <path d="M 132 385 Q 148 388 160 398 Q 162 406 150 408 Q 134 410 122 402 Q 118 396 124 390" strokeWidth="2.8"/>

            </g>
          </svg>
        )}

        {/* ── SLEEP PHASE: person in bed ── */}
        {isSleep && (
          <svg viewBox="0 0 380 230" className="sk-svg sk-bed-svg"
               xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="sk3">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" result="n"/>
                <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            <g filter="url(#sk3)" stroke="#f0e6c8" fill="none"
               strokeLinecap="round" strokeLinejoin="round">

              {/* ══ BED FRAME ══ */}
              {/* Headboard */}
              <path d="M 28 50 Q 26 48 24 54 L 22 190 Q 24 196 36 196 Q 48 196 50 190 L 50 100 Q 48 98 36 98 Q 30 98 28 100" strokeWidth="3.5"/>
              {/* Footboard */}
              <path d="M 330 110 L 330 190 Q 332 196 344 196 Q 356 196 358 190 L 358 110 Q 356 106 344 108 Q 334 108 330 110" strokeWidth="3.5"/>
              {/* Bed base (mattress bottom) */}
              <line x1="36" y1="190" x2="344" y2="190" strokeWidth="3.5"/>
              {/* Mattress top */}
              <path d="M 50 140 Q 52 136 60 134 L 330 134 Q 336 136 338 140" strokeWidth="3"/>
              {/* Bed legs */}
              <line x1="30" y1="190" x2="28" y2="218" strokeWidth="3.5"/>
              <line x1="42" y1="190" x2="42" y2="218" strokeWidth="3"/>
              <line x1="338" y1="190" x2="338" y2="218" strokeWidth="3"/>
              <line x1="350" y1="190" x2="352" y2="218" strokeWidth="3.5"/>

              {/* ══ PILLOW ══ */}
              <path d="M 58 138 Q 60 124 90 122 Q 130 120 132 128 Q 134 138 130 144 Q 126 150 90 150 Q 60 150 58 138 Z" strokeWidth="3"/>
              {/* Pillow crease */}
              <path d="M 75 125 Q 95 124 115 128" strokeWidth="1.5"/>

              {/* ══ PERSON — lying down ══ */}
              {/* Head on pillow */}
              <circle cx="92" cy="136" r="30" strokeWidth="3.5"/>
              {/* Hair */}
              <path d="M 66 124 Q 72 104 92 100 Q 112 104 118 124" strokeWidth="2.5"/>

              {/* SLEEPING EYES — closed lines with lashes */}
              <path d="M 78 132 Q 85 138 92 132" strokeWidth="3"/>
              <path d="M 80 134 L 78 141" strokeWidth="2"/>
              <path d="M 85 136 L 84 143" strokeWidth="2"/>
              <path d="M 90 134 L 91 141" strokeWidth="2"/>

              <path d="M 96 132 Q 103 138 110 132" strokeWidth="3"/>
              <path d="M 98 134 L 96 141" strokeWidth="2"/>
              <path d="M 103 136 L 102 143" strokeWidth="2"/>
              <path d="M 108 134 L 109 141" strokeWidth="2"/>

              {/* Blush */}
              <ellipse cx="72" cy="148" rx="10" ry="6" stroke="#ff9999" strokeWidth="0" fill="#ff9999" opacity="0.4"/>
              <ellipse cx="112" cy="148" rx="10" ry="6" stroke="#ff9999" strokeWidth="0" fill="#ff9999" opacity="0.4"/>

              {/* Nose */}
              <path d="M 92 136 Q 96 142 94 146 Q 91 148 89 145" strokeWidth="1.8"/>

              {/* Tiny sleeping mouth */}
              <path d="M 84 154 Q 92 158 100 154" strokeWidth="2.2"/>

              {/* ══ BODY UNDER BLANKET ══ */}
              {/* Blanket/duvet covering body */}
              <path d="M 118 148 Q 140 136 190 134 Q 250 132 310 136 Q 336 140 338 152 Q 340 162 336 168 Q 330 174 280 176 Q 200 178 140 176 Q 112 172 112 162 Q 112 154 118 148 Z" strokeWidth="3"/>
              {/* Blanket folds */}
              <path d="M 140 138 Q 170 148 200 138" strokeWidth="1.8"/>
              <path d="M 220 136 Q 260 148 295 138" strokeWidth="1.8"/>
              <path d="M 130 158 Q 180 170 240 162 Q 290 155 320 162" strokeWidth="1.8"/>

              {/* Arm peeking out of blanket */}
              <path d="M 120 150 Q 128 140 148 142 Q 158 144 160 152 Q 158 162 146 164 Q 130 166 120 158 Z" strokeWidth="2.8"/>
              {/* Hand fingers */}
              <path d="M 155 145 Q 164 140 168 148 Q 166 156 158 156" strokeWidth="2.2"/>
              <path d="M 160 155 Q 168 152 170 160 Q 168 166 160 165" strokeWidth="2.2"/>
              <path d="M 158 164 Q 164 164 164 170 Q 162 174 156 172" strokeWidth="2.2"/>

              {/* ══ ZZZ ══ */}
              <text x="116" y="108" fontSize="18" fill="#f9d030" stroke="none"
                className="sk-z sk-z1" fontFamily="Anton, sans-serif">z</text>
              <text x="132" y="80" fontSize="26" fill="#f9d030" stroke="none"
                className="sk-z sk-z2" fontFamily="Anton, sans-serif">Z</text>
              <text x="148" y="48" fontSize="34" fill="#f9d030" stroke="none"
                className="sk-z sk-z3" fontFamily="Anton, sans-serif">Z</text>

            </g>
          </svg>
        )}

        {/* Hint */}
        <div className="sk-hint">
          {!isSleep ? '😪 Getting sleepy...' : '😴 Tap anywhere to wake up!'}
        </div>

      </div>
    </div>
  );
}
