import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ModalProvider } from "@/components/logout/ModalProvider";
import AppToaster from "@/components/ui/AppToaster";
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
  description:
    "Hallitse työhakemuksesi helposti Duunify-sovelluksella. Seuraa hakemuksiasi, tallenna muistiinpanoja ja pysy ajan tasalla työnhaussasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ModalProvider>{children}</ModalProvider>
        <AppToaster />
      </body>
    </html>
  );
}