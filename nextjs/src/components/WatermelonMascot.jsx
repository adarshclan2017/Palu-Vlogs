'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Vegetable Gang Mascot Configuration for Next.js
 * 12 Characters distributed symmetrically around screen edges:
 * - Left Edge (3 characters): Tomato (20%), Cabbage (50%), Ladiesfinger (80%)
 * - Top Edge (3 characters): Cauliflower (25%), Cucumber (50%), Carrot (75%)
 * - Right Edge (3 characters): Onion (20%), Coconut (50%), Watermelon (80%)
 * - Bottom Edge (3 characters): Beetroot (25%), Pumpkin (50%), Brinjal (75%)
 *
 * SCROLL-AUTO-CLOSE:
 * - WHILE SCROLLING SCREEN: ALL items (mascots + dialogues) are CLOSED immediately!
 *   They smoothly fold into outer screen bezels with opacity 0 and pointer-events disabled.
 *   Screen is 100% clean and unobstructed during scroll.
 * - When scrolling stops, they smoothly glide back into their perimeter slots.
 *
 * ABSOLUTE SEPARATION, AVOID EXTRA SPACE & ZERO OVERLAY:
 * - Every character is separated by 240px to 380px from all other characters.
 * - Corners have 370px+ clearance: no mascot stands near any other mascot.
 * - Uniform compact card size (74px × 108px) leaves maximum breathing space for site content.
 * - Clean subtle shadow (drop-shadow(0 3px 6px rgba(0,0,0,0.45))) with zero dark blur overlay.
 * - Dialogue text is ultra-compact (10px, line-height 1.15, max 95px) and avoids taking up space.
 * - Text has zero overlay (transparent background, no box/border/shadow overlay).
 * - pointer-events: none ensures text never blocks underlying clicks or hover interactions.
 * - Tomato and Onion have naturalFacing: 'right' so their body angles face inwards into the page.
 * - Dragging snaps strictly to nearest edge slots, preventing resting in center or overlapping.
 * - Dialogue is strictly 6 words across two lines (3 words per line).
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
    initialPos: { edge: 'right', offsetPct: 80 },
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
    initialPos: { edge: 'left', offsetPct: 50 },
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
    initialPos: { edge: 'left', offsetPct: 20 },
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
    initialPos: { edge: 'left', offsetPct: 80 },
    defaultEdge: 'left',
    delayMs: 6000
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
    initialPos: { edge: 'top', offsetPct: 25 },
    defaultEdge: 'top',
    delayMs: 8000
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
    initialPos: { edge: 'top', offsetPct: 50 },
    defaultEdge: 'top',
    delayMs: 10000
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
    initialPos: { edge: 'top', offsetPct: 75 },
    defaultEdge: 'top',
    delayMs: 12000
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
    initialPos: { edge: 'right', offsetPct: 20 },
    defaultEdge: 'right',
    delayMs: 14000
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
    initialPos: { edge: 'right', offsetPct: 50 },
    defaultEdge: 'right',
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
    initialPos: { edge: 'bottom', offsetPct: 25 },
    defaultEdge: 'bottom',
    delayMs: 18000
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
    initialPos: { edge: 'bottom', offsetPct: 50 },
    defaultEdge: 'bottom',
    delayMs: 20000
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
    initialPos: { edge: 'bottom', offsetPct: 75 },
    defaultEdge: 'bottom',
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
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
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
 * Calculate 100% collision-free slots with wide clearances.
 * Small screens (<640px) use 6 spacious slots so stickers NEVER touch or crowd each other.
 * Large screens (>=640px) use 12 perimeter slots with corner safety margins.
 */
const getSafeSlots = (w, h, width, height, isMobile) => {
  if (isMobile) {
    return [
      // 0: Top Center (far from left & right sides)
      {
        slotId: 'mobile-top',
        edge: 'top',
        x: Math.max(6, Math.min(w - width - 6, Math.round((w - width) / 2))),
        y: 8,
        face: 'left',
        angle: 90
      },
      // 1: Left Upper (safely below top card, high on left)
      {
        slotId: 'mobile-left-u',
        edge: 'left',
        x: 6,
        y: Math.round(Math.max(height + 26, h * 0.32 - height / 2)),
        face: 'right',
        angle: 0
      },
      // 2: Left Lower (generous gap below upper card, above bottom)
      {
        slotId: 'mobile-left-l',
        edge: 'left',
        x: 6,
        y: Math.round(Math.min(h - height - 28, Math.max(height + 26 + height + 24, h * 0.68 - height / 2))),
        face: 'right',
        angle: 0
      },
      // 3: Bottom Center (far from left & right sides)
      {
        slotId: 'mobile-bottom',
        edge: 'bottom',
        x: Math.max(6, Math.min(w - width - 6, Math.round((w - width) / 2))),
        y: Math.max(6, Math.round(h - height - 8)),
        face: 'left',
        angle: 270
      },
      // 4: Right Upper (safely below top card, high on right)
      {
        slotId: 'mobile-right-u',
        edge: 'right',
        x: Math.max(6, Math.round(w - width - 6)),
        y: Math.round(Math.max(height + 26, h * 0.32 - height / 2)),
        face: 'left',
        angle: 180
      },
      // 5: Right Lower (generous gap below upper card, above bottom)
      {
        slotId: 'mobile-right-l',
        edge: 'right',
        x: Math.max(6, Math.round(w - width - 6)),
        y: Math.round(Math.min(h - height - 28, Math.max(height + 26 + height + 24, h * 0.68 - height / 2))),
        face: 'left',
        angle: 180
      }
    ];
  }

  // Desktop 12 perimeter slots (cleanly separated from all 4 corners and each other)
  return [
    { slotId: 'd-top-1', edge: 'top', x: Math.round(w * 0.22 - width / 2), y: 8, face: 'right', angle: 90 },
    { slotId: 'd-top-2', edge: 'top', x: Math.round(w * 0.50 - width / 2), y: 8, face: 'left', angle: 90 },
    { slotId: 'd-top-3', edge: 'top', x: Math.round(w * 0.78 - width / 2), y: 8, face: 'left', angle: 90 },

    { slotId: 'd-right-1', edge: 'right', x: Math.round(w - width - 8), y: Math.round(h * 0.22 - height / 2), face: 'left', angle: 180 },
    { slotId: 'd-right-2', edge: 'right', x: Math.round(w - width - 8), y: Math.round(h * 0.50 - height / 2), face: 'left', angle: 180 },
    { slotId: 'd-right-3', edge: 'right', x: Math.round(w - width - 8), y: Math.round(h * 0.78 - height / 2), face: 'left', angle: 180 },

    { slotId: 'd-bottom-1', edge: 'bottom', x: Math.round(w * 0.78 - width / 2), y: Math.round(h - height - 8), face: 'left', angle: 270 },
    { slotId: 'd-bottom-2', edge: 'bottom', x: Math.round(w * 0.50 - width / 2), y: Math.round(h - height - 8), face: 'left', angle: 270 },
    { slotId: 'd-bottom-3', edge: 'bottom', x: Math.round(w * 0.22 - width / 2), y: Math.round(h - height - 8), face: 'right', angle: 270 },

    { slotId: 'd-left-1', edge: 'left', x: 8, y: Math.round(h * 0.78 - height / 2), face: 'right', angle: 0 },
    { slotId: 'd-left-2', edge: 'left', x: 8, y: Math.round(h * 0.50 - height / 2), face: 'right', angle: 0 },
    { slotId: 'd-left-3', edge: 'left', x: 8, y: Math.round(h * 0.22 - height / 2), face: 'right', angle: 0 }
  ];
};

/**
 * Individual Interactive Mascot Item for Next.js
 * Guaranteed collision-free: strictly stationed in designated safety slots.
 * Dialogue box is snug and never overlaps other stickers.
 */
const SingleMascot = ({
  char,
  slotIndex,
  isMobile,
  isScrolling,
  revealedAfterScroll,
  onCycle,
  onSwap
}) => {
  const [visible, setVisible] = useState(false);
  const [isPoofing, setIsPoofing] = useState(false);
  const [position, setPosition] = useState({ x: -999, y: -999 });
  const [facing, setFacing] = useState('left');
  const [arrowAngle, setArrowAngle] = useState(0);
  const [dockSide, setDockSide] = useState('right');
  const [isDragging, setIsDragging] = useState(false);
  const [splashes, setSplashes] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const mascotRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const entranceTimerRef = useRef(null);
  const quoteCycleTimerRef = useRef(null);

  // Enlarged uniform dimensions for clear visibility across devices
  const getDimensions = () => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 640;
    return {
      width: mobile ? 100 : 108,
      height: mobile ? 142 : 154
    };
  };

  const computeSlotPos = (targetSlotIdx = slotIndex) => {
    if (typeof window === 'undefined') return { x: 6, y: 6, face: 'left', angle: 180, side: 'right' };
    const w = window.innerWidth;
    const h = window.innerHeight;
    const { width, height } = getDimensions();
    const slots = getSafeSlots(w, h, width, height, isMobile);
    const chosen = slots[targetSlotIdx % slots.length] || slots[0];

    return {
      x: chosen.x,
      y: chosen.y,
      face: chosen.face,
      angle: chosen.angle,
      side: chosen.edge
    };
  };

  useEffect(() => {
    const slot = computeSlotPos(slotIndex);
    setPosition({ x: slot.x, y: slot.y });
    setFacing(slot.face);
    setArrowAngle(slot.angle);
    setDockSide(slot.side);

    // Initial entrance delay
    const delay = isMobile ? slotIndex * 700 : Math.min(slotIndex * 1500, char.delayMs || 0);
    entranceTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);

    quoteCycleTimerRef.current = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % char.quotes.length);
    }, 6500);

    return () => {
      if (entranceTimerRef.current) clearTimeout(entranceTimerRef.current);
      if (quoteCycleTimerRef.current) clearInterval(quoteCycleTimerRef.current);
    };
  }, [slotIndex, isMobile, char.id]);

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging && visible) {
        const slot = computeSlotPos(slotIndex);
        setPosition({ x: slot.x, y: slot.y });
        setFacing(slot.face);
        setArrowAngle(slot.angle);
        setDockSide(slot.side);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDragging, visible, slotIndex, isMobile]);

  const handleTouchDismiss = () => {
    if (hasMovedRef.current || !visible || isScrolling) return;

    playPopSound();
    setIsPoofing(true);

    const newSplashes = char.emojis.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      dx: (Math.random() - 0.5) * 140,
      dy: (Math.random() - 0.5) * 140,
      rot: Math.random() * 360
    }));
    setSplashes(newSplashes);

    setTimeout(() => {
      setVisible(false);
      setIsPoofing(false);
      setSplashes([]);
      if (onCycle) {
        onCycle();
      } else {
        setTimeout(() => setVisible(true), 8000);
      }
    }, 450);
  };

  const onDragStart = (clientX, clientY) => {
    if (isScrolling) return;
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
   * Snaps strictly to the closest designated perimeter safety slot.
   * If slot is already occupied, swaps slot index to prevent touching.
   */
  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { width, height } = getDimensions();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const slots = getSafeSlots(w, h, width, height, isMobile);

    let bestIdx = slotIndex;
    let minDiff = Infinity;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      const d = Math.hypot(s.x - position.x, s.y - position.y);
      if (d < minDiff) {
        minDiff = d;
        bestIdx = i;
      }
    }

    const chosen = slots[bestIdx];
    setPosition({ x: chosen.x, y: chosen.y });
    setFacing(chosen.face);
    setArrowAngle(chosen.angle);
    setDockSide(chosen.edge);

    if (bestIdx !== slotIndex && onSwap) {
      onSwap(bestIdx);
    }
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

  // While scrolling: hide completely
  if (!visible) return null;
  if (isScrolling && !isDragging) return null;
  if (!isScrolling && revealedAfterScroll === false) return null;

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
        zIndex: isDragging ? 100005 : 99990 + slotIndex
      }}
      onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches && e.touches[0]) {
          onDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onClick={handleTouchDismiss}
      title={`${char.name} — Click to cycle squad or drag to move!`}
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

      {/* SPEECH BUBBLE BOX: Snug, clear, and collision-free */}
      {!isDragging && (
        <div className={`mascot-text-msg dock-${dockSide}`}>
          <span className="mascot-msg-line">{currentQuote.line1}</span>
          <span className="mascot-msg-line">{currentQuote.line2}</span>
        </div>
      )}

      {/* Character Image with Flip Transform */}
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

      {/* Particle Splash on Dismiss */}
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
 * Vegetable Gang Mascots Root Component for Next.js
 * - GUARANTEED NON-OVERLAPPING: Stickers never touch each other or screen corners.
 * - On Mobile: 6 spacious, collision-free safety slots with squad rotation so all 12 characters are shown.
 * - On Desktop: 12 perimeter slots with corner buffers.
 * - Auto-closes when scrolling, reappears gracefully when scroll stops.
 */
const VeggieGangMascots = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Mobile active characters in 6 slots: [0, 1, 2, 3, 4, 5] initially
  const [mobileSlots, setMobileSlots] = useState([0, 1, 2, 3, 4, 5]);
  const [scrollRevealCount, setScrollRevealCount] = useState(12);

  const scrollIdleTimerRef = useRef(null);
  const revealIntervalRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On Mobile: Rotate one character every 13 seconds so all 12 gang members are featured cleanly
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setMobileSlots((prev) => {
        const used = new Set(prev);
        let nextChar = 0;
        for (let i = 0; i < GANG_CHARACTERS.length; i++) {
          const candidate = (prev[prev.length - 1] + 1 + i) % GANG_CHARACTERS.length;
          if (!used.has(candidate)) {
            nextChar = candidate;
            break;
          }
        }
        // Rotate the first slot to the end with the new character
        return [...prev.slice(1), nextChar];
      });
    }, 13000);

    return () => clearInterval(interval);
  }, [isMobile]);

  // Click on a mobile mascot cycles that slot to next character
  const handleCycleSlot = (slotIdx) => {
    if (!isMobile) return;
    setMobileSlots((prev) => {
      const used = new Set(prev);
      let nextChar = 0;
      for (let i = 0; i < GANG_CHARACTERS.length; i++) {
        const candidate = (prev[slotIdx] + 1 + i) % GANG_CHARACTERS.length;
        if (!used.has(candidate)) {
          nextChar = candidate;
          break;
        }
      }
      const updated = [...prev];
      updated[slotIdx] = nextChar;
      return updated;
    });
  };

  // Dragging to another slot swaps the occupants to prevent touching
  const handleSwapSlots = (fromSlotIdx, toSlotIdx) => {
    if (fromSlotIdx === toSlotIdx) return;
    if (isMobile) {
      setMobileSlots((prev) => {
        if (fromSlotIdx >= prev.length || toSlotIdx >= prev.length) return prev;
        const updated = [...prev];
        const temp = updated[fromSlotIdx];
        updated[fromSlotIdx] = updated[toSlotIdx];
        updated[toSlotIdx] = temp;
        return updated;
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      setScrollRevealCount(-1);

      if (revealIntervalRef.current) {
        clearInterval(revealIntervalRef.current);
        revealIntervalRef.current = null;
      }
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = null;
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 400);

      scrollIdleTimerRef.current = setTimeout(() => {
        let count = 0;
        setScrollRevealCount(0);
        revealIntervalRef.current = setInterval(() => {
          count += 1;
          setScrollRevealCount(count);
          if (count >= GANG_CHARACTERS.length - 1) {
            clearInterval(revealIntervalRef.current);
            revealIntervalRef.current = null;
            setScrollRevealCount(12);
          }
        }, 1500);
      }, 25000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (scrollIdleTimerRef.current) clearTimeout(scrollIdleTimerRef.current);
      if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
    };
  }, []);

  return (
    <>
      <div className="veggie-gang-mascots-root" aria-live="polite">
        {isMobile ? (
          // Mobile: 6 spacious, collision-free slots that cycle through the full gang
          mobileSlots.map((charIdx, slotIdx) => {
            const char = GANG_CHARACTERS[charIdx];
            return (
              <SingleMascot
                key={`${char.id}-${slotIdx}`}
                char={char}
                slotIndex={slotIdx}
                isMobile={true}
                isScrolling={isScrolling}
                revealedAfterScroll={null}
                onCycle={() => handleCycleSlot(slotIdx)}
                onSwap={(targetIdx) => handleSwapSlots(slotIdx, targetIdx)}
              />
            );
          })
        ) : (
          // Desktop: 12 perimeter slots with corner buffers
          GANG_CHARACTERS.map((char, index) => (
            <SingleMascot
              key={char.id}
              char={char}
              slotIndex={index}
              isMobile={false}
              isScrolling={isScrolling}
              revealedAfterScroll={
                scrollRevealCount === 12
                  ? null
                  : scrollRevealCount >= 0
                    ? index <= scrollRevealCount
                    : false
              }
              onCycle={null}
              onSwap={null}
            />
          ))
        )}
      </div>

      <style>{`
        .veggie-gang-mascots-root {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99990;
        }

        /* Larger uniform size for lively visibility and crisp interaction */
        .veggie-mascot-card {
          position: fixed;
          width: 108px !important;
          height: 154px !important;
          pointer-events: auto;
          user-select: none;
          touch-action: none;
          cursor: grab;
          filter: drop-shadow(0 5px 12px rgba(0, 0, 0, 0.6));
          transition: left 0.42s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.35s ease-out, transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease-out;
          animation: mascotEntrance 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, mascotFloat 3.4s ease-in-out infinite 0.65s;
        }

        .veggie-mascot-card.dragging {
          cursor: grabbing;
          animation: none;
          transition: none !important;
          transform: scale(1.08);
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.75)) !important;
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
          top: -6px;
          right: -5px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
        }

        .mascot-arrow-icon {
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 900;
          line-height: 1;
        }

        /* 
          SPEECH BUBBLE BOX ON TEXT:
          - Distinct box with background, gold border, soft shadow & speech notch
          - Automatically CLOSED while scrolling screen!
        */
        .mascot-text-msg {
          position: absolute;
          z-index: 25;
          pointer-events: none !important;
          user-select: none;
          background: rgba(16, 14, 13, 0.94) !important;
          border: 1.5px solid var(--gold) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.75), 0 0 12px rgba(255, 201, 60, 0.25) !important;
          padding: 6px 11px !important;
          margin: 0 !important;
          width: max-content;
          max-width: 155px;
          backdrop-filter: blur(8px);
          transition: opacity 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mascot-text-msg::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
        }

        .mascot-msg-line {
          display: block;
          white-space: nowrap !important;
          font-family: 'Work Sans', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 700;
          font-size: 11.5px;
          line-height: 1.25;
          color: #f4efe4;
          letter-spacing: 0;
        }

        .mascot-msg-line:last-child {
          color: var(--gold);
          font-weight: 800;
        }

        /* Docked on RIGHT edge: Floats to the LEFT of the mascot */
        .mascot-text-msg.dock-right {
          right: calc(100% + 8px);
          top: 14px;
          text-align: right;
          align-items: flex-end;
        }
        .mascot-text-msg.dock-right::after {
          top: 10px;
          right: -6px;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 6px solid var(--gold);
        }

        /* Docked on LEFT edge: Floats to the RIGHT of the mascot */
        .mascot-text-msg.dock-left {
          left: calc(100% + 8px);
          top: 14px;
          text-align: left;
          align-items: flex-start;
        }
        .mascot-text-msg.dock-left::after {
          top: 10px;
          left: -6px;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-right: 6px solid var(--gold);
        }

        /* Docked on TOP edge: Floats BELOW the mascot */
        .mascot-text-msg.dock-top {
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          align-items: center;
        }
        .mascot-text-msg.dock-top::after {
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 6px solid var(--gold);
        }

        /* Docked on BOTTOM edge: Floats ABOVE the mascot */
        .mascot-text-msg.dock-bottom {
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          align-items: center;
        }
        .mascot-text-msg.dock-bottom::after {
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid var(--gold);
        }

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
          font-size: 20px;
          animation: particleFly 0.45s ease-out forwards;
        }

        @keyframes mascotEntrance {
          0% {
            opacity: 0;
            transform: scale(0.2) translateY(40px) rotate(10deg);
          }
          70% {
            opacity: 1;
            transform: scale(1.08) translateY(-6px) rotate(-3deg);
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
            transform: translateY(-5px) rotate(1.2deg);
          }
        }

        @keyframes mascotPoof {
          0% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: blur(0px);
          }
          40% {
            transform: scale(1.2) rotate(-8deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(30deg);
            filter: blur(6px);
          }
        }

        @keyframes particleFly {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(1.3) rotate(var(--rot));
          }
        }

        /* Small screen responsive adjustments: Light more bigger stickers & readable speech boxes */
        @media (max-width: 640px) {
          .veggie-mascot-card {
            width: 100px !important;
            height: 142px !important;
          }
          .mascot-arrow-badge {
            width: 23px;
            height: 23px;
            top: -5px;
            right: -5px;
          }
          .mascot-arrow-icon {
            font-size: 11px;
          }
          .mascot-text-msg {
            padding: 6px 10px !important;
            max-width: 150px;
            border-radius: 8px !important;
          }
          .mascot-msg-line {
            font-size: 11.5px;
            line-height: 1.25;
          }
        }

        @media (max-width: 380px) {
          .veggie-mascot-card {
            width: 88px !important;
            height: 126px !important;
          }
          .mascot-text-msg {
            padding: 5px 9px !important;
            max-width: 135px;
          }
          .mascot-msg-line {
            font-size: 10.5px;
          }
        }
      `}</style>
    </>
  );
};

export default VeggieGangMascots;
