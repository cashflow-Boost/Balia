import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balia — le système d'exploitation IA de l'immobilier",
  description:
    "Balia fait le travail répétitif à votre place, et fait performer chaque collaborateur comme votre meilleur élément.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
