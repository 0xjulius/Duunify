import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function DemoBanner() {
  return (
    <div
      className="rounded-2xl p-4 flex items-center justify-between gap-4 text-white mb-6"
      style={{ background: "linear-gradient(135deg, #6D67F2, #5750E0)" }}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles size={16} />
        Katselet esikatselua esimerkkidatalla. Tiedot eivät tallennu.
      </div>
      <Link
        href="/"
        className="text-xs font-bold bg-white text-[#5750E0] px-3 py-1.5 rounded-lg shrink-0 hover:bg-indigo-50 transition"
      >
        Luo oma tili
      </Link>
    </div>
  );
}