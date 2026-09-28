import React, { useState, useEffect, useRef } from 'react';

/**
 * WatermelonMascot
 * - Draggable floating mascot on the right side of the screen
 * - Pops in every 10 seconds if dismissed
 * - Disappears with a poof/splash when tapped/clicked
 * - Freely draggable to any side/corner of the viewport
 * - Flips and changes arrow/facing direction with CSS transform based on movement
 */
const WatermelonMascot = () => {
  const [visible, setVisible] = useState(true);
  const [isPoofing, setIsPoofing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [facing, setFacing] = useState('left'); // 'left' | 'right'
  const [arrowAngle, setArrowAngle] = useState(0); // in degrees
  const [isDragging, setIsDragging] = useState(false);
  const [splashes, setSplashes] = useState([]);

  const mascotRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const timerRef = useRef(null);

  // Set default initial position on mount (bottom-right)
  useEffect(() => {
    const updateInitialPos = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mascotW = w < 640 ? 110 : 135;
      const mascotH = w < 640 ? 175 : 215;
      setPosition({
        x: Math.max(20, w - mascotW - 24),
        y: Math.max(20, h - mascotH - 90)
      });
    };

    updateInitialPos();
    window.addEventListener('resize', updateInitialPos);
    return () => window.removeEventListener('resize', updateInitialPos);
  }, []);

  // 10-second reappearance timer after being dismissed
  useEffect(() => {
    if (!visible) {
      timerRef.current = setTimeout(() => {
        setIsPoofing(false);
        // Reset to right side when reappearing
        const w = window.innerWidth;
        const h = window.innerHeight;
        const mascotW = w < 640 ? 110 : 135;
        const mascotH = w < 640 ? 175 : 215;
        setPosition({
          x: Math.max(20, w - mascotW - 24),
          y: Math.max(20, h - mascotH - 90)
        });
        setFacing('left');
        setArrowAngle(180);
        setVisible(true);
      }, 10000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  // Touch or Click handler to make it disappear
  const handleTouchDismiss = () => {
    if (hasMovedRef.current) return; // Ignore if user was dragging

    setIsPoofing(true);

    // Spawn splash particles
    const emojis = ['🍉', '💦', '💥', '✨', '🍉'];
    const newSplashes = emojis.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      dx: (Math.random() - 0.5) * 120,
      dy: (Math.random() - 0.5) * 120,
      rot: Math.random() * 360
    }));
    setSplashes(newSplashes);

    setTimeout(() => {
      setVisible(false);
      setIsPoofing(false);
      setSplashes([]);
    }, 450);
  };

  // Drag start (Mouse / Touch)
  const onDragStart = (clientX, clientY) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: clientX, y: clientY };
    initialPosRef.current = { x: position.x, y: position.y };
  };

  // Drag move
  const onDragMove = (clientX, clientY) => {
    if (!isDragging) return;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }

    const mascotW = window.innerWidth < 640 ? 110 : 135;
    const mascotH = window.innerWidth < 640 ? 175 : 215;

    const newX = Math.max(10, Math.min(window.innerWidth - mascotW - 10, initialPosRef.current.x + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - mascotH - 10, initialPosRef.current.y + dy));

    // Calculate angle and facing direction
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      setArrowAngle(angle);

      // Facing direction based on X movement or screen half
      if (dx < -2) {
        setFacing('left');
      } else if (dx > 2) {
        setFacing('right');
      } else {
        // Fallback to screen side: face center of screen
        setFacing(newX < window.innerWidth / 2 ? 'right' : 'left');
      }
    }

    setPosition({ x: newX, y: newY });
  };

  // Drag end with magnetic edge snap (never stays in center)
  const onDragEnd = () => {
    setIsDragging(false);

    const mascotW = window.innerWidth < 640 ? 110 : 135;
    const mascotH = window.innerWidth < 640 ? 175 : 215;

    setPosition((prev) => {
      const centerX = prev.x + mascotW / 2;
      const isLeft = centerX < window.innerWidth / 2;

      // Snap flush to edge: 10px from left or 10px from right
      const snapX = isLeft ? 10 : window.innerWidth - mascotW - 10;
      const snapY = Math.max(20, Math.min(window.innerHeight - mascotH - 40, prev.y));

      // Face inwards towards the page content
      setFacing(isLeft ? 'right' : 'left');
      // Arrow points inwards towards content
      setArrowAngle(isLeft ? 0 : 180);

      return { x: snapX, y: snapY };
    });
  };

  // Global mouse / touch listeners while dragging
  useEffect(() => {
    const handleMouseMove = (e) => onDragMove(e.clientX, e.clientY);
    const handleMouseUp = () => onDragEnd();
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => onDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  if (!visible) return null;

  // Transform calculation:
  // - Flip horizontally when facing left vs right
  // - Slight dynamic tilt when dragging
  const flipScale = facing === 'left' ? 1 : -1;
  const isLeftHalf = position.x < window.innerWidth / 2;

  return (
    <>
      <div
        ref={mascotRef}
        className={`watermelon-mascot-container ${isPoofing ? 'poofing' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
        onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches && e.touches[0]) {
            onDragStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onClick={handleTouchDismiss}
        title="I am Watermelon Star! Touch me to disappear or drag me around 🍉"
      >
        {/* Transform Direction Arrow Badge */}
        <div
          className="mascot-arrow-badge"
          style={{
            transform: `rotate(${arrowAngle}deg)`
          }}
          title={`Heading ${Math.round(arrowAngle)}°`}
        >
          <span className="mascot-arrow-icon">➔</span>
        </div>

        {/* Playful Floating Speech Pill */}
        <div
          className="mascot-speech-pill"
          style={{
            transform: `scaleX(${flipScale})`, // prevent text from being mirrored
            left: isLeftHalf ? 'auto' : '-45px',
            right: isLeftHalf ? '-45px' : 'auto'
          }}
        >
          <span>Touch to hide! 🍉</span>
        </div>

        {/* Watermelon Guy Character Image with Flip Transform */}
        <div
          className="mascot-img-wrap"
          style={{
            transform: `scaleX(${flipScale})`
          }}
        >
          <img
            src="/assets/images/watermelon_gang.png"
            alt="Palu Vlogs Watermelon Gang Mascot"
            className="mascot-character-img"
            draggable="false"
          />
        </div>

        {/* Splash Particles when Touched */}
        {isPoofing && (
          <div className="mascot-splash-layer">
            {splashes.map((s) => (
              <span
                key={s.id}
                className="mascot-particle"
                style={{
                  '--dx': `${s.dx}px`,
                  '--dy': `${s.dy}px`,
                  '--rot': `${s.rot}deg`
                }}
              >
                {s.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .watermelon-mascot-container {
          position: fixed;
          z-index: 99999;
          width: 135px;
          height: 215px;
          user-select: none;
          touch-action: none;
          cursor: grab;
          transition: left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.25s ease-out, transform 0.2s ease-out;
          animation: mascotEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, mascotFloat 3.2s ease-in-out infinite 0.6s;
          filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 20px rgba(46, 204, 113, 0.45));
        }

        .watermelon-mascot-container.dragging {
          cursor: grabbing;
          animation: none;
          transition: none !important;
          transform: scale(1.06);
          filter: drop-shadow(0 20px 36px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 25px rgba(255, 75, 75, 0.6));
        }

        .watermelon-mascot-container.poofing {
          animation: mascotPoof 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
          pointer-events: none;
        }

        .mascot-img-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mascot-character-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          display: block;
        }

        /* Direction Arrow Badge */
        .mascot-arrow-badge {
          position: absolute;
          top: -12px;
          right: -10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff3838, #2ecc71);
          border: 2px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
        }

        .mascot-arrow-icon {
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          line-height: 1;
        }

        /* Speech Pill */
        .mascot-speech-pill {
          position: absolute;
          top: -24px;
          background: rgba(18, 16, 14, 0.94);
          border: 1px solid var(--gold, #ffc93c);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          pointer-events: none;
          opacity: 0.9;
          transition: opacity 0.2s;
        }

        .watermelon-mascot-container:hover .mascot-speech-pill {
          opacity: 1;
          background: #ffc93c;
          color: #000;
        }

        /* Splash Particle Layer */
        .mascot-splash-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mascot-particle {
          position: absolute;
          font-size: 24px;
          animation: particleFly 0.45s ease-out forwards;
        }

        @keyframes mascotEntrance {
          0% {
            opacity: 0;
            transform: scale(0.2) translateY(80px) rotate(15deg);
          }
          70% {
            opacity: 1;
            transform: scale(1.12) translateY(-12px) rotate(-4deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0deg);
          }
        }

        @keyframes mascotFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        @keyframes mascotPoof {
          0% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: blur(0px);
          }
          40% {
            transform: scale(1.25) rotate(-10deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(35deg);
            filter: blur(8px);
          }
        }

        @keyframes particleFly {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(1.4) rotate(var(--rot));
          }
        }

        @media (max-width: 640px) {
          .watermelon-mascot-container {
            width: 105px;
            height: 165px;
          }
          .mascot-arrow-badge {
            width: 26px;
            height: 26px;
            top: -8px;
            right: -6px;
          }
          .mascot-arrow-icon {
            font-size: 12px;
          }
          .mascot-speech-pill {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default WatermelonMascot;
