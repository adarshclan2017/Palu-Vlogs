'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function VisitorBadge({ className = '' }) {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const recordOrFetch = async () => {
      try {
        const hasVisited = typeof window !== 'undefined' ? sessionStorage.getItem('palu_visited') : null;
        let res = null;

        if (!hasVisited) {
          res = await api.recordVisit();
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('palu_visited', 'true');
          }
        } else {
          res = await api.getVisitors();
        }

        if (isMounted && res?.success && res.count) {
          setCount(res.count);
          setLoaded(true);
        }
      } catch (err) {
        if (isMounted) setLoaded(true);
      }
    };

    recordOrFetch();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className={`visitor-counter-badge ${className}`} title="Total verified visitors to Palu Vlogs">
      <span className="visitor-pulse-dot" aria-hidden="true" />
      <span className="visitor-count-text">
        <strong className="visitor-num">{count.toLocaleString()}</strong> Happy Explorers
      </span>
    </div>
  );
}
