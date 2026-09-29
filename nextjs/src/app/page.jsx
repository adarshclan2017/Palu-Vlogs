import React from 'react';
import { connectDB } from '@/lib/db';
import dataStore from '@/lib/dataStore';
import HomePageClient from '@/components/HomePageClient';

// Force dynamic SSR on every request — ensures changes in MongoDB show immediately with zero cache stale
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Palu Vlogs — Unscripted Road Trips, Travel & Vibes',
  description: 'Join Palu Vlogs on unscripted road journeys, street food explorations, and travel across South India.'
};

export default async function Home() {
  await connectDB(8000).catch(() => {});

  const [rawSettings, rawVlogs, rawPhotos, rawLocations] = await Promise.all([
    dataStore.getSettings().catch(() => null),
    dataStore.getVlogs().catch(() => []),
    dataStore.getPhotos().catch(() => []),
    dataStore.getLocations().catch(() => [])
  ]);

  const initialSettings = rawSettings ? JSON.parse(JSON.stringify(rawSettings)) : null;
  const initialVlogs = Array.isArray(rawVlogs) ? JSON.parse(JSON.stringify(rawVlogs)) : [];
  const initialPhotos = Array.isArray(rawPhotos) ? JSON.parse(JSON.stringify(rawPhotos)) : [];
  const initialLocations = Array.isArray(rawLocations) ? JSON.parse(JSON.stringify(rawLocations)) : [];

  return (
    <HomePageClient
      initialSettings={initialSettings}
      initialVlogs={initialVlogs}
      initialPhotos={initialPhotos}
      initialLocations={initialLocations}
    />
  );
}
