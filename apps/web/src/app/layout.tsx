import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MushroomMap",
  description: "Społecznościowa mapa grzybów w Polsce",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
