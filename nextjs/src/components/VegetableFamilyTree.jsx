'use client';
import React, { useState } from 'react';

// Pre-defined hierarchy roles matching user prompt & gallery database
const HIERARCHY = {
  founder: {
    key: 'potato',
    match: ['potato', 'pototo'],
    defaultName: 'Potato Star',
    emoji: '🥔',
    title: 'Founder & MD',
    caption: 'Founder and MD of Palu Vlogs — The mastermind behind the chaos',
    level: 1,
    tag: 'Founder',
    badgeColor: '#f59e0b'
  },
  ceo: {
    key: 'watermelon',
    match: ['watermelon'],
    defaultName: 'Watermelon Star',
    emoji: '🍉',
    title: 'CEO',
    caption: 'Chief Executive Officer — Big ideas & juicy entertainment',
    level: 2,
    tag: 'CEO',
    badgeColor: '#ef4444'
  },
  managerLeft: {
    key: 'coconut',
    match: ['coconut'],
    defaultName: 'Coconut Star',
    emoji: '🥥',
    title: 'General Manager',
    caption: 'Personal Advisor & Manager — Gives advice but no one cares 😉',
    level: 2,
    tag: 'Manager',
    badgeColor: '#d97706'
  },
  managerRight: {
    key: 'carrot',
    match: ['carrot'],
    defaultName: 'Carrot Star',
    emoji: '🥕',
    title: 'IT & Media Manager',
    caption: 'IT Support & Social Media Support Manager',
    level: 2,
    tag: 'Manager',
    badgeColor: '#f97316'
  },
  managerRight2: {
    key: 'drumstick',
    match: ['drumstick'],
    defaultName: 'Drumstick Star',
    emoji: '🥖',
    title: 'Trip Organiser',
    caption: 'International Trip Organiser & Logistics Master',
    level: 2,
    tag: 'Organiser',
    badgeColor: '#10b981'
  },
  team: [
    {
      key: 'beetroot',
      match: ['beetroot'],
      defaultName: 'Beetroot Star',
      emoji: '📱',
      title: 'iPhone Cameraman',
      caption: 'The steady hands capturing every unscripted high-speed turn',
      wing: 'Camera & Tech'
    },
    {
      key: 'cucumber',
      match: ['cucumber'],
      defaultName: 'Cucumber Star',
      emoji: '🎬',
      title: 'Vlog Editor',
      caption: 'Cutting the chaos into weekly masterpieces',
      wing: 'Camera & Tech'
    },
    {
      key: 'ladiesfinger',
      match: ['ladies finger', 'ladiesfinger'],
      defaultName: 'Ladies Finger',
      emoji: '🛡️',
      title: 'Security Head',
      caption: 'National & International Security Support for the Team',
      wing: 'Camera & Tech'
    },
    {
      key: 'onion',
      match: ['onion'],
      defaultName: 'Onion Star',
      emoji: '📊',
      title: 'Budget Planner',
      caption: 'Trip Advisor & Budget Planner (making sure we afford chai)',
      wing: 'Chaos & Dialogue'
    },
    {
      key: 'pumpkin',
      match: ['pumpkin'],
      defaultName: 'Pumpkin Star',
      emoji: '🗣️',
      title: 'Dialogue Delivery',
      caption: 'Master of high-energy punchlines and loud reactions',
      wing: 'Chaos & Dialogue'
    },
    {
      key: 'brinjal',
      match: ['brinjal'],
      defaultName: 'Brinjal Star',
      emoji: '🔊',
      title: 'Political Speaker',
      caption: 'Official Spokesperson & Soapbox Speaker in Vlogs',
      wing: 'Chaos & Dialogue'
    },
    {
      key: 'cauliflower',
      match: ['cauliflower'],
      defaultName: 'Cauliflower Star',
      emoji: '🙏',
      title: 'Spiritual Support',
      caption: 'Spiritual & Mental Support when trips go wildly off-track',
      wing: 'Special Roles'
    },
    {
      key: 'cabbage',
      match: ['cabbage'],
      defaultName: 'Cabbage Star',
      emoji: '🐣',
      title: 'In Probation',
      caption: 'Still in probation period — performance evaluation pending',
      wing: 'Special Roles'
    },
    {
      key: 'tomato',
      match: ['tomato'],
      defaultName: 'Tomato Star',
      emoji: '🍅',
      title: 'Cameo Star',
      caption: 'Cameo star appearing for unannounced guest moments',
      wing: 'Special Roles'
    },
    {
      key: 'brocolli',
      match: ['brocolli', 'broccoli'],
      defaultName: 'Broccoli Star',
      emoji: '🥦',
      title: 'Guest Role',
      caption: 'Special Guest Star with fresh comedy bits',
      wing: 'Special Roles'
    }
  ]
};

export default function VegetableFamilyTree({ photos = [], onSelectPhoto }) {
  const [activeStar, setActiveStar] = useState(null);

  // Helper to find photo for a character definition
  const findPhoto = (def) => {
    if (!photos || photos.length === 0) return null;
    return photos.find((p) => {
      const titleLower = (p.title || '').toLowerCase();
      return def.match.some((m) => titleLower.includes(m));
    });
  };

  const founderPhoto = findPhoto(HIERARCHY.founder);
  const ceoPhoto = findPhoto(HIERARCHY.ceo);
  const managerLeftPhoto = findPhoto(HIERARCHY.managerLeft);
  const managerRightPhoto = findPhoto(HIERARCHY.managerRight);
  const managerRight2Photo = findPhoto(HIERARCHY.managerRight2);

  const handleNodeClick = (def, photo) => {
    setActiveStar(def);
    if (photo && onSelectPhoto) {
      onSelectPhoto(photo);
    }
  };

  // Render a character tree node matching the reference image layout
  const renderNode = (def, photo, isCrown = false, customSize = 'normal') => {
    const imgUrl = photo?.imageUrl || '';
    const name = photo?.title ? photo.title.replace(/[🥔🍉🥥🥕🥖🥬🥦🍅✨⭐]/g, '').trim() : def.defaultName;

    return (
      <div
        className={`vtree-node ${customSize} ${activeStar?.key === def.key ? 'active' : ''}`}
        onClick={() => handleNodeClick(def, photo)}
        title={`${name} — ${def.title}: ${photo?.caption || def.caption}`}
        role="button"
        tabIndex={0}
      >
        {isCrown && <div className="vtree-crown">👑</div>}

        {/* Circular Avatar */}
        <div className="vtree-avatar-frame">
          {imgUrl ? (
            <img src={imgUrl} alt={name} className="vtree-avatar-img" />
          ) : (
            <div className="vtree-avatar-fallback">{def.emoji}</div>
          )}
          <span className="vtree-badge-emoji">{def.emoji}</span>
        </div>

        {/* Character Name */}
        <div className="vtree-char-name">{name}</div>

        {/* Ribbon Banner with notched ends like the user's reference diagram */}
        <div className="vtree-ribbon">
          <span className="ribbon-tail left" />
          <span className="ribbon-text">{def.title}</span>
          <span className="ribbon-tail right" />
        </div>

        {/* Mini hover caption */}
        <div className="vtree-tooltip">
          <strong>{name}</strong>
          <span className="vtree-tooltip-role">{def.title}</span>
          <p>{photo?.caption || def.caption}</p>
        </div>
      </div>
    );
  };

  return (
    <section className="vtree-section">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="kicker">Official Squad Hierarchy</span>
          <h2 style={{ fontSize: '38px', color: 'var(--cream)', letterSpacing: '0.02em' }}>
            The Vegetable Gang Family Tree
          </h2>
          <p style={{ maxWidth: '680px', margin: '0 auto', color: 'var(--stone)', fontSize: '15.5px' }}>
            From Founder Potato Star at the top, to CEO Watermelon and the executive managers — here is the official organizational chart of Palu Vlogs! Click any star to view their profile.
          </p>
        </div>

        {/* ── TREE CANVAS CONTAINER ── */}
        <div className="vtree-container">
          <div className="vtree-chart">
            {/* ═════════ LEVEL 1: FOUNDER (POTATO STAR) ═════════ */}
            <div className="vtree-level level-1">
              <div className="vtree-group-box founder-box">
                <span className="vtree-level-label">⭐ FOUNDER & MD</span>
                {renderNode(HIERARCHY.founder, founderPhoto, true, 'large')}
              </div>
            </div>

            {/* Direct vertical connecting stem: Founder -> ONLY CEO */}
            <div className="vtree-stem-vertical stem-founder-to-ceo" />

            {/* ═════════ LEVEL 2: ONLY CEO UNDER FOUNDER ═════════ */}
            <div className="vtree-level level-2-ceo">
              <div className="vtree-group-box ceo-box">
                <span className="vtree-level-label ceo-label">🍉 CHIEF EXECUTIVE OFFICER</span>
                {renderNode(HIERARCHY.ceo, ceoPhoto, false, 'large')}
              </div>
            </div>

            {/* Connecting stem from CEO down to the Two Managers Wings */}
            <div className="vtree-stem-vertical stem-ceo-to-managers" />

            {/* Horizontal crossbar branching out from CEO into Left & Right sides */}
            <div className="vtree-crossbar crossbar-managers" />

            {/* ═════════ LEVEL 3: TWO SIDES MANAGERS (UNDER CEO) ═════════ */}
            <div className="vtree-level level-3-managers">
              {/* Left Side Manager: Coconut Star */}
              <div className="vtree-branch branch-left">
                <div className="vtree-stem-drop" />
                <span className="vtree-role-tag advisor">🥥 Left Wing · Advisory Manager</span>
                {renderNode(HIERARCHY.managerLeft, managerLeftPhoto, false, 'medium')}
              </div>

              {/* Right Side Managers: Carrot Star & Drumstick Star */}
              <div className="vtree-branch branch-right">
                <div className="vtree-stem-drop" />
                <span className="vtree-role-tag operations">🥕🥖 Right Wing · Operations Managers</span>
                <div className="vtree-sub-row">
                  {renderNode(HIERARCHY.managerRight, managerRightPhoto, false, 'medium')}
                  {renderNode(HIERARCHY.managerRight2, managerRight2Photo, false, 'medium')}
                </div>
              </div>
            </div>

            {/* Connecting vertical stem from Managers down to Squad */}
            <div className="vtree-stem-vertical stem-managers-to-squad" />

            {/* ═════════ LEVEL 4: THE SQUAD & CREW (UNDER MANAGERS) ═════════ */}
            <div className="vtree-crossbar crossbar-squad" />

            <div className="vtree-level level-4-squad">
              <div className="vtree-team-grid">
                {HIERARCHY.team.map((member) => {
                  const photo = findPhoto(member);
                  return (
                    <div key={member.key} className="vtree-team-item">
                      <div className="vtree-stem-drop small" />
                      {renderNode(member, photo, false, 'compact')}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tree Footer Legend */}
        <div className="vtree-legend">
          <div className="legend-chip">
            <span className="dot founder" /> Founder: Potato Star 🥔
          </div>
          <div className="legend-chip">
            <span className="dot ceo" /> CEO: Watermelon Star 🍉
          </div>
          <div className="legend-chip">
            <span className="dot manager" /> Managers: Coconut 🥥 · Carrot 🥕 · Drumstick 🥖
          </div>
          <div className="legend-chip">
            <span className="dot crew" /> 10 Squad Crew Members
          </div>
        </div>
      </div>
    </section>
  );
}
