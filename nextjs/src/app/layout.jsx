import './globals.css';
import { connectDB } from '@/lib/db';
import dataStore from '@/lib/dataStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WatermelonMascot from '@/components/WatermelonMascot';
import IdleSleepAnimation from '@/components/IdleSleepAnimation';

export const metadata = {
  title: 'Palu Vlogs — Unscripted Road Trips & Memories',
  description: "Official YouTube Vlog portal for Palu Vlogs. A group of teams and friends from Kanniyakumari. It's not about the views, it's about the memories.",
  keywords: 'Palu Vlogs, Kanniyakumari, Road Trip, YouTube Vlogger, Memories',
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
        <Navbar initialSettings={initialSettings} />
        <main>{children}</main>
        <Footer initialSettings={initialSettings} />
        <WatermelonMascot />
        <IdleSleepAnimation />
      </body>
    </html>
  );
}
