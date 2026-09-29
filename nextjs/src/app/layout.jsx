import './globals.css';
import { connectDB } from '@/lib/db';
import dataStore from '@/lib/dataStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WatermelonMascot from '@/components/WatermelonMascot';

export const metadata = {
  title: 'Palu Vlogs — Official YouTube Vlogger Portal',
  description: 'Official YouTube Vlog website for Palu Vlogs and the Vegetable Gang. Watch latest road trips, Kerala adventures, and browse behind the scenes.',
  keywords: 'Palu Vlogs, Vegetable Gang, Kerala, YouTube, Road Trip, Vlog',
  openGraph: {
    title: 'Palu Vlogs — Vegetable Gang',
    description: 'Fun · Vibes · Memories · Chaos from Kerala',
    type: 'website',
  },
};

export default async function RootLayout({ children }) {
  await connectDB(8000).catch(() => {});
  const rawSettings = await dataStore.getSettings().catch(() => null);
  const initialSettings = rawSettings ? JSON.parse(JSON.stringify(rawSettings)) : null;

  return (
    <html lang="en">
      <body>
        <Navbar initialSettings={initialSettings} />
        <main>{children}</main>
        <Footer initialSettings={initialSettings} />
        <WatermelonMascot />
      </body>
    </html>
  );
}
