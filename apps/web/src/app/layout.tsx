import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, Work_Sans } from "next/font/google";
import { TopBar } from "@/components/top-bar";
import "./globals.css";

// latin-ext is required for Polish diacritics.
const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-work-sans",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Runo Map",
  description: "Społecznościowa mapa grzybów w Polsce",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pl" className={`${workSans.variable} ${instrumentSerif.variable}`}>
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
