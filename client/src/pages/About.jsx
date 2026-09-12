import React from 'react';

const About = () => {
  return (
    <div className="section-pad">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Who We Are</span>
          <h2>The Palu Vlogs Journey</h2>
          <p>
            No scripts. No corporate sponsors. Just four friends on a mission to document Kerala's most beautiful roads and chaotic moments.
          </p>
        </div>

        <div className="about-hero-grid" style={{ marginBottom: '60px' }}>
          <div className="about-img-frame">
            <img src="/assets/images/about_roadtrip.jpg" alt="Palu Vlogs Squad on NH 66" />
          </div>

          <div>
            <h3 style={{ fontSize: '32px', color: 'var(--gold)', marginBottom: '14px' }}>
              How It All Began
            </h3>
            <p style={{ color: 'var(--stone)', fontSize: '16px', lineHeight: 1.7, marginBottom: '14px' }}>
              Back in 2024, our road trips were just casual weekends exploring Munnar, Wayanad, and the backwaters on two secondhand scooters. We mounted a budget action camera on a helmet and uploaded the raw footage to YouTube under the name <strong>Oru Palu Vlogs</strong> ("Palu" meaning chaotic/broken plans that somehow work out).
            </p>
            <p style={{ color: 'var(--stone)', fontSize: '16px', lineHeight: 1.7, marginBottom: '14px' }}>
              During a trip to an Ernakulam festival, Potato Star bought an eggplant suit as a dare. When we stopped at a roadside tea stall in full costume, the reactions from the locals were so hilarious and wholesome that we made a vow: <em>every member gets a vegetable persona</em>.
            </p>
            <p style={{ color: 'var(--cream)', fontSize: '16px', fontWeight: 600, lineHeight: 1.7 }}>
              Today, the Vegetable Gang has grown to 11 characters, 125,000+ subscribers, and over 4.8 million views across our episodes.
            </p>
          </div>
        </div>

        {/* The 4 Core Friends */}
        <div style={{ background: 'var(--panel)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', marginBottom: '60px' }}>
          <h3 style={{ fontSize: '28px', color: 'var(--cream)', marginBottom: '24px', textAlign: 'center' }}>
            Meet The Core Crew
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
            <div>
              <img src="/assets/images/gang_potato.jpg" alt="Potato Star" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid var(--gold)', objectFit: 'cover' }} />
              <h4 style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--gold)' }}>Potato Star</h4>
              <p style={{ fontSize: '12px', color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700 }}>Host & Chaos Driver</p>
            </div>
            <div>
              <img src="/assets/images/gang_brinjal.jpg" alt="Brinjal Star" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid var(--gold)', objectFit: 'cover' }} />
              <h4 style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--gold)' }}>Brinjal Star</h4>
              <p style={{ fontSize: '12px', color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700 }}>Producer & Channel Admin</p>
            </div>
            <div>
              <img src="/assets/images/gang_cauliflower.jpg" alt="Cauliflower Star" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid var(--gold)', objectFit: 'cover' }} />
              <h4 style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--gold)' }}>Cauliflower Star</h4>
              <p style={{ fontSize: '12px', color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700 }}>Spiritual Guide & Luck</p>
            </div>
            <div>
              <img src="/assets/images/gang_drumstick.jpg" alt="Drumstick Star" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid var(--gold)', objectFit: 'cover' }} />
              <h4 style={{ fontFamily: 'Anton', fontSize: '18px', color: 'var(--gold)' }}>Drumstick Star</h4>
              <p style={{ fontSize: '12px', color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700 }}>Speed Cameos & Sound</p>
            </div>
          </div>
        </div>

        {/* Gear & Tools */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{ background: 'var(--panel-2)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <h4 style={{ fontFamily: 'Anton', fontSize: '22px', color: 'var(--gold)', marginBottom: '14px' }}>
              🎥 The Production Gear
            </h4>
            <ul className="about-features-list">
              <li className="about-feature-item">Sony FX3 & A7 IV with 24-70mm GM II lens</li>
              <li className="about-feature-item">GoPro Hero 12 Black mounted on helmet for road POV</li>
              <li className="about-feature-item">DJI Mini 4 Pro drone for aerial Kerala landscapes</li>
              <li className="about-feature-item">Rode Wireless PRO mics with wind deadcats for high-speed riding</li>
              <li className="about-feature-item">Apple M3 Max MacBook Pro with DaVinci Resolve Studio</li>
            </ul>
          </div>

          <div style={{ background: 'var(--panel-2)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <h4 style={{ fontFamily: 'Anton', fontSize: '22px', color: 'var(--gold)', marginBottom: '14px' }}>
              🏆 Channel Milestones
            </h4>
            <ul className="about-features-list">
              <li className="about-feature-item"><strong>May 2024:</strong> First video uploaded (The Scooter Experiment)</li>
              <li className="about-feature-item"><strong>Nov 2024:</strong> 10,000 Subscribers milestone achieved</li>
              <li className="about-feature-item"><strong>June 2025:</strong> 50,000 Subscribers & YouTube Silver Creator Award</li>
              <li className="about-feature-item"><strong>Jan 2026:</strong> 100,000 Subscribers & 4.5M+ total views</li>
              <li className="about-feature-item"><strong>Present:</strong> Season 2 Live with 11 Vegetable Stars!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
