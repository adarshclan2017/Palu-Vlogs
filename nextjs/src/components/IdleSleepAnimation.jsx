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

              {/* ── SHIRT BODY ── */}
              <path d="M 70 122 Q 65 120 62 130 L 60 170 L 140 170 L 138 130 Q 135 120 130 122 Z" strokeWidth="3.5"/>
              {/* V-neck collar */}
              <path d="M 88 120 Q 100 136 112 120" strokeWidth="2.5"/>
              {/* PALU VLOGS text on shirt */}
              <text x="100" y="148" fontSize="12" textAnchor="middle"
                fill="#f0e6c8" fontFamily="Anton, sans-serif" letterSpacing="1.5">PALU</text>
              <text x="100" y="163" fontSize="11" textAnchor="middle"
                fill="#f0e6c8" fontFamily="Anton, sans-serif" letterSpacing="1">VLOGS</text>
              {/* Shirt hem line (where shirt meets pants) */}
              <path d="M 60 170 Q 100 174 140 170" strokeWidth="2.5"/>
              {/* Shirt side seams */}
              <line x1="62" y1="130" x2="60" y2="170" strokeWidth="1.5"/>
              <line x1="138" y1="130" x2="140" y2="170" strokeWidth="1.5"/>

              {/* ── PANTS ── */}
              {/* Waistband */}
              <path d="M 58 168 Q 100 176 142 168 L 142 182 Q 100 190 58 182 Z" strokeWidth="2.8"/>
              {/* Belt buckle */}
              <rect x="93" y="170" width="14" height="9" rx="2" strokeWidth="2"/>
              <line x1="100" y1="170" x2="100" y2="179" strokeWidth="1.5"/>
              {/* Left trouser leg */}
              <path d="M 60 182 Q 56 182 54 186 L 46 300 Q 48 310 66 312 Q 78 312 82 302 L 86 190 Q 84 182 78 182 Z" strokeWidth="3"/>
              {/* Left inner seam */}
              <line x1="68" y1="186" x2="66" y2="308" strokeWidth="1.5"/>
              {/* Left trouser cuff */}
              <path d="M 46 302 Q 66 314 84 302" strokeWidth="2"/>
              {/* Right trouser leg */}
              <path d="M 122 182 Q 116 182 114 190 L 118 302 Q 122 312 134 312 Q 152 312 154 302 L 146 186 Q 144 182 140 182 Z" strokeWidth="3"/>
              {/* Right inner seam */}
              <line x1="132" y1="186" x2="134" y2="308" strokeWidth="1.5"/>
              {/* Right trouser cuff */}
              <path d="M 116 302 Q 136 314 154 302" strokeWidth="2"/>

              {/* LEFT ARM — raised up (shirt sleeve) */}
              <g className="sk-arm-up-l" style={{transformOrigin:'70px 128px'}}>
                {/* Sleeve (slightly wider) */}
                <path d="M 64 126 Q 54 90 36 56 Q 44 52 48 56 Q 62 90 76 126 Z" strokeWidth="2.5"/>
                <line x1="70" y1="128" x2="40" y2="60" strokeWidth="3.5"/>
                {/* Sleeve cuff */}
                <path d="M 34 52 Q 44 48 52 56" strokeWidth="2.2"/>
                <line x1="40" y1="60" x2="18" y2="8" strokeWidth="3"/>
                {/* Hand */}
                <path d="M 18 8 Q 8 4 4 12 Q 2 20 10 22" strokeWidth="2.5"/>
                <path d="M 10 20 Q 4 28 10 32 Q 16 34 20 26" strokeWidth="2.5"/>
                <path d="M 18 26 Q 14 34 20 37 Q 26 38 28 30" strokeWidth="2.5"/>
                <path d="M 27 29 Q 26 38 32 38 Q 38 37 38 28" strokeWidth="2.5"/>
                <path d="M 36 26 Q 38 18 32 12 Q 26 8 20 10" strokeWidth="2.5"/>
                <path d="M 4 12 Q -2 6 2 0 Q 8 -4 14 4" strokeWidth="2.5"/>
              </g>

              {/* RIGHT ARM — raised up (shirt sleeve) */}
              <g className="sk-arm-up-r" style={{transformOrigin:'130px 128px'}}>
                {/* Sleeve */}
                <path d="M 136 126 Q 146 90 164 56 Q 156 52 152 56 Q 138 90 124 126 Z" strokeWidth="2.5"/>
                <line x1="130" y1="128" x2="160" y2="60" strokeWidth="3.5"/>
                {/* Sleeve cuff */}
                <path d="M 148 52 Q 158 48 166 56" strokeWidth="2.2"/>
                <line x1="160" y1="60" x2="182" y2="8" strokeWidth="3"/>
                {/* Hand */}
                <path d="M 182 8 Q 192 4 196 12 Q 198 20 190 22" strokeWidth="2.5"/>
                <path d="M 190 20 Q 196 28 190 32 Q 184 34 180 26" strokeWidth="2.5"/>
                <path d="M 182 26 Q 186 34 180 37 Q 174 38 172 30" strokeWidth="2.5"/>
                <path d="M 173 29 Q 174 38 168 38 Q 162 37 162 28" strokeWidth="2.5"/>
                <path d="M 164 26 Q 162 18 168 12 Q 174 8 180 10" strokeWidth="2.5"/>
                <path d="M 196 12 Q 202 6 198 0 Q 192 -4 186 4" strokeWidth="2.5"/>
              </g>

              {/* LEFT SHOE */}
              <path d="M 46 308 Q 30 312 18 322 Q 16 330 28 332 Q 46 334 58 326 Q 62 320 56 314" strokeWidth="2.8"/>
              <path d="M 28 332 Q 22 340 26 344 Q 34 346 44 340" strokeWidth="2"/>

              {/* RIGHT SHOE */}
              <path d="M 154 308 Q 170 312 182 322 Q 184 330 172 332 Q 154 334 142 326 Q 138 320 144 314" strokeWidth="2.8"/>
              <path d="M 172 332 Q 178 340 174 344 Q 166 346 156 340" strokeWidth="2"/>

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
