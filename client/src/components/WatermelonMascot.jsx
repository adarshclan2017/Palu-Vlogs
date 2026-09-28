import React, { useState, useEffect, useRef } from 'react';

/**
 * Vegetable Gang Mascot Configuration
 * 12 Characters docked strictly at the outer ends/edges of the screen (3 per edge: Left, Right, Top, Bottom).
 * Never sticks in the center area.
 * Speech bubble is positioned completely to the side (never covering the character's face!).
 * Each character asks funny YouTuber greetings ("Hii guys!", "How can I help you today?", etc.)
 * Sequential line-by-line entrance every 2 seconds after the first character.
 */
const GANG_CHARACTERS = [
  {
    id: 'watermelon',
    name: 'Watermelon Star',
    role: 'Vibe Master',
    image: '/assets/images/watermelon_gang.png',
    badgeGradient: 'linear-gradient(135deg, #ff3838, #2ecc71)',
    glowColor: 'rgba(46, 204, 113, 0.45)',
    emojis: ['🍉', '💦', '💥', '✨', '🍉'],
    quotes: [
      'Hii guys! 🍉 Welcome to Palu Vlogs! Subscribed alle?',
      'How can I help you today? Looking for travel chaos? 🍉',
      'Bro, hit that subscribe bell icon right now! 🔔',
      'Vibe check passed! Ready for our next Kerala road trip? 🚗'
    ],
    defaultEdge: 'right',
    offsetPct: 82,
    delayMs: 0 // First image displays immediately
  },
  {
    id: 'cabbage',
    name: 'Cabbage Star',
    role: 'Leaf Commander',
    image: '/assets/images/cabbage_gang.png',
    badgeGradient: 'linear-gradient(135deg, #2ecc71, #27ae60)',
    glowColor: 'rgba(46, 204, 113, 0.45)',
    emojis: ['🥬', '🌿', '✨', '🍃', '🥬'],
    quotes: [
      'Hii fraands! 🥬 Leaf Commander here! How can I help you?',
      'Do I look like a cabbage or a superhero? Be honest! 😂',
      '100% organic vlogger! Like & share our videos! 🥬',
      'Fresh vibes straight from the garden! What can I do for you?'
    ],
    defaultEdge: 'left',
    offsetPct: 18,
    delayMs: 2000 // 2s after first
  },
  {
    id: 'tomato',
    name: 'Cameo Star Tomato',
    role: 'Cameo King',
    image: '/assets/images/tomato_gang.png',
    badgeGradient: 'linear-gradient(135deg, #ff4757, #ffa502)',
    glowColor: 'rgba(255, 71, 87, 0.55)',
    emojis: ['🍅', '⭐', '🔥', '✨', '🍅'],
    quotes: [
      'Hello superstar! 🍅 Cameo Star is here! How can I help you?',
      'Need an autograph or a spicy gossip vlog from today? 😎',
      'Today\'s episode is 100% pure swag! Did you like it? ⭐',
      'Wait for the climax twist in our latest video! 🎬'
    ],
    defaultEdge: 'right',
    offsetPct: 18,
    delayMs: 4000 // 2s after cabbage
  },
  {
    id: 'ladiesfinger',
    name: 'Okra Security',
    role: 'Chief Security',
    image: '/assets/images/ladiesfinger_gang.png',
    badgeGradient: 'linear-gradient(135deg, #2ed573, #1e90ff)',
    glowColor: 'rgba(46, 213, 115, 0.55)',
    emojis: ['🥒', '🛡️', '⚡', '✨', '🥒'],
    quotes: [
      'Halt! 🥒 Okra Security on duty! Have you subscribed yet? 🛡️',
      'Hii visitor! How can I help you safely tour the website?',
      'Keep your hands inside the vlog jeep at all times! 🚨',
      'No trespassing without watching our latest Kerala vlog! 🎥'
    ],
    defaultEdge: 'left',
    offsetPct: 82,
    delayMs: 6000 // 2s after tomato
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin Star',
    role: 'Vlog Legend',
    image: '/assets/images/pumpkin_gang.png',
    badgeGradient: 'linear-gradient(135deg, #ff7f50, #ffa502)',
    glowColor: 'rgba(255, 165, 2, 0.6)',
    emojis: ['🎃', '📹', '🕶️', '✨', '🎃'],
    quotes: [
      'Wassup Gang! 🎃 Pumpkin Star rolling 4K! How can I help you?',
      'Hii guys! Say cheese for the GoPro camera! 📹',
      'Comment below your favourite snack while watching us! 🍿',
      'Vegetable Gang in the building! Smash that like button! 💥'
    ],
    defaultEdge: 'bottom',
    offsetPct: 50,
    delayMs: 8000 // 2s after okra
  },
  {
    id: 'brinjal',
    name: 'Brinjal Star',
    role: 'Purple Dynamo',
    image: '/assets/images/brinjal_gang.png',
    badgeGradient: 'linear-gradient(135deg, #8854d0, #3867d6)',
    glowColor: 'rgba(136, 84, 208, 0.6)',
    emojis: ['🍆', '👑', '⚡', '✨', '🍆'],
    quotes: [
      'Yo Boss! 🍆 Brinjal Star pointing at YOU! How can I help?',
      'Hii friend! Ready to explore scenic spots across Kerala? 🌴',
      'Purple royalty is here! Turn notifications on! 🔔',
      'Looking for top hidden gems? Check our Locations page! 📍'
    ],
    defaultEdge: 'top',
    offsetPct: 78,
    delayMs: 10000 // 2s after pumpkin
  },
  {
    id: 'onion',
    name: 'Onion Star',
    role: 'Sambar Strongman',
    image: '/assets/images/onion_gang.png',
    badgeGradient: 'linear-gradient(135deg, #9b59b6, #e056fd)',
    glowColor: 'rgba(155, 89, 182, 0.55)',
    emojis: ['🧅', '💪', '👑', '✨', '🧅'],
    quotes: [
      'Hii gym bros! 🧅 Onion Star flexing! How can I help you build vibes?',
      'No crying allowed today, only laughing with Palu Vlogs! 😂',
      'Layer by layer, we uncover the best Kerala road trips! 🧅',
      'Need some extra energy? Hit subscribe and join the gang! 💪'
    ],
    defaultEdge: 'left',
    offsetPct: 50,
    delayMs: 12000 // 2s after brinjal
  },
  {
    id: 'carrot',
    name: 'Carrot Coder Star',
    role: 'Tech & Code Bro',
    image: '/assets/images/carrot_gang.png',
    badgeGradient: 'linear-gradient(135deg, #ff9f43, #ee5253)',
    glowColor: 'rgba(255, 159, 67, 0.55)',
    emojis: ['🥕', '💻', '🚀', '✨', '🥕'],
    quotes: [
      'Hii geeks & viewers! 🥕 Good Code Good Vibes! How can I help you?',
      'Debugging bugs while coding Palu Vlogs website! Notice my stickers? 💻',
      '100% bug-free vlog enjoyment guaranteed! Did you like our UI? 🚀',
      'Console.log("Subscribe to Palu Vlogs now!") 🥕'
    ],
    defaultEdge: 'right',
    offsetPct: 50,
    delayMs: 14000 // 2s after onion
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower Joy',
    role: 'Holy Vibe Blesser',
    image: '/assets/images/cauliflower_gang.png',
    badgeGradient: 'linear-gradient(135deg, #f1c40f, #27ae60)',
    glowColor: 'rgba(241, 196, 15, 0.55)',
    emojis: ['🥦', '🙏', '⛪', '✨', '🥦'],
    quotes: [
      'Blessings to all viewers! 🥦 JOY here! How can I pray / help you today?',
      'May your Wi-Fi be fast and your vlog buffering be zero! 🙏',
      'Keep the peace and watch episode after episode in harmony! ✨',
      'A holy recommendation: subscribe to Palu Vlogs today! 🥦'
    ],
    defaultEdge: 'top',
    offsetPct: 22,
    delayMs: 16000 // 2s after carrot
  },
  {
    id: 'beetroot',
    name: 'Beetroot Star',
    role: 'iPhone Vlogger',
    image: '/assets/images/beetroot_gang.png',
    badgeGradient: 'linear-gradient(135deg, #b71540, #eb2f06)',
    glowColor: 'rgba(183, 21, 64, 0.6)',
    emojis: ['🔴', '📱', '👑', '✨', '🔴'],
    quotes: [
      'Hii bro! 🔴 Not a normal veggie, I am BEETROOT STAR! How can I help?',
      'Checking our YouTube analytics on my iPhone right now! 📱',
      'Our red juice is 100% pure cinema! Have you shared the vlog yet?',
      'Swipe up or click subscribe to see behind the scenes! 👑'
    ],
    defaultEdge: 'bottom',
    offsetPct: 22,
    delayMs: 18000 // 2s after cauliflower
  },
  {
    id: 'coconut',
    name: 'Coconut Admin',
    role: 'Admin of Palu Vlogs',
    image: '/assets/images/coconut_gang.png',
    badgeGradient: 'linear-gradient(135deg, #00d2d3, #10ac84)',
    glowColor: 'rgba(0, 210, 211, 0.6)',
    emojis: ['🥥', '🌴', '🏖️', '🕶️', '🥥'],
    quotes: [
      'Hii people! 🥥 Admin of Palu Vlogs here! Real Face Real Vibes! How can I help?',
      'Chilling with tender coconut water on the beach! Living the dream! 🌴',
      'Admin announcement: whoever subscribes gets a free tender coconut! 🥥',
      'Relax, take a sip, and enjoy the ride with Vegetable Gang! 🕶️'
    ],
    defaultEdge: 'bottom',
    offsetPct: 78,
    delayMs: 20000 // 2s after beetroot
  },
  {
    id: 'cucumber',
    name: 'Cucumber Editor Star',
    role: 'Video Editor & Cut Master',
    image: '/assets/images/cucumber_gang.png',
    badgeGradient: 'linear-gradient(135deg, #10ac84, #1dd1a1)',
    glowColor: 'rgba(29, 209, 161, 0.55)',
    emojis: ['🥒', '🎧', '💻', '🎬', '✨', '🥒'],
    quotes: [
      'Hii squad! 🥒 Edit Mode ON! How can I help you cut through the chaos?',
      'Exporting our 4K Kerala road trip vlog right now! Notice my headphones? 🎧',
      'Color grading is 100% crispy fresh! Did you like the latest cut? 🎬',
      'Zero lag, 60fps, maximum vibes! Hit subscribe to keep me editing! 💻'
    ],
    defaultEdge: 'top',
    offsetPct: 50,
    delayMs: 22000 // 2s after coconut
  }
];

const playPopSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Graceful fallback
  }
};

/**
 * Individual Interactive Mascot Item
 * Docked flush to the perimeter edges: left, right, top, bottom.
 * Speech bubble positioned away from the character so face is NEVER covered!
 */
const SingleMascot = ({ char, index }) => {
  const [visible, setVisible] = useState(false);
  const [isPoofing, setIsPoofing] = useState(false);
  const [position, setPosition] = useState({ x: -999, y: -999 });
  const [facing, setFacing] = useState('left');
  const [arrowAngle, setArrowAngle] = useState(0);
  const [dockSide, setDockSide] = useState(char.defaultEdge);
  const [isDragging, setIsDragging] = useState(false);
  const [splashes, setSplashes] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const mascotRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const reappearTimerRef = useRef(null);
  const entranceTimerRef = useRef(null);
  const quoteCycleTimerRef = useRef(null);

  const getDimensions = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    return {
      width: isMobile ? 80 : 115,
      height: isMobile ? 130 : 180
    };
  };

  const computeDockedPos = () => {
    if (typeof window === 'undefined') return { x: 8, y: 8, face: 'left', angle: 180, side: 'right' };
    const w = window.innerWidth;
    const h = window.innerHeight;
    const { width, height } = getDimensions();

    let x = 8;
    let y = 8;
    let face = 'left';
    let angle = 180;
    let side = char.defaultEdge;

    switch (char.defaultEdge) {
      case 'left':
        x = 8;
        y = Math.max(8, Math.min(h - height - 8, (h * char.offsetPct) / 100 - height / 2));
        face = 'right';
        angle = 0;
        side = 'left';
        break;
      case 'right':
        x = Math.max(8, w - width - 8);
        y = Math.max(8, Math.min(h - height - 8, (h * char.offsetPct) / 100 - height / 2));
        face = 'left';
        angle = 180;
        side = 'right';
        break;
      case 'top':
        y = 8;
        x = Math.max(8, Math.min(w - width - 8, (w * char.offsetPct) / 100 - width / 2));
        face = x < w / 2 ? 'right' : 'left';
        angle = 90;
        side = 'top';
        break;
      case 'bottom':
        y = Math.max(8, h - height - 8);
        x = Math.max(8, Math.min(w - width - 8, (w * char.offsetPct) / 100 - width / 2));
        face = x < w / 2 ? 'right' : 'left';
        angle = 270;
        side = 'bottom';
        break;
      default:
        x = w - width - 8;
        y = h - height - 80;
        face = 'left';
        angle = 180;
        side = 'right';
    }

    return { x, y, face, angle, side };
  };

  useEffect(() => {
    const initialDock = computeDockedPos();
    setPosition({ x: initialDock.x, y: initialDock.y });
    setFacing(initialDock.face);
    setArrowAngle(initialDock.angle);
    setDockSide(initialDock.side);

    entranceTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, char.delayMs);

    quoteCycleTimerRef.current = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % char.quotes.length);
    }, 8000);

    return () => {
      if (entranceTimerRef.current) clearTimeout(entranceTimerRef.current);
      if (reappearTimerRef.current) clearTimeout(reappearTimerRef.current);
      if (quoteCycleTimerRef.current) clearInterval(quoteCycleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging && visible) {
        const { width, height } = getDimensions();
        const w = window.innerWidth;
        const h = window.innerHeight;

        setPosition((prev) => ({
          x: Math.max(8, Math.min(w - width - 8, prev.x)),
          y: Math.max(8, Math.min(h - height - 8, prev.y))
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDragging, visible]);

  const scheduleReappearance = () => {
    if (reappearTimerRef.current) clearTimeout(reappearTimerRef.current);
    reappearTimerRef.current = setTimeout(() => {
      const dock = computeDockedPos();
      setPosition({ x: dock.x, y: dock.y });
      setFacing(dock.face);
      setArrowAngle(dock.angle);
      setDockSide(dock.side);
      setIsPoofing(false);
      setVisible(true);
    }, 10000);
  };

  const handleTouchDismiss = (e) => {
    if (e.target.closest('.mascot-speech-bubble')) {
      e.stopPropagation();
      setQuoteIndex((prev) => (prev + 1) % char.quotes.length);
      return;
    }

    if (hasMovedRef.current || !visible) return;

    playPopSound();
    setIsPoofing(true);

    const newSplashes = char.emojis.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      dx: (Math.random() - 0.5) * 160,
      dy: (Math.random() - 0.5) * 160,
      rot: Math.random() * 360
    }));
    setSplashes(newSplashes);

    setTimeout(() => {
      setVisible(false);
      setIsPoofing(false);
      setSplashes([]);
      scheduleReappearance();
    }, 450);
  };

  const onDragStart = (clientX, clientY) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: clientX, y: clientY };
    initialPosRef.current = { x: position.x, y: position.y };
  };

  const onDragMove = (clientX, clientY) => {
    if (!isDragging) return;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }

    const { width, height } = getDimensions();
    const w = window.innerWidth;
    const h = window.innerHeight;

    const newX = Math.max(5, Math.min(w - width - 5, initialPosRef.current.x + dx));
    const newY = Math.max(5, Math.min(h - height - 5, initialPosRef.current.y + dy));

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      setArrowAngle(angle);

      if (dx < -2) {
        setFacing('left');
      } else if (dx > 2) {
        setFacing('right');
      } else {
        setFacing(newX < w / 2 ? 'right' : 'left');
      }
    }

    setPosition({ x: newX, y: newY });
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { width, height } = getDimensions();
    const w = window.innerWidth;
    const h = window.innerHeight;

    setPosition((prev) => {
      const currX = prev.x;
      const currY = prev.y;

      const distLeft = currX;
      const distRight = w - (currX + width);
      const distTop = currY;
      const distBottom = h - (currY + height);

      const minDist = Math.min(distLeft, distRight, distTop, distBottom);

      let snapX = currX;
      let snapY = currY;
      let newFacing = facing;
      let newAngle = arrowAngle;
      let newSide = dockSide;

      if (minDist === distLeft) {
        snapX = 8;
        snapY = Math.max(8, Math.min(h - height - 8, currY));
        newFacing = 'right';
        newAngle = 0;
        newSide = 'left';
      } else if (minDist === distRight) {
        snapX = w - width - 8;
        snapY = Math.max(8, Math.min(h - height - 8, currY));
        newFacing = 'left';
        newAngle = 180;
        newSide = 'right';
      } else if (minDist === distTop) {
        snapY = 8;
        snapX = Math.max(8, Math.min(w - width - 8, currX));
        newFacing = snapX < w / 2 ? 'right' : 'left';
        newAngle = 90;
        newSide = 'top';
      } else {
        snapY = h - height - 8;
        snapX = Math.max(8, Math.min(w - width - 8, currX));
        newFacing = snapX < w / 2 ? 'right' : 'left';
        newAngle = 270;
        newSide = 'bottom';
      }

      setFacing(newFacing);
      setArrowAngle(newAngle);
      setDockSide(newSide);

      return { x: snapX, y: snapY };
    });
  };

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

  const flipScale = facing === 'left' ? 1 : -1;
  const currentQuote = char.quotes[quoteIndex];

  return (
    <div
      ref={mascotRef}
      className={`veggie-mascot-card mascot-${char.id} dock-${dockSide} ${isPoofing ? 'poofing' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isDragging ? 100005 : 99990 + index,
        filter: `drop-shadow(0 14px 26px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 16px ${char.glowColor})`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches && e.touches[0]) {
          onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onClick={handleTouchDismiss}
      title={`${char.name} — Touch to hide or drag around screen ends!`}
    >
      {/* Transform Direction Arrow Badge */}
      <div
        className="mascot-arrow-badge"
        style={{
          background: char.badgeGradient,
          transform: `rotate(${arrowAngle}deg)`
        }}
        title={`Heading ${Math.round(arrowAngle)}°`}
      >
        <span className="mascot-arrow-icon">➔</span>
      </div>

      {/* 
        YouTuber Funny Dialogue Speech Bubble
        CRITICAL: Positioned completely to the SIDE / OUTSIDE so it NEVER covers the character's face!
        Hidden while actively dragging to guarantee zero obstruction.
      */}
      {!isDragging && (
        <div
          className={`mascot-speech-bubble dock-${dockSide} ${isHovered ? 'hovered' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setQuoteIndex((prev) => (prev + 1) % char.quotes.length);
          }}
          title="Click to hear another funny vlog line!"
        >
          <div className="speech-sender-tag" style={{ background: char.badgeGradient }}>
            {char.name}
          </div>
          <div className="speech-text">
            {currentQuote}
          </div>
          <div className="speech-hint">💬 tap quote / touch body to hide</div>
        </div>
      )}

      {/* Character Image with Flip Transform - UNCOVERED FACE */}
      <div
        className="mascot-img-wrap"
        style={{
          transform: `scaleX(${flipScale})`
        }}
      >
        <img
          src={char.image}
          alt={char.name}
          className="mascot-character-img"
          draggable="false"
        />
      </div>

      {/* Particle Splash on Touch Dismiss */}
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
  );
};

/**
 * Vegetable Gang Mascots Component
 * Renders all 12 characters line by line every 2 seconds docked at screen edges.
 */
const VeggieGangMascots = () => {
  return (
    <>
      <div className="veggie-gang-mascots-root" aria-live="polite">
        {GANG_CHARACTERS.map((char, index) => (
          <SingleMascot key={char.id} char={char} index={index} />
        ))}
      </div>

      <style>{`
        .veggie-gang-mascots-root {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99990;
        }

        .veggie-mascot-card {
          position: fixed;
          width: 115px;
          height: 180px;
          pointer-events: auto;
          user-select: none;
          touch-action: none;
          cursor: grab;
          transition: left 0.42s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.35s ease-out, transform 0.2s ease-out;
          animation: mascotEntrance 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, mascotFloat 3.4s ease-in-out infinite 0.65s;
        }

        .veggie-mascot-card.dragging {
          cursor: grabbing;
          animation: none;
          transition: none !important;
          transform: scale(1.08);
          filter: drop-shadow(0 20px 36px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 24px #ffd32a) !important;
        }

        .veggie-mascot-card.poofing {
          animation: mascotPoof 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
          pointer-events: none;
        }

        .mascot-img-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
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
          top: -10px;
          right: -8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
        }

        .mascot-arrow-icon {
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          line-height: 1;
        }

        /* 
          YOUTUBER SPEECH BUBBLE:
          Positioned completely to the SIDE / OUTSIDE so it NEVER covers the character's face!
        */
        .mascot-speech-bubble {
          position: absolute;
          width: 195px;
          background: rgba(14, 12, 10, 0.96);
          border: 1.5px solid #ffd32a;
          color: #ffffff;
          padding: 8px 11px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), 0 0 14px rgba(255, 211, 42, 0.3);
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s, opacity 0.2s;
          z-index: 25;
          backdrop-filter: blur(10px);
          animation: bubbleFloat 2.6s ease-in-out infinite;
        }

        /* Docked on RIGHT edge: Speech bubble floats to the LEFT */
        .mascot-speech-bubble.dock-right {
          right: calc(100% + 14px);
          top: 15px;
        }
        .mascot-speech-bubble.dock-right::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 22px;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 8px solid #ffd32a;
        }

        /* Docked on LEFT edge: Speech bubble floats to the RIGHT */
        .mascot-speech-bubble.dock-left {
          left: calc(100% + 14px);
          top: 15px;
        }
        .mascot-speech-bubble.dock-left::after {
          content: '';
          position: absolute;
          left: -8px;
          top: 22px;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 8px solid #ffd32a;
        }

        /* Docked on TOP edge: Speech bubble floats BELOW */
        .mascot-speech-bubble.dock-top {
          top: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%);
        }
        .mascot-speech-bubble.dock-top::after {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 8px solid #ffd32a;
        }

        /* Docked on BOTTOM edge: Speech bubble floats ABOVE */
        .mascot-speech-bubble.dock-bottom {
          bottom: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%);
        }
        .mascot-speech-bubble.dock-bottom::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #ffd32a;
        }

        .mascot-speech-bubble:hover,
        .mascot-speech-bubble.hovered {
          transform: scale(1.04);
          background: rgba(22, 18, 14, 0.98);
          border-color: #fffa65;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.85), 0 0 18px rgba(255, 211, 42, 0.45);
        }

        .speech-sender-tag {
          display: inline-block;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 7px;
          border-radius: 9999px;
          color: #ffffff;
          margin-bottom: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        .speech-text {
          font-size: 11px;
          font-weight: 600;
          line-height: 1.35;
          color: #f1f2f6;
          margin-bottom: 3px;
        }

        .speech-hint {
          font-size: 8.5px;
          color: #ffd32a;
          font-style: italic;
          opacity: 0.9;
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
            transform: scale(0.2) translateY(60px) rotate(15deg);
          }
          70% {
            opacity: 1;
            transform: scale(1.12) translateY(-10px) rotate(-4deg);
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
            transform: translateY(-8px) rotate(2deg);
          }
        }

        @keyframes bubbleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
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
          .veggie-mascot-card {
            width: 80px;
            height: 130px;
          }
          .mascot-arrow-badge {
            width: 24px;
            height: 24px;
            top: -6px;
            right: -6px;
          }
          .mascot-arrow-icon {
            font-size: 11px;
          }
          .mascot-speech-bubble {
            width: 140px;
            padding: 5px 8px;
          }
          .speech-text {
            font-size: 9.5px;
          }
          .speech-hint {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default VeggieGangMascots;
