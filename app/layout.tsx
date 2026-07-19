import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Balia — le système d’exploitation IA de l’immobilier',
  description: 'Balia fait le travail répétitif ; vous validez et décidez.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link href="/" className="brand">
              Balia<small>ça fait le taf — vous validez</small>
            </Link>
            <nav>
              <Link href="/">Tableau de bord</Link>
              <Link href="/annonces">Nouvelle annonce</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
