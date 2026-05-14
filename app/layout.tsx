import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";
import SteampunkNav from "./components/SteampunkNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brass & Tick — Steam Chronometers",
  description: "A steampunk watch boutique of brass, gears, and fine timekeeping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#120d09] text-[#f0e6d2]">
        <SteampunkNav />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
