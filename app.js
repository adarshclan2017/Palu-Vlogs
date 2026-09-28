/**
 * Palu Vlogs — Vegetable Gang
 * Interactive Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. DATA: THE VEGETABLE GANG PROFILES
  // ==========================================
  const gangProfiles = {
    brinjal: {
      name: 'Brinjal Star',
      role: 'Admin · Palu Vlogs',
      badge: 'Squad Admin',
      img: 'assets/images/gang_brinjal.jpg',
      bio: 'Small brinjal, big vibes. The mastermind who plans the filming routes, manages the YouTube dashboard, and still rocks the purple eggplant suit in public markets without flinching.',
      power: 'Master Negotiator at Thatte Kadais',
      snack: 'Eggplant Bhajji & Sulaimani',
      quote: '"Video illelum scene illa, vibes venam!"',
      debut: 'Ep 03: The Purple Menace in Kochi',
      chaos: 78,
      vibe: 96
    },
    cauliflower: {
      name: 'Cauliflower Star',
      role: 'Praying Father',
      badge: 'Spiritual Guide',
      img: 'assets/images/gang_cauliflower.jpg',
      bio: 'Blesses every single memory card and camera battery before hitting the highway. Known for intense pre-trip prayers, miraculously avoiding rainstorms, and bringing unbeatable good luck.',
      power: 'Weather Manipulation & Cloud Dispersion',
      snack: 'Pazham Pori & Strong Chai',
      quote: '"Pathiye poyal mathi, daivam koode undu."',
      debut: 'Ep 01: The Scooter Experiment',
      chaos: 65,
      vibe: 99
    },
    drumstick: {
      name: 'Drumstick Star',
      role: 'Real Face · Real Vibes',
      badge: 'Speed Demon',
      img: 'assets/images/gang_drumstick.jpg',
      bio: 'Longer than your expectations, faster than your scooter. Rides into the scene at 60 km/h, drops an unforgettable one-liner, and speeds off into the sunset. The undisputed king of quick cameos.',
      power: 'Supersonic Scooter Acceleration',
      snack: 'Kappa & Spicy Fish Curry',
      quote: '"Njan vannu, kandu, vandi eduthu poyi."',
      debut: 'Ep 06: High Range Hairpins',
      chaos: 92,
      vibe: 94
    },
    ladiesfinger: {
      name: 'Ladies Finger Star',
      role: 'Security · Palu Vlogs',
      badge: 'Chief of Security',
      img: 'assets/images/gang_ladiesfinger.jpg',
      bio: 'Small ladies finger, colossal responsibility. Protects the tripod, monitors the snack stash, and keeps over-excited bystanders from stealing the vegetable headpieces.',
      power: 'High-Alert 360° Gear Surveillance',
      snack: 'Spicy Mixture & Cold Soda',
      quote: '"Camera thottal pinnem scene aakum!"',
      debut: 'Ep 04: Market Chase',
      chaos: 82,
      vibe: 90
    },
    watermelon: {
      name: 'Watermelon Star',
      role: 'Admin · Palu Vlogs',
      badge: 'Juice Master',
      img: 'assets/images/gang_watermelon.jpg',
      bio: 'It is watermelon season every time he steps in front of the lens. Juicy talks, zero filter, endless laughter, and an uncanny ability to turn any calm afternoon into total madness.',
      power: 'Infinite Refreshment & Roast Generator',
      snack: 'Cold Chilled Watermelon Wedges',
      quote: '"Ithu nammude time, watermelon time!"',
      debut: 'Ep 08: Summer River Jump',
      chaos: 95,
      vibe: 98
    },
    cabbage: {
      name: 'Cabbage Star',
      role: 'Funny Friend',
      badge: 'Master of Dares',
      img: 'assets/images/gang_cabbage.jpg',
      bio: 'Cooler than you think and wrapped in more layers of secrets than a rainforest. The first person to say yes to any ridiculous dare, whether it is jumping into freezing mountain streams or asking strangers for directions in costume.',
      power: 'Multi-Layered Armor & Dare Immunity',
      snack: 'Beef Ularthiyathu & Porotta',
      quote: '"Challenge accept cheythu, ini pinne nokkam."',
      debut: 'Ep 12: The Waterfalls Dare',
      chaos: 88,
      vibe: 92
    },
    coconut: {
      name: 'Coconut Star',
      role: 'Admin · Palu Vlogs',
      badge: 'Chill Master',
      img: 'assets/images/gang_coconut.jpg',
      bio: 'Hard on the outside, 100% sweet coconut water on the inside. Books the homestay or camping site, claims the best hammock within 30 seconds, and spends the rest of the vlog lounging.',
      power: 'Instant Relaxation Aura',
      snack: 'Elaneer (Tender Coconut) & Halwa',
      quote: '"Kooduthal aalojichu thalapukakkenda, relax."',
      debut: 'Ep 02: Alleppey Houseboat Heist',
      chaos: 70,
      vibe: 97
    },
    pumpkin: {
      name: 'Pumpkin Star',
      role: 'Vegetable Gang',
      badge: 'Camera Ninja',
      img: 'assets/images/gang_pumpkin.jpg',
      bio: 'Not just an ordinary pumpkin — he is an absolute superstar. When he is not rocking the huge orange costume, he is pulling off impossible camera angles and drone shots.',
      power: 'Cinematic Low-Angle Mastery',
      snack: 'Roasted Peanuts & Lime Tea',
      quote: '"Frame set aayi, ellarum action!"',
      debut: 'Ep 05: Golden Hour Chase',
      chaos: 84,
      vibe: 95
    },
    tomato: {
      name: 'Tomato Star',
      role: 'Cameo Star',
      badge: 'Scene Stealer',
      img: 'assets/images/gang_tomato.jpg',
      bio: 'He may not be in every frame, but the moment he pops up, the comments section explodes. Brings juicy punchlines, infectious giggles, and vibrant red energy.',
      power: 'Instant Scene Stealing',
      snack: 'Spicy Tomato Chutney Dosa',
      quote: '"Njan oru cameo thanne, pakshe mass!"',
      debut: 'Ep 10: The Food Street Raid',
      chaos: 75,
      vibe: 93
    },
    onion: {
      name: 'Onion Star',
      role: 'Official Onion Star',
      badge: 'Layer of Mystery',
      img: 'assets/images/gang_onion.jpg',
      bio: 'Small onion, gigantic ambitions. Peel back one layer of his personality and there are five more underneath. Can make audience laugh or cry tears of pure joy.',
      power: 'Emotional Rollercoaster Induction',
      snack: 'Crispy Ulli Vada & Hot Chai',
      quote: '"Kanneer alla ithu, anandam!"',
      debut: 'Ep 15: The Village Kitchen Showdown',
      chaos: 89,
      vibe: 91
    },
    potato: {
      name: 'Potato Star',
      role: 'Admin · The Face of Oru Palu',
      badge: 'Channel Mascot',
      img: 'assets/images/gang_potato.jpg',
      bio: 'The undisputed heart and soul of Palu Vlogs. Lives life strictly in "Palu style" — leaps into the river first, worries about drying off later, and somehow turns every blunder into YouTube gold.',
      power: 'Indestructible Optimism & Starch Power',
      snack: 'Hot Potato Stew & Appam',
      quote: '"Enthinaa tension adikkunne, podey!"',
      debut: 'Ep 01: The Scooter Experiment',
      chaos: 98,
      vibe: 100
    }
  };

  // ==========================================
  // 2. DATA: 10 REEL FRAMES
  // ==========================================
  const reelFrames = [
    { src: 'assets/images/reel_1.jpg', caption: 'Frame 01 · Onion Star makes a dramatic road debut in Aluva' },
    { src: 'assets/images/reel_2.jpg', caption: 'Frame 02 · Cabbage Star surviving hairpin curves with style' },
    { src: 'assets/images/reel_3.jpg', caption: 'Frame 03 · Security on duty guarding the tea shop snacks' },
    { src: 'assets/images/reel_4.jpg', caption: 'Frame 04 · Brinjal Star negotiating with actual vegetable vendors' },
    { src: 'assets/images/reel_5.jpg', caption: 'Frame 05 · Coconut Star in peak beach-hammock relaxation' },
    { src: 'assets/images/reel_6.jpg', caption: 'Frame 06 · The legendary pre-trip spiritual blessing' },
    { src: 'assets/images/reel_7.jpg', caption: 'Frame 07 · Watermelon Star testing the spicy beef fry limit' },
    { src: 'assets/images/reel_8.jpg', caption: 'Frame 08 · Tomato Star making a surprise appearance at the toll booth' },
    { src: 'assets/images/reel_9.jpg', caption: 'Frame 09 · Pumpkin Star coordinating camera angles from a tree' },
    { src: 'assets/images/reel_10.jpg', caption: 'Frame 10 · The Face of Palu celebrating 100K subscribers milestone' }
  ];

  // ==========================================
  // 3. AUDIO ENGINE (Web Audio API Synthesizer)
  // ==========================================
  let audioContext = null;
  let soundEnabled = localStorage.getItem('palu_sound_enabled') !== 'false';

  const soundBtn = document.getElementById('soundToggleBtn');
  function updateSoundBtn() {
    if (soundBtn) {
      soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
      soundBtn.classList.toggle('muted', !soundEnabled);
      soundBtn.setAttribute('aria-label', soundEnabled ? 'Mute sound effects' : 'Unmute sound effects');
    }
  }
  updateSoundBtn();

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('palu_sound_enabled', soundEnabled);
      updateSoundBtn();
      if (soundEnabled) playChime(587.33, 0.1); // D5 chime
    });
  }

  function playChime(freq = 523.25, duration = 0.15, type = 'sine') {
    if (!soundEnabled) return;
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  function playPop() {
    playChime(659.25, 0.1, 'triangle'); // E5
  }

  function playSuccess() {
    playChime(523.25, 0.1);
    setTimeout(() => playChime(659.25, 0.1), 80);
    setTimeout(() => playChime(783.99, 0.2), 160);
  }

  // ==========================================
  // 4. GANG FILTER & REAL-TIME SEARCH
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('gangSearchInput');
  const gangCards = document.querySelectorAll('.gang-card');
  const emptyState = document.getElementById('gangEmptyState');
  const resultsCount = document.getElementById('gangResultsCount');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyGangFilters() {
    let visibleCount = 0;
    const query = searchQuery.toLowerCase().trim();

    gangCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const id = card.getAttribute('data-id');
      const profile = gangProfiles[id];
      const name = profile ? profile.name.toLowerCase() : '';
      const role = profile ? profile.role.toLowerCase() : '';
      const bio = profile ? profile.bio.toLowerCase() : '';

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = !query || name.includes(query) || role.includes(query) || bio.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (resultsCount) {
      if (visibleCount === 11) {
        resultsCount.textContent = 'Showing all 11 stars';
      } else {
        resultsCount.textContent = `Showing ${visibleCount} of 11 stars`;
      }
    }
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-filter');
      playPop();
      applyGangFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyGangFilters();
    });
  }

  // ==========================================
  // 5. CHARACTER PROFILE MODAL
  // ==========================================
  const charModal = document.getElementById('charModal');
  const charModalClose = document.getElementById('charModalClose');

  const charModalImg = document.getElementById('charModalImg');
  const charModalBadge = document.getElementById('charModalBadge');
  const charModalName = document.getElementById('charModalName');
  const charModalRole = document.getElementById('charModalRole');
  const charModalBio = document.getElementById('charModalBio');
  const charStatPower = document.getElementById('charStatPower');
  const charStatSnack = document.getElementById('charStatSnack');
  const charStatQuote = document.getElementById('charStatQuote');
  const charStatDebut = document.getElementById('charStatDebut');
  const charChaosVal = document.getElementById('charChaosVal');
  const charChaosBar = document.getElementById('charChaosBar');
  const charVibeVal = document.getElementById('charVibeVal');
  const charVibeBar = document.getElementById('charVibeBar');

  function openCharModal(starId) {
    const profile = gangProfiles[starId];
    if (!profile) return;

    if (charModalImg) charModalImg.src = profile.img;
    if (charModalBadge) charModalBadge.textContent = profile.badge;
    if (charModalName) charModalName.textContent = profile.name;
    if (charModalRole) charModalRole.textContent = profile.role;
    if (charModalBio) charModalBio.textContent = profile.bio;
    if (charStatPower) charStatPower.textContent = profile.power;
    if (charStatSnack) charStatSnack.textContent = profile.snack;
    if (charStatQuote) charStatQuote.textContent = profile.quote;
    if (charStatDebut) charStatDebut.textContent = profile.debut;

    if (charChaosVal) charChaosVal.textContent = `${profile.chaos}%`;
    if (charChaosBar) charChaosBar.style.width = `${profile.chaos}%`;

    if (charVibeVal) charVibeVal.textContent = `${profile.vibe}%`;
    if (charVibeBar) charVibeBar.style.width = `${profile.vibe}%`;

    if (charModal) {
      charModal.classList.add('active');
      charModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      playPop();
    }
  }

  function closeCharModal() {
    if (charModal) {
      charModal.classList.remove('active');
      charModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  gangCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openCharModal(id);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.getAttribute('data-id');
        openCharModal(id);
      }
    });
  });

  if (charModalClose) {
    charModalClose.addEventListener('click', closeCharModal);
  }
  if (charModal) {
    charModal.addEventListener('click', (e) => {
      if (e.target === charModal) closeCharModal();
    });
  }

  // ==========================================
  // 6. VIDEO MODAL PLAYER
  // ==========================================
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoIframe = document.getElementById('videoIframe');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalDesc = document.getElementById('videoModalDesc');
  const watchLatestBtn = document.getElementById('watchLatestVlogBtn');

  const episodeVideos = {
    trailer: {
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1',
      title: 'Palu Vlogs: Season 2 Official Trailer',
      desc: 'Watch the Vegetable Gang conquer the twists, food challenges, and hill stations of Kerala.'
    },
    ep44: {
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1',
      title: 'Ep 44: The Great Eggplant Market Heist',
      desc: 'Brinjal Star walks into a crowded vegetable market in full costume to buy actual brinjals. Chaos follows!'
    },
    ep43: {
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1',
      title: 'Ep 43: Munnar Fog & The Lost Drumstick Suit',
      desc: 'Four friends, two scooters, and raincoats over vegetable costumes on the foggy Munnar pass.'
    },
    ep42: {
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1',
      title: 'Ep 42: Midnight Thatte Kadai Food Run',
      desc: 'Watermelon Star challenges Potato Star to eat the hottest beef fry and porotta without drinking water.'
    }
  };

  function openVideoModal(epKey = 'trailer') {
    const videoData = episodeVideos[epKey] || episodeVideos.trailer;
    if (videoIframe) {
      videoIframe.src = videoData.url;
    }
    if (videoModalTitle) videoModalTitle.textContent = videoData.title;
    if (videoModalDesc) videoModalDesc.textContent = videoData.desc;

    if (videoModal) {
      videoModal.classList.add('active');
      videoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      playSuccess();
    }
  }

  function closeVideoModal() {
    if (videoModal) {
      videoModal.classList.remove('active');
      videoModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (videoIframe) {
        videoIframe.src = '';
      }
    }
  }

  if (watchLatestBtn) {
    watchLatestBtn.addEventListener('click', () => openVideoModal('trailer'));
  }

  document.querySelectorAll('[data-video]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ep = btn.getAttribute('data-video');
      openVideoModal(ep);
    });
  });

  if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideoModal);
  }
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // ==========================================
  // 7. FULL-SCREEN REEL LIGHTBOX
  // ==========================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const stripItems = document.querySelectorAll('.strip-item');

  let currentReelIndex = 0;

  function updateLightbox() {
    const frame = reelFrames[currentReelIndex];
    if (!frame) return;
    if (lightboxImg) lightboxImg.src = frame.src;
    if (lightboxCaption) lightboxCaption.textContent = frame.caption;
    if (lightboxCounter) lightboxCounter.textContent = `${currentReelIndex + 1} / ${reelFrames.length}`;
  }

  function openLightbox(index) {
    currentReelIndex = index;
    updateLightbox();
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      playPop();
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function nextReel() {
    currentReelIndex = (currentReelIndex + 1) % reelFrames.length;
    playPop();
    updateLightbox();
  }

  function prevReel() {
    currentReelIndex = (currentReelIndex - 1 + reelFrames.length) % reelFrames.length;
    playPop();
    updateLightbox();
  }

  stripItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxNext) lightboxNext.addEventListener('click', nextReel);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevReel);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Strip Scroll Buttons
  const photoStrip = document.getElementById('photoStrip');
  const stripPrevBtn = document.getElementById('stripPrevBtn');
  const stripNextBtn = document.getElementById('stripNextBtn');

  if (stripPrevBtn && photoStrip) {
    stripPrevBtn.addEventListener('click', () => {
      photoStrip.scrollBy({ left: -300, behavior: 'smooth' });
      playPop();
    });
  }
  if (stripNextBtn && photoStrip) {
    stripNextBtn.addEventListener('click', () => {
      photoStrip.scrollBy({ left: 300, behavior: 'smooth' });
      playPop();
    });
  }

  // ==========================================
  // 8. GLOBAL KEYBOARD ACCESSIBILITY
  // ==========================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCharModal();
      closeVideoModal();
      closeLightbox();
      closeMobileDrawer();
    }
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') nextReel();
      if (e.key === 'ArrowLeft') prevReel();
    }
  });

  // ==========================================
  // 9. FAN REACTIONS & PARTICLE BURSTS
  // ==========================================
  const reactionBtns = document.querySelectorAll('.reaction-btn');
  const reactionDefaults = {
    fire: 1420,
    laugh: 984,
    love: 2150,
    veggie: 3310
  };

  const reactionEmojis = {
    fire: '🔥',
    laugh: '😂',
    love: '❤️',
    veggie: '🍆'
  };

  // Load persisted counts
  Object.keys(reactionDefaults).forEach(key => {
    const saved = localStorage.getItem(`palu_reaction_${key}`);
    const el = document.getElementById(`count-${key}`);
    if (el) {
      const count = saved ? parseInt(saved, 10) : reactionDefaults[key];
      el.textContent = count.toLocaleString();
    }
  });

  function triggerParticleBurst(x, y, emoji) {
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div');
      p.className = 'reaction-particle';
      p.textContent = emoji;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      const randomX = (Math.random() - 0.5) * 120;
      p.style.setProperty('--tx', `${randomX}px`);
      document.body.appendChild(p);

      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 950);
    }
  }

  reactionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = btn.getAttribute('data-reaction');
      const countEl = document.getElementById(`count-${key}`);
      if (!countEl) return;

      const current = parseInt(countEl.textContent.replace(/,/g, ''), 10) || reactionDefaults[key];
      const next = current + 1;
      countEl.textContent = next.toLocaleString();
      localStorage.setItem(`palu_reaction_${key}`, next);

      playSuccess();

      const rect = btn.getBoundingClientRect();
      const clickX = e.clientX || (rect.left + rect.width / 2);
      const clickY = e.clientY || (rect.top + rect.height / 2);

      triggerParticleBurst(clickX, clickY, reactionEmojis[key] || '⭐');
    });
  });

  // ==========================================
  // 10. MOBILE MENU DRAWER
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    playPop();
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // ==========================================
  // 11. SCROLL SPY & BACK TO TOP
  // ==========================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playPop();
    });
  }

  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ==========================================
  // 12. SUBSCRIBE FORM
  // ==========================================
  const subForm = document.getElementById('subscribeForm');
  const subEmail = document.getElementById('subEmail');
  const subBtn = document.getElementById('subBtn');

  if (subForm && subBtn) {
    subForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = subEmail ? subEmail.value.trim() : '';
      if (!val) return;

      subBtn.textContent = 'Subscribed! 🎉';
      subBtn.style.background = '#28a745';
      playSuccess();

      setTimeout(() => {
        if (subEmail) subEmail.value = '';
        subBtn.textContent = 'Notify Me 🔔';
        subBtn.style.background = '';
      }, 3000);
    });
  }

  // ==========================================
  // 13. FLOATING WATERMELON MASCOT (Interactive)
  // ==========================================
  const mascot = document.getElementById('watermelonMascot');
  const mascotArrowBadge = document.getElementById('mascotArrowBadge');
  const mascotImgWrap = document.getElementById('mascotImgWrap');

  if (mascot) {
    let posX = window.innerWidth - 160;
    let posY = window.innerHeight - 270;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialX = posX;
    let initialY = posY;
    let hasMoved = false;
    let isVisible = true;
    let reappearanceTimer = null;

    function applyPosition(x, y) {
      posX = x;
      posY = y;
      mascot.style.left = `${posX}px`;
      mascot.style.top = `${posY}px`;
    }

    applyPosition(posX, posY);

    window.addEventListener('resize', () => {
      const maxX = window.innerWidth - mascot.offsetWidth - 10;
      const maxY = window.innerHeight - mascot.offsetHeight - 10;
      applyPosition(Math.max(10, Math.min(maxX, posX)), Math.max(10, Math.min(maxY, posY)));
    });

    function scheduleReappearance() {
      if (reappearanceTimer) clearTimeout(reappearanceTimer);
      reappearanceTimer = setTimeout(() => {
        mascot.classList.remove('poofing', 'hidden');
        const defaultX = Math.max(20, window.innerWidth - 160);
        const defaultY = Math.max(20, window.innerHeight - 270);
        applyPosition(defaultX, defaultY);
        if (mascotImgWrap) mascotImgWrap.style.transform = 'scaleX(1)';
        if (mascotArrowBadge) mascotArrowBadge.style.transform = 'rotate(180deg)';
        isVisible = true;
      }, 10000);
    }

    function dismissMascot() {
      if (hasMoved || !isVisible) return;
      isVisible = false;
      mascot.classList.add('poofing');

      const emojis = ['🍉', '💦', '💥', '✨', '🍉'];
      emojis.forEach((emoji) => {
        const p = document.createElement('span');
        p.className = 'mascot-particle';
        p.textContent = emoji;
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 140}px`);
        p.style.setProperty('--dy', `${(Math.random() - 0.5) * 140}px`);
        p.style.setProperty('--rot', `${Math.random() * 360}deg`);
        mascot.appendChild(p);
        setTimeout(() => p.remove(), 450);
      });

      playClick();

      setTimeout(() => {
        mascot.classList.add('hidden');
        mascot.classList.remove('poofing');
        scheduleReappearance();
      }, 450);
    }

    mascot.addEventListener('click', dismissMascot);

    function startDrag(clientX, clientY) {
      isDragging = true;
      hasMoved = false;
      dragStartX = clientX;
      dragStartY = clientY;
      initialX = posX;
      initialY = posY;
      mascot.classList.add('dragging');
    }

    function moveDrag(clientX, clientY) {
      if (!isDragging) return;
      const dx = clientX - dragStartX;
      const dy = clientY - dragStartY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMoved = true;
      }

      const maxX = window.innerWidth - mascot.offsetWidth - 10;
      const maxY = window.innerHeight - mascot.offsetHeight - 10;
      const newX = Math.max(10, Math.min(maxX, initialX + dx));
      const newY = Math.max(10, Math.min(maxY, initialY + dy));

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (mascotArrowBadge) {
          mascotArrowBadge.style.transform = `rotate(${angle}deg)`;
        }

        if (mascotImgWrap) {
          if (dx < -2) {
            mascotImgWrap.style.transform = 'scaleX(1)';
          } else if (dx > 2) {
            mascotImgWrap.style.transform = 'scaleX(-1)';
          } else {
            mascotImgWrap.style.transform = newX < window.innerWidth / 2 ? 'scaleX(-1)' : 'scaleX(1)';
          }
        }
      }

      applyPosition(newX, newY);
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      mascot.classList.remove('dragging');

      // Magnetic edge snap (never stay in center)
      const mascotW = mascot.offsetWidth || 135;
      const mascotH = mascot.offsetHeight || 215;
      const centerX = posX + mascotW / 2;
      const isLeft = centerX < window.innerWidth / 2;

      const snapX = isLeft ? 10 : window.innerWidth - mascotW - 10;
      const snapY = Math.max(20, Math.min(window.innerHeight - mascotH - 40, posY));

      if (mascotImgWrap) {
        mascotImgWrap.style.transform = isLeft ? 'scaleX(-1)' : 'scaleX(1)';
      }
      if (mascotArrowBadge) {
        mascotArrowBadge.style.transform = isLeft ? 'rotate(0deg)' : 'rotate(180deg)';
      }

      applyPosition(snapX, snapY);
    }

    mascot.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      moveDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', endDrag);

    mascot.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches && e.touches[0]) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', endDrag);
  }
});
