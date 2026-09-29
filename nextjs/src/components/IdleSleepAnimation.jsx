'use client';
import { useEffect, useState, useRef } from 'react';

const IDLE_TIMEOUT = 10000; // 10 seconds

export default function IdleSleepAnimation() {
  const [phase, setPhase] = useState('hidden'); // hidden | yawn | sleep
  const timerRef = useRef(null);
  const phaseRef = useRef('hidden');

  const wake = () => {
    clearTimeout(timerRef.current);
    if (phaseRef.current !== 'hidden') {
      phaseRef.current = 'hidden';
      setPhase('hidden');
    }
    timerRef.current = setTimeout(() => {
      phaseRef.current = 'yawn';
      setPhase('yawn');
      setTimeout(() => {
        if (phaseRef.current === 'yawn') {
          phaseRef.current = 'sleep';
          setPhase('sleep');
        }
      }, 3000); // yawn for 3s then sleep
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const events = ['scroll', 'mousemove', 'mousedown', 'keydown', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, wake, { passive: true }));
    wake(); // start timer on mount
    return () => {
      events.forEach(e => window.removeEventListener(e, wake));
      clearTimeout(timerRef.current);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div className="idle-overlay" onClick={wake} title="Click anywhere to wake up!">
      <div className={`idle-character ${phase}`}>

        {/* Sleeping Zzz */}
        {phase === 'sleep' && (
          <div className="idle-zzz-wrap">
            <span className="zzz z1">z</span>
            <span className="zzz z2">z</span>
            <span className="zzz z3">Z</span>
          </div>
        )}

        {/* Body */}
        <div className="idle-body">
          {/* Arms */}
          <span className={`idle-arm arm-left ${phase === 'yawn' ? 'stretch' : 'droop'}`}>🤚</span>

          {/* Face */}
          <div className="idle-face">
            {/* Eyes */}
            <div className="idle-eyes">
              <div className={`idle-eye ${phase === 'sleep' ? 'closed' : phase === 'yawn' ? 'half' : ''}`} />
              <div className={`idle-eye ${phase === 'sleep' ? 'closed' : phase === 'yawn' ? 'half' : ''}`} />
            </div>
            {/* Mouth */}
            <div className={`idle-mouth ${phase === 'yawn' ? 'yawn' : phase === 'sleep' ? 'sleep' : ''}`} />
          </div>

          <span className={`idle-arm arm-right ${phase === 'yawn' ? 'stretch' : 'droop'}`}>🤚</span>
        </div>

        <div className="idle-hint">
          {phase === 'yawn' ? '😪 Getting sleepy...' : '😴 Tap anywhere to wake me up!'}
        </div>
      </div>
    </div>
  );
}
