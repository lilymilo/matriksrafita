import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const geistSans = localFont({
  src: './fonts/geist-latin.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/geist-mono-latin.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'IdeaQuest 3.0 — Banyak ide. Pilih yang paling berdampak. | LKPD 5',
  description:
    'Bandingkan sepuluh ide dari sisi kelayakan dan dampaknya. Studio evaluasi ideasi SCAMPER & Matriks Prioritas LKPD 5 kelas 11 PPLG 3.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a href="#matriks-prioritas" className="skip-link">
          Langsung ke Matriks Prioritas
        </a>
        {children}
      </body>
    </html>
  );
}
