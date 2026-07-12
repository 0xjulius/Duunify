"use client";

import { useState } from "react";
import DemoSidebar from "@/components/demo/DemoSidebar";
import DemoBanner from "@/components/demo/DemoBanner";
import HistoryClient from "@/components/history/HistoryClient";

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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <DemoSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 p-6 md:p-8">
          <DemoBanner />
          <div className="mt-6">
            <HistoryClient items={items} />
          </div>
        </main>
      </div>
    </div>
  );
}