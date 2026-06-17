import type { Metadata } from "next";
import { Toaster } from 'sonner'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Duunify - Työhakemusten hallinta",
  description: "Hallitse työhakemuksesi helposti Duunify-sovelluksella. Seuraa hakemuksiasi, tallenna muistiinpanoja ja pysy ajan tasalla työnhaussasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}
  <Toaster
  position="top-center"
  richColors
  expand
  duration={4000}
        />
      </body>
    </html>
  );
}
