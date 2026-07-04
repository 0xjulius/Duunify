import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SimpleNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="rounded flex joverflow-hidden">
           <img
                src="/favicon.ico"
                alt="Duunify logo"
                className="w-8 h-8 object-contain rounded"
              />

          <span className="font-bold text-slate-900 text-lg ml-2 mt-0.5">
            Duunify
          </span>
        </Link>

        {/* PALAA TAKAISIN -LINKKI JA NAPPI YHDESSÄ */}
        <div className="flex items-center gap-5">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} /> Palaa takaisin
          </Link>

        </div>
      </div>
    </header>
  );
}