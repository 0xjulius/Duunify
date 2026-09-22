"use client";

import { useState } from "react";
import DemoSidebar from "@/components/demo/DemoSidebar";
import DemoHeader from "@/components/demo/DemoHeader";
import DemoBanner from "@/components/demo/DemoBanner";
import PageHeader from "@/components/PageHeader";
import HistoryClient from "@/components/history/HistoryClient";
import { History } from "lucide-react";

function daysAgoISO(offsetDays: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function buildDemoHistory() {
  return [
    {
      id: "d1",
      event: "status_changed" as const,
      company: "Wolt",
      jobTitle: "Frontend Developer",
      oldStatus: "Haettu",
      newStatus: "Haastattelu",
      createdAt: daysAgoISO(0, 10, 15),
    },
    {
      id: "d2",
      event: "event_added" as const,
      company: "Wolt",
      jobTitle: "Frontend Developer",
      oldStatus: null,
      newStatus: null,
      createdAt: daysAgoISO(0, 8, 0),
    },
    {
      id: "d3",
      event: "created" as const,
      company: "Supercell",
      jobTitle: "Game Designer",
      oldStatus: null,
      newStatus: null,
      createdAt: daysAgoISO(1, 14, 0),
    },
    {
      id: "d4",
      event: "note_added" as const,
      company: "Reaktor",
      jobTitle: "Software Engineer",
      oldStatus: null,
      newStatus: null,
      createdAt: daysAgoISO(2, 9, 30),
    },
    {
      id: "d5",
      event: "status_changed" as const,
      company: "Nordea",
      jobTitle: "Data Analyst",
      oldStatus: "Haettu",
      newStatus: "Hylätty",
      createdAt: daysAgoISO(4, 16, 45),
    },
    {
      id: "d6",
      event: "created" as const,
      company: "Nordea",
      jobTitle: "Data Analyst",
      oldStatus: null,
      newStatus: null,
      createdAt: daysAgoISO(6, 11, 0),
    },
    {
      id: "d7",
      event: "deleted" as const,
      company: "Fiverr Local Oy",
      jobTitle: "Junior Consultant",
      oldStatus: null,
      newStatus: null,
      createdAt: daysAgoISO(10, 13, 20),
    },
    {
      id: "d8",
      event: "status_changed" as const,
      company: "Vincit",
      jobTitle: "Full Stack Developer",
      oldStatus: "Haastattelu",
      newStatus: "Tarjous",
      createdAt: daysAgoISO(3, 10, 0),
    },
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function DemoHistoryPage() {
  const [items] = useState(() => buildDemoHistory());

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 dark:bg-slate-950 overflow-x-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <DemoSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Yläpalkki reunasta reunaan */}
        <DemoHeader
          userName="Maija Meikäläinen"
          userEmail="maija.meikalainen@demo.fi"
        />

        <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto gap-6 pb-24 lg:pb-10">
          <DemoBanner />

          {/* PageHeader-komponentti */}
          <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800">
            <PageHeader
              title="Aktiviteettihistoria"
              description="Katso aikajanalta kaikki hakemuksiisi tehdyt muutokset ja tapahtumat."
              icon={History}
              isDemo={true}
            />
          </div>

          <div className="mt-2">
            <HistoryClient items={items} />
          </div>
        </main>
      </div>
    </div>
  );
}