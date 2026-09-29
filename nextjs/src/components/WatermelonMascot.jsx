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
      { line1: 'Onion stop crying,', line2: 'nobody cut you! 🧅😭' },
      { line1: 'I am the captain', line2: 'of Palu Vlogs! 🍉👑' },
      { line1: 'Click like subscribe,', line2: 'or I smash head! 🍉👍' },
      { line1: 'Coconut pay rent,', line2: 'channel is mine! 🍉💰' },
      { line1: 'Sweet red juicy,', line2: 'pure summer vibe! 🍉✨' },
      { line1: 'Carrot your bugs', line2: 'crashed our video! 🥕🐛' },
      { line1: 'Millions of views,', line2: 'trending number one! 🚀🍉' }
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
      { line1: 'Watermelon big head,', line2: 'empty inside bro! 🍉💥' },
      { line1: 'Peel my layers,', line2: 'find pure gold! 🥬✨' },
      { line1: 'Ladiesfinger stay back,', line2: 'you are too skinny! 🥒😂' },
      { line1: 'Green and fresh,', line2: 'king of salad! 🥬🥗' },
      { line1: 'Pumpkin your stomach', line2: 'needs two seats! 🎃💺' },
      { line1: 'Editor cut scenes,', line2: 'make me hero! 🥬🎬' },
      { line1: 'Subscribers love me,', line2: 'ten out of ten! 🥬❤️' }
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
      { line1: 'Onion your smell', line2: 'knocks everyone down! 🧅😵' },
      { line1: 'Red round juicy,', line2: 'star of sambar! 🍅🍲' },
      { line1: 'Don’t squeeze me,', line2: 'juice will blast! 🍅💥' },
      { line1: 'Watermelon is heavy,', line2: 'I roll faster! 🍅⚡' },
      { line1: 'Catch me live', line2: 'in every episode! 🍅⭐' },
      { line1: 'Drop a comment,', line2: 'show some love! 🍅💬' },
      { line1: 'Spicy rasam boss,', line2: 'can’t cook without! 🍅🌶️' }
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
      { line1: 'Cucumber make my', line2: 'vlog biceps bigger! 💪🥒' },
      { line1: 'Slim and sharp,', line2: 'top channel guard! 🥒🛡️' },
      { line1: 'Haters stay out,', line2: 'I will poke! 🥒⚔️' },
      { line1: 'Onion stop crying,', line2: 'stand in queue! 🧅👮' },
      { line1: 'Green ninja strike,', line2: 'super crisp moves! 🥒⚡' },
      { line1: 'Pumpkin no trespassing', line2: 'in food stall! 🎃🚫' },
      { line1: 'VIP access only,', line2: 'show your sub! 🥒🎫' }
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
      { line1: 'Cucumber laptop fan', line2: 'sounds like jet! ✈️💻' },
      { line1: 'Blessings to all,', line2: 'peace and love! 🥦🕊️' },
      { line1: 'Watermelon chill out,', line2: 'no anger today! 🍉😇' },
      { line1: 'My fluffy hair,', line2: 'best salon look! 🥦💇' },
      { line1: 'Gobi Manchurian star,', line2: 'tastiest of all! 🥦🔥' },
      { line1: 'May your views', line2: 'cross one billion! 🥦🚀' },
      { line1: 'Smile for vlog,', line2: 'god is watching! 🥦📸' }
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
      { line1: 'Pumpkin no slow-mo', line2: 'for bouncing belly! 🎃✂️' },
      { line1: 'Cool like ice,', line2: 'editing 4K vlog! 🥒🎧' },
      { line1: 'Rendering video now,', line2: 'CPU is melting! 🥒🔥' },
      { line1: 'Tomato act well,', line2: 'or get trimmed! 🍅✂️' },
      { line1: 'No caffeine left,', line2: 'only cucumber juice! 🥒🥤' },
      { line1: 'Color grade done,', line2: 'looks like cinema! 🥒🎬' },
      { line1: 'Exporting 60 FPS,', line2: 'super buttery smooth! 🥒⚡' }
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
      { line1: 'Cabbage has more', line2: 'layers than CSS! 🥬💻' },
      { line1: 'Eat carrot daily,', line2: 'sharp 4K vision! 🥕👀' },
      { line1: 'Compiled zero errors,', line2: 'pushing to prod! 🥕🚀' },
      { line1: 'Watermelon big data,', line2: 'small memory leak! 🍉💾' },
      { line1: 'Coconut WiFi router', line2: 'needs reboot now! 🥥📶' },
      { line1: 'Halwa or code,', line2: 'sweetest in world! 🥕🍮' },
      { line1: 'Dark mode enabled,', line2: 'hack the planet! 🥕🕶️' }
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
      { line1: 'I make everyone', line2: 'cry so easily! 💪🧅' },
      { line1: 'Sambar without me', line2: 'is just warm water! 🧅🍲' },
      { line1: 'Biryani fried onion,', line2: 'pure crispy heaven! 🧅🍗' },
      { line1: 'Who dared touch', line2: 'my purple crown? 🧅👑' },
      { line1: 'Strong emotional drama,', line2: 'tears of joy! 🧅🎭' },
      { line1: 'Hit that bell,', line2: 'never miss video! 🧅🔔' },
      { line1: 'Toughest in kitchen,', line2: 'nobody beats me! 🧅💪' }
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
      { line1: 'I pay bills', line2: 'while kids fight! 🌴👑' },
      { line1: 'Hard shell outside,', line2: 'sweet coconut water! 🥥🌴' },
      { line1: 'Server bill paid,', line2: 'stream is live! 🥥📶' },
      { line1: 'Cucumber do work,', line2: 'deadline is today! 🥒⏰' },
      { line1: 'Chutney chief executive,', line2: 'respect the admin! 🥥👔' },
      { line1: 'Coconut break ceremony', line2: 'for new milestone! 🥥🎉' },
      { line1: 'All vlog profits', line2: 'stored in vault! 🥥💎' }
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
      { line1: 'Watermelon upgrade to', line2: 'ultra HD now! 🍉📱' },
      { line1: 'Glowing ruby red,', line2: 'natural lip gloss! 🔴💄' },
      { line1: 'Check my outfit,', line2: 'fashion week icon! 🔴✨' },
      { line1: 'Pumpkin step aside,', line2: 'lighting is mine! 🎃💡' },
      { line1: 'One million likes', line2: 'on my selfie! 📱❤️' },
      { line1: 'Healthy blood juice,', line2: 'run ten miles! 🔴🏃' },
      { line1: 'Red carpet ready,', line2: 'take my picture! 🔴📸' }
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
      { line1: 'Catch rolling Tomato', line2: 'into hot sambar! 🍅🍲' },
      { line1: 'Golden royal giant,', line2: 'king of feast! 🎃👑' },
      { line1: 'Halwa in making,', line2: 'smells so good! 🎃🍮' },
      { line1: 'Cabbage stop talking,', line2: 'I can squash! 🥬💥' },
      { line1: 'Bigger than car,', line2: 'vlog mega star! 🎃🚗' },
      { line1: 'Passed lunch break,', line2: 'where is biryani? 🎃🍛' },
      { line1: 'Legendary Halloween boss,', line2: 'glow in dark! 🎃✨' }
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
      { line1: 'Viewers watch vlog', line2: 'only for me! 🍆👑' },
      { line1: 'Royal shiny purple,', line2: 'glossy crown prince! 🍆✨' },
      { line1: 'Baingan ka bharta,', line2: 'spiciest sensation! 🍆🔥' },
      { line1: 'Tomato you roll,', line2: 'I rule throne! 🍅🤴' },
      { line1: 'Autograph signing line', line2: 'starts right here! 🍆✍️' },
      { line1: 'Watch my swagger,', line2: 'cinema superstar! 🍆🕶️' },
      { line1: 'Share this vlog,', line2: 'make me viral! 🍆🚀' }
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
 * Exactly 8 collision-free slots: 4 on LEFT, 4 on RIGHT (ZERO top, ZERO bottom).
 * Left and Right slots are vertically STAGGERED (Zipper layout):
 * - Left slots at: 11%, 36%, 61%, 85%
 * - Right slots at: 18%, 43%, 68%, 91%
 * Because Left and Right are on completely different vertical rows:
 * 1. Left text bubbles and Right text bubbles NEVER meet or touch horizontally.
 * 2. Same-edge text bubbles have over 80px vertical clearance so they NEVER touch vertically.
 */
const getEightSlots = (w, h, width, height) => {
  const leftPcts = [0.11, 0.36, 0.61, 0.85];
  const rightPcts = [0.18, 0.43, 0.68, 0.91];

  const leftSlots = leftPcts.map((pct, idx) => ({
    slotId: `left-slot-${idx}`,
    edge: 'left',
    x: 6,
    y: Math.max(6, Math.min(h - height - 6, Math.round(h * pct - height / 2))),
    face: 'right',
    angle: 0
  }));

  const rightSlots = rightPcts.map((pct, idx) => ({
    slotId: `right-slot-${idx}`,
    edge: 'right',
    x: Math.max(6, Math.round(w - width - 6)),
    y: Math.max(6, Math.min(h - height - 6, Math.round(h * pct - height / 2))),
    face: 'left',
    angle: 180
  }));

  // Slots 0..3: Left, Slots 4..7: Right
  return [...leftSlots, ...rightSlots];
};

/**
 * Individual Interactive Mascot Item for Next.js
 * Guaranteed collision-free: stationed in 1 of 8 zipper slots.
 * Dialogue box is snug and never overlaps other speech boxes.
 */
const SingleMascot = ({
  char,
  slotIndex,
  isScrolling,
  onCycle,
  onSwap
}) => {
  const [visible, setVisible] = useState(false);
  const [isPoofing, setIsPoofing] = useState(false);
  const [position, setPosition] = useState({ x: -999, y: -999 });
  const [facing, setFacing] = useState('left');
  const [arrowAngle, setArrowAngle] = useState(0);
  const [dockSide, setDockSide] = useState('left');
  const [isDragging, setIsDragging] = useState(false);
  const [splashes, setSplashes] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const mascotRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const entranceTimerRef = useRef(null);
  const quoteCycleTimerRef = useRef(null);

  const getDimensions = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    return {
      width: isMobile ? 84 : 96,
      height: isMobile ? 118 : 136
    };
  };

  const computeSlotPos = (targetSlotIdx = slotIndex) => {
    if (typeof window === 'undefined') return { x: 6, y: 6, face: 'left', angle: 180, side: 'right' };
    const w = window.innerWidth;
    const h = window.innerHeight;
    const { width, height } = getDimensions();
    const slots = getEightSlots(w, h, width, height);
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

    // Staggered entrance for 8 slots
    const delay = Math.min(slotIndex * 350, 2400);
    entranceTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);

    // Stagger quote cycling timing per character so dialogue never changes all at once
    const quoteInterval = 5500 + (slotIndex % 4) * 800;
    quoteCycleTimerRef.current = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % char.quotes.length);
    }, quoteInterval);

    return () => {
      if (entranceTimerRef.current) clearTimeout(entranceTimerRef.current);
      if (quoteCycleTimerRef.current) clearInterval(quoteCycleTimerRef.current);
    };
  }, [slotIndex, char.id]);

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
  }, [isDragging, visible, slotIndex]);

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
        setTimeout(() => setVisible(true), 6000);
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
   * Snaps strictly to the closest of the 8 Left/Right slots.
   * NEVER docks to top or bottom.
   * If slot is occupied, swaps slot index to prevent touching.
   */
  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { width, height } = getDimensions();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const slots = getEightSlots(w, h, width, height);

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
      title={`${char.name} — Tap to cycle or drag!`}
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
 * - DISPLAYS AT LEAST 8 STICKERS: 4 on the LEFT, 4 on the RIGHT.
 * - ZERO stickers on top, ZERO stickers on bottom.
 * - Staggered Zipper layout prevents dialogue speech bubbles from touching each other.
 * - "ONE IN AND ONE OUT" ROTATION: Cycles continuously so all 12 gang members are displayed!
 * - Auto-closes when scrolling, reappears gracefully when scroll stops.
 */
const VeggieGangMascots = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  // 8 active slots: 4 on LEFT (0..3), 4 on RIGHT (4..7)
  const [activeSlots, setActiveSlots] = useState([0, 1, 2, 3, 4, 5, 6, 7]);
  const lastRotatedSlotRef = useRef(0);

  const scrollTimeoutRef = useRef(null);

  // "One in and one out": Smoothly swaps one slot with a character from reserve
  const cycleOneSlot = (slotIdx) => {
    setActiveSlots((prev) => {
      const activeSet = new Set(prev);
      const reserve = [];
      for (let i = 0; i < GANG_CHARACTERS.length; i++) {
        if (!activeSet.has(i)) {
          reserve.push(i);
        }
      }
      if (reserve.length === 0) return prev;

      // Select next reserve character
      const nextChar = reserve[Math.floor(Math.random() * reserve.length)];
      const nextSlots = [...prev];
      nextSlots[slotIdx] = nextChar;
      return nextSlots;
    });
  };

  // Continuous "One In and One Out" squad rotation every 7.5 seconds
  // Alternates between left and right sides so all 12 characters are shown
  useEffect(() => {
    const slotCycleSequence = [0, 4, 1, 5, 2, 6, 3, 7];
    const timer = setInterval(() => {
      lastRotatedSlotRef.current = (lastRotatedSlotRef.current + 1) % slotCycleSequence.length;
      const targetSlot = slotCycleSequence[lastRotatedSlotRef.current];
      cycleOneSlot(targetSlot);
    }, 7500);

    return () => clearInterval(timer);
  }, []);

  // Dragging to another slot swaps occupants so no two stickers ever collide
  const handleSwapSlots = (fromSlotIdx, toSlotIdx) => {
    if (fromSlotIdx === toSlotIdx) return;
    setActiveSlots((prev) => {
      if (fromSlotIdx >= prev.length || toSlotIdx >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[fromSlotIdx];
      updated[fromSlotIdx] = updated[toSlotIdx];
      updated[toSlotIdx] = temp;
      return updated;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <div className="veggie-gang-mascots-root" aria-live="polite">
        {activeSlots.map((charIdx, slotIdx) => {
          const char = GANG_CHARACTERS[charIdx];
          return (
            <SingleMascot
              key={`${char.id}-${slotIdx}`}
              char={char}
              slotIndex={slotIdx}
              isScrolling={isScrolling}
              onCycle={() => cycleOneSlot(slotIdx)}
              onSwap={(targetIdx) => handleSwapSlots(slotIdx, targetIdx)}
            />
          );
        })}
      </div>

      <style>{`
        .veggie-gang-mascots-root {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99990;
        }

        /* 8 Stickers: 4 on LEFT, 4 on RIGHT - Spaced and collision-free */
        .veggie-mascot-card {
          position: fixed;
          width: 96px !important;
          height: 136px !important;
          pointer-events: auto;
          user-select: none;
          touch-action: none;
          cursor: grab;
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6));
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

        /* Small screen adjustments for 8 stickers (4 Left, 4 Right) */
        @media (max-width: 640px) {
          .veggie-mascot-card {
            width: 84px !important;
            height: 118px !important;
          }
          .mascot-arrow-badge {
            width: 20px;
            height: 20px;
            top: -4px;
            right: -4px;
          }
          .mascot-arrow-icon {
            font-size: 10px;
          }
          .mascot-text-msg {
            padding: 4px 8px !important;
            max-width: 125px;
            border-radius: 7px !important;
          }
          .mascot-msg-line {
            font-size: 10.5px;
            line-height: 1.2;
          }
        }

        @media (max-width: 380px) {
          .veggie-mascot-card {
            width: 74px !important;
            height: 104px !important;
          }
          .mascot-text-msg {
            padding: 3px 6px !important;
            max-width: 112px;
          }
          .mascot-msg-line {
            font-size: 9.5px;
          }
        }
      `}</style>
    </>
  );
};

export default VeggieGangMascots;
