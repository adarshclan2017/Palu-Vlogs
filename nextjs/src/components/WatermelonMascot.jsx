'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Vegetable Gang Mascot Configuration for Next.js
 * 12 Characters docked strictly at outer edges (2 on Left, 2 on Right, 4 on Top, 4 on Bottom).
 * Maximum Separation: No mascot stands near another (300px+ distance), corners stay clear, ZERO overlay.
 * Dynamic edge slots guarantee that even after dragging, mascots snap to spaced slots with no overlap.
 * Onion and Tomato have naturalFacing: 'right' so their body angles face inwards towards the website content.
 * Speech text is ultra-compact (11.5px, tight spacing) avoiding wasted space, and NEVER covering the face.
 * Dialogue is strictly 6 words across two lines (3 words on line 1, 3 words on line 2).
 * Uniform size across all 12 characters matching Pumpkin and Onion.
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
      { line1: 'Dai Cucumber edit,', line2: 'stop sleeping now! 🥒😴' },
      { line1: 'Cabbage fifty layers,', line2: 'zero brain bro! 🥬🤣' },
      { line1: 'Tomato stop blushing,', line2: 'look at Pumpkin! 🍅💃' },
      { line1: 'Onion stop crying,', line2: 'nobody cut you! 🧅😭' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'right', offsetPct: 68 },
    defaultEdge: 'right',
    delayMs: 0
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
      { line1: 'Tomato rolls fast,', line2: 'totally zero brain! 🍅💨' },
      { line1: 'Carrot your code', line2: 'has many bugs! 🐛💻' },
      { line1: 'Beetroot you are', line2: 'not iPhone model! 📱🤣' },
      { line1: 'Watermelon big head,', line2: 'empty inside bro! 🍉💥' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'left', offsetPct: 68 },
    defaultEdge: 'left',
    delayMs: 2000
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
      { line1: 'Cabbage walking slowly', line2: 'with fifty layers! 🥬👗' },
      { line1: 'Ladiesfinger did you', line2: 'fast ten years? 🥒💀' },
      { line1: 'Pumpkin move away,', line2: 'blocking vlog camera! 🎃📸' },
      { line1: 'Onion your smell', line2: 'knocks everyone down! 🧅😵' }
    ],
    naturalFacing: 'right',
    initialPos: { edge: 'left', offsetPct: 32 },
    defaultEdge: 'left',
    delayMs: 4000
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
      { line1: 'Beetroot put down', line2: 'that scary phone! 🤳😱' },
      { line1: 'Coconut one hammer', line2: 'breaks you completely! 🔨🥥' },
      { line1: 'Brinjal you are', line2: 'only side dish! 🍆😂' },
      { line1: 'Cucumber make my', line2: 'vlog biceps bigger! 💪🥒' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'bottom', offsetPct: 15 },
    defaultEdge: 'bottom',
    delayMs: 6000
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
      { line1: 'Onion daily crying', line2: 'like TV serial! 😭🧅' },
      { line1: 'Watermelon bowling ball', line2: 'wearing funny hat! 🍉🎳' },
      { line1: 'Cauliflower shock haircut', line2: 'looks super funny! 🥦⚡' },
      { line1: 'Catch rolling Tomato', line2: 'into hot sambar! 🍅🍲' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'bottom', offsetPct: 62 },
    defaultEdge: 'bottom',
    delayMs: 8000
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
      { line1: 'Coconut beach chair', line2: "won't make CEO! 🌴🥥" },
      { line1: 'Carrot coder you', line2: "aren't Elon Musk! 🥕🤓" },
      { line1: 'Ladiesfinger looks like', line2: 'tiny green toothpick! 🥒😆' },
      { line1: 'Viewers watch vlog', line2: 'only for me! 🍆👑' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'bottom', offsetPct: 85 },
    defaultEdge: 'bottom',
    delayMs: 10000
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
      { line1: 'Pumpkin your tummy', line2: 'needs pin code! 🎃🏋️' },
      { line1: 'Tomato gets squashed', line2: 'in every episode! 🍅💥' },
      { line1: 'Cucumber stop watching', line2: 'anime until midnight! 🥒📺' },
      { line1: 'I make everyone', line2: 'cry so easily! 💪🧅' }
    ],
    naturalFacing: 'right',
    initialPos: { edge: 'right', offsetPct: 32 },
    defaultEdge: 'right',
    delayMs: 12000
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
      { line1: 'Cauliflower head error', line2: 'hair not found! 🥦💻' },
      { line1: 'Cucumber my script', line2: 'edits reels instantly! 🥒⚡' },
      { line1: 'Beetroot phone battery', line2: 'dropped to one! 📱🪫' },
      { line1: 'Cabbage has more', line2: 'layers than CSS! 🥬💻' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'top', offsetPct: 62 },
    defaultEdge: 'top',
    delayMs: 14000
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
      { line1: 'Praying for Carrot', line2: 'buggy broken code! 🙏🥕' },
      { line1: 'Brinjal why that', line2: 'sad purple face? 🍆💔' },
      { line1: 'Pumpkin stop eating', line2: 'all shoot snacks! 🎃🍩' },
      { line1: 'Cucumber laptop fan', line2: 'sounds like jet! ✈️💻' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'top', offsetPct: 15 },
    defaultEdge: 'top',
    delayMs: 16000
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
      { line1: 'Ladiesfinger did your', line2: 'tiny battery die? 🥒🔋' },
      { line1: 'Cabbage my camera', line2: "says you're expired! 🔴🥬" },
      { line1: 'Coconut we know', line2: 'you are bald! 🕶️🥥' },
      { line1: 'Watermelon upgrade to', line2: 'ultra HD now! 🍉📱' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'bottom', offsetPct: 38 },
    defaultEdge: 'bottom',
    delayMs: 18000
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
      { line1: 'Brinjal one joke', line2: "and you're banned! 🍆🚫" },
      { line1: 'Watermelon pay channel', line2: 'rent for hat! 🍉💰' },
      { line1: 'Onion step away', line2: 'camera is crying! 🧅😭' },
      { line1: 'I pay bills', line2: 'while kids fight! 🌴👑' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'top', offsetPct: 85 },
    defaultEdge: 'top',
    delayMs: 20000
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
      { line1: 'Watermelon bring biryani', line2: 'or get cut! 🍉🍛' },
      { line1: 'Carrot website broke,', line2: 'go fix bugs! 🥕💥' },
      { line1: 'Beetroot shaky shots', line2: 'make team dizzy! 📱🤢' },
      { line1: 'Pumpkin no slow-mo', line2: 'for bouncing belly! 🎃✂️' }
    ],
    naturalFacing: 'left',
    initialPos: { edge: 'top', offsetPct: 38 },
    defaultEdge: 'top',
    delayMs: 22000
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
 * Individual Interactive Mascot Item (Next.js)
 * Separated by 300px+ across 4 perimeter edges. ZERO overlapping.
 * Body angles face directly into screen (Onion & Tomato face inward).
 * Dialogue is 6 words across two lines, compact, avoiding wasted space.
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

  const mascotRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const reappearTimerRef = useRef(null);
  const entranceTimerRef = useRef(null);
  const quoteCycleTimerRef = useRef(null);

  // Exact uniform size for ALL characters matching Pumpkin & Onion
  const getDimensions = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    return {
      width: isMobile ? 75 : 110,
      height: isMobile ? 115 : 165
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
    const edge = char.initialPos?.edge || char.defaultEdge;
    const offsetPct = char.initialPos?.offsetPct ?? 50;
    let side = edge;

    switch (edge) {
      case 'left':
        x = 8;
        y = Math.max(8, Math.min(h - height - 8, (h * offsetPct) / 100 - height / 2));
        face = 'right';
        angle = 0;
        side = 'left';
        break;
      case 'right':
        x = Math.max(8, w - width - 8);
        y = Math.max(8, Math.min(h - height - 8, (h * offsetPct) / 100 - height / 2));
        face = 'left';
        angle = 180;
        side = 'right';
        break;
      case 'top':
        y = 8;
        x = Math.max(8, Math.min(w - width - 8, (w * offsetPct) / 100 - width / 2));
        face = x < w / 2 ? 'right' : 'left';
        angle = 90;
        side = 'top';
        break;
      case 'bottom':
        y = Math.max(8, h - height - 8);
        x = Math.max(8, Math.min(w - width - 8, (w * offsetPct) / 100 - width / 2));
        face = x < w / 2 ? 'right' : 'left';
        angle = 270;
        side = 'bottom';
        break;
      default:
        x = Math.max(8, w - width - 8);
        y = Math.max(8, Math.min(h - height - 8, (h * 50) / 100 - height / 2));
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
    if (e.target.closest('.mascot-text-msg')) {
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

  /**
   * On Drag End:
   * STRICT EDGE DOCKING + NO NEAR OVERLAYS:
   * Snaps to the nearest edge and locks into a widely separated slot.
   * Guarantees that mascots never stand near each other and never overlap.
   */
  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { width, height } = getDimensions();
    const w = window.innerWidth;
    const h = window.innerHeight;

    setPosition((prev) => {
      const currX = prev.x;
      const currY = prev.y;

      const centerX = currX + width / 2;
      const centerY = currY + height / 2;

      const distLeft = centerX;
      const distRight = w - centerX;
      const distTop = centerY;
      const distBottom = h - centerY;

      const minDist = Math.min(distLeft, distRight, distTop, distBottom);

      let snapX = currX;
      let snapY = currY;
      let newFacing = facing;
      let newAngle = arrowAngle;
      let newSide = dockSide;

      if (minDist === distLeft) {
        snapX = 8;
        const slot1 = (h * 0.32) - height / 2;
        const slot2 = (h * 0.68) - height / 2;
        snapY = Math.abs(currY - slot1) < Math.abs(currY - slot2) ? slot1 : slot2;
        snapY = Math.max(8, Math.min(h - height - 8, snapY));
        newFacing = 'right';
        newAngle = 0;
        newSide = 'left';
      } else if (minDist === distRight) {
        snapX = Math.max(8, w - width - 8);
        const slot1 = (h * 0.32) - height / 2;
        const slot2 = (h * 0.68) - height / 2;
        snapY = Math.abs(currY - slot1) < Math.abs(currY - slot2) ? slot1 : slot2;
        snapY = Math.max(8, Math.min(h - height - 8, snapY));
        newFacing = 'left';
        newAngle = 180;
        newSide = 'right';
      } else if (minDist === distTop) {
        snapY = 8;
        const topSlots = [0.15, 0.38, 0.62, 0.85].map((pct) => (w * pct) - width / 2);
        let bestSlot = topSlots[0];
        let minDiff = Math.abs(currX - bestSlot);
        for (let i = 1; i < topSlots.length; i++) {
          const diff = Math.abs(currX - topSlots[i]);
          if (diff < minDiff) {
            minDiff = diff;
            bestSlot = topSlots[i];
          }
        }
        snapX = Math.max(8, Math.min(w - width - 8, bestSlot));
        newFacing = snapX < w / 2 ? 'right' : 'left';
        newAngle = 90;
        newSide = 'top';
      } else {
        snapY = Math.max(8, h - height - 8);
        const bottomSlots = [0.15, 0.38, 0.62, 0.85].map((pct) => (w * pct) - width / 2);
        let bestSlot = bottomSlots[0];
        let minDiff = Math.abs(currX - bestSlot);
        for (let i = 1; i < bottomSlots.length; i++) {
          const diff = Math.abs(currX - bottomSlots[i]);
          if (diff < minDiff) {
            minDiff = diff;
            bestSlot = bottomSlots[i];
          }
        }
        snapX = Math.max(8, Math.min(w - width - 8, bestSlot));
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

  // Natural facing direction logic: Onion and Tomato naturally face right; others face left
  const naturalFacing = char.naturalFacing || 'left';
  const flipScale = facing === naturalFacing ? 1 : -1;
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
      onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches && e.touches[0]) {
          onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onClick={handleTouchDismiss}
      title={`${char.name} — Touch to hide or drag around screen edges!`}
    >
      {/* Direction Arrow Badge */}
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
        COMPACT 6-WORD 2-LINE DIALOGUE (NO TEXT BOX!)
        Positioned strictly outside with minimal footprint to avoid wasting space and avoid overlay.
        Never covers the character's face.
      */}
      {!isDragging && (
        <div
          className={`mascot-text-msg dock-${dockSide}`}
          onClick={(e) => {
            e.stopPropagation();
            setQuoteIndex((prev) => (prev + 1) % char.quotes.length);
          }}
          title="Click to hear another funny roast!"
        >
          <span className="mascot-msg-line">{currentQuote.line1}</span>
          <span className="mascot-msg-line">{currentQuote.line2}</span>
        </div>
      )}

      {/* Character Image with Flip Transform - FACE IS 100% UNCOVERED */}
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
 * Vegetable Gang Mascots Root Component (Next.js)
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

        /* Exact uniform size for all 12 characters like Pumpkin & Onion */
        .veggie-mascot-card {
          position: fixed;
          width: 110px !important;
          height: 165px !important;
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
          COMPACT 6-WORD 2-LINE DIALOGUE (NO TEXT BOX!)
          Avoids wasting space and avoids overlaying other elements.
          High-contrast comic text shadow for crisp legibility over any website content.
          Positioned strictly to the side/edge to NEVER cover the character's face!
        */
        .mascot-text-msg {
          position: absolute;
          z-index: 25;
          pointer-events: auto;
          cursor: pointer;
          user-select: none;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          width: max-content;
          max-width: 135px;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s;
          animation: mascotTextBob 3s ease-in-out infinite;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .mascot-msg-line {
          display: block;
          white-space: nowrap !important;
          font-family: 'Outfit', 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 800;
          font-size: 11.5px;
          line-height: 1.15;
          color: #ffffff;
          text-shadow: 
            -1.5px -1.5px 0 #000,
            1.5px -1.5px 0 #000,
            -1.5px 1.5px 0 #000,
            1.5px 1.5px 0 #000,
            0 2px 4px rgba(0, 0, 0, 0.95),
            0 3px 10px rgba(0, 0, 0, 0.9);
          letter-spacing: 0.01em;
        }

        /* Docked on RIGHT edge: Dialogue floats strictly to the LEFT of the mascot */
        .mascot-text-msg.dock-right {
          right: calc(100% + 5px);
          top: 14px;
          text-align: right;
          align-items: flex-end;
        }

        /* Docked on LEFT edge: Dialogue floats strictly to the RIGHT of the mascot */
        .mascot-text-msg.dock-left {
          left: calc(100% + 5px);
          top: 14px;
          text-align: left;
          align-items: flex-start;
        }

        /* Docked on TOP edge: Dialogue floats strictly BELOW the mascot */
        .mascot-text-msg.dock-top {
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          align-items: center;
        }

        /* Docked on BOTTOM edge: Dialogue floats strictly ABOVE the mascot */
        .mascot-text-msg.dock-bottom {
          bottom: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          align-items: center;
        }

        .mascot-text-msg:hover {
          transform: scale(1.06);
        }
        .mascot-text-msg.dock-top:hover,
        .mascot-text-msg.dock-bottom:hover {
          transform: translateX(-50%) scale(1.06);
        }

        @keyframes mascotTextBob {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
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
            width: 75px !important;
            height: 115px !important;
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
          .mascot-msg-line {
            font-size: 10px;
            line-height: 1.1;
          }
        }
      `}</style>
    </>
  );
};

export default VeggieGangMascots;
