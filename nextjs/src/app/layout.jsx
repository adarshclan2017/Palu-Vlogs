import './globals.css';
import { connectDB } from '@/lib/db';
import dataStore from '@/lib/dataStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WatermelonMascot from '@/components/WatermelonMascot';
import IdleSleepAnimation from '@/components/IdleSleepAnimation';
import CursorTrail from '@/components/CursorTrail';
import EasterEgg from '@/components/EasterEgg';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';

export const metadata = {
  title: 'Palu Vlogs — Unscripted Road Trips & Memories',
  description: "Official YouTube Vlog portal for Palu Vlogs. A group of teams and friends from Kanniyakumari. It's not about the views, it's about the memories.",
  keywords: 'Palu Vlogs, Kanniyakumari, Road Trip, YouTube Vlogger, Memories',
  manifest: '/manifest.json',
  themeColor: '#f59e0b',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Palu Vlogs'
  },
  openGraph: {
    title: 'Palu Vlogs — Kanniyakumari Squad',
    description: "It's not about the views, it's about the memories — Palu Vlogs from Kanniyakumari.",
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
        <CursorTrail />
        <Navbar initialSettings={initialSettings} />
        <main>{children}</main>
        <Footer initialSettings={initialSettings} />
        <WatermelonMascot />
        <IdleSleepAnimation />
        <EasterEgg />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
