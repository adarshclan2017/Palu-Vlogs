import './globals.css';
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WatermelonMascot />
      </body>
    </html>
  );
}
