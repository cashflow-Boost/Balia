import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balia — l'employé IA qui décroche pour les artisans",
  description:
    "Balia décroche le téléphone à votre place, qualifie, prend le rendez-vous et envoie le devis. Ne ratez plus jamais un client.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
