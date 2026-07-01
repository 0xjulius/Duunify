import { ArrowLeft, History, Clock, FileText, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

const MOCK_HISTORY = [
  {
    id: "1",
    type: "status_change",
    title: "Tila päivitetty: Haastatteluun",
    date: "2026-07-01T10:30:00",
    description: "Rekrytoija päivitti tilan haastatteluvaiheeseen.",
    user: "Rekrytoija"
  },
  {
    id: "2",
    type: "note",
    title: "Lisätty muistiinpano",
    date: "2026-06-29T14:15:00",
    description: "Lähetetty lisäkysymyksiä palkkatoiveesta sähköpostitse.",
    user: "Minä"
  },
  {
    id: "3",
    type: "email_sent",
    title: "Sähköposti lähetetty",
    date: "2026-06-28T09:45:00",
    description: "Lähetin kiitosviestin hakemuksen vastaanottamisesta.",
    user: "Minä"
  },
  {
    id: "4",
    type: "created",
    title: "Hakemus luotu",
    date: "2026-06-25T09:00:00",
    description: "Hakemus lisätty järjestelmään duunify-palvelun kautta.",
    user: "Automaatio"
  }
];

export default async function ApplicationHistoryPage({ params }: { params: { id: string } }) {
  const { id } = await params; // Next.js 15+ vaatii awaitin paramsille

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft size={16} /> Takaisin koontinäyttöön
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Historiatiedot</h1>
        <p className="text-slate-500 mt-1">Hakemuksen ID: {id} • Kaikki tapahtumat aikajärjestyksessä</p>
      </div>

      <div className="space-y-0">
        {MOCK_HISTORY.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 z-10">
                {item.type === "created" && <History size={16} />}
                {item.type === "status_change" && <CheckCircle2 size={16} />}
                {item.type === "note" && <FileText size={16} />}
                {item.type === "email_sent" && <Mail size={16} />}
              </div>
              {index !== MOCK_HISTORY.length - 1 && (
                <div className="w-0.5 h-full bg-slate-200 my-2" />
              )}
            </div>
            
            <div className="pb-8">
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{new Date(item.date).toLocaleString("fi-FI")}</span>
                <span>•</span>
                <span>{item.user}</span>
              </div>
              <p className="text-sm text-slate-600 mt-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}