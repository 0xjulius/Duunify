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
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-center"
          expand
          duration={4000}
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "duunify-toast flex items-start gap-3 w-full max-w-sm rounded-2xl border px-4 py-3.5 shadow-lg shadow-slate-900/5 bg-white border-slate-200",
              title: "text-[14px] font-semibold text-slate-900 leading-snug",
              description: "text-[13px] text-slate-500 mt-0.5 leading-relaxed",
              actionButton:
                "!bg-[#6D67F2] !text-white !text-xs !font-bold !px-3 !py-1.5 !rounded-lg !ml-auto",
              cancelButton:
                "!bg-slate-100 !text-slate-600 !text-xs !font-medium !px-3 !py-1.5 !rounded-lg",
              closeButton:
                "!bg-white !border-slate-200 !text-slate-400 hover:!text-slate-600 !rounded-full",
              success: "!border-emerald-100 !bg-emerald-50/90",
              error: "!border-rose-100 !bg-rose-50/90",
              warning: "!border-amber-100 !bg-amber-50/90",
              loading: "!border-[#E2E0FB] !bg-[#6D67F2]/[0.05]",
            },
          }}
        />
      </body>
    </html>
  );
}