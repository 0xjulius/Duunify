export const DEMO_USER = {
  full_name: "Maija Meikäläinen",
  email: "demo@duunify.fi",
  avatar_url: "",
};

export const DEMO_APPLICATIONS = [
  { id: "d1", company: "Wolt", job_title: "Frontend Developer", status: "Haastattelu", location: "Helsinki", applied_date: "2026-06-20", created_at: "2026-06-20T09:00:00Z", valid_through: "2026-07-10" },
  { id: "d2", company: "Supercell", job_title: "Game Designer", status: "Haettu", location: "Helsinki", applied_date: "2026-06-24", created_at: "2026-06-24T11:00:00Z", valid_through: "2026-07-15" },
  { id: "d3", company: "Reaktor", job_title: "Software Engineer", status: "Tallennettu", location: "Etä", applied_date: "2026-06-18", created_at: "2026-06-18T08:30:00Z", valid_through: null },
  { id: "d4", company: "Nordea", job_title: "Data Analyst", status: "Hylätty", location: "Espoo", applied_date: "2026-06-10", created_at: "2026-06-10T14:00:00Z", valid_through: null },
  { id: "d5", company: "Relex Solutions", job_title: "Backend Developer", status: "Tarjous", location: "Helsinki", applied_date: "2026-06-05", created_at: "2026-06-05T10:00:00Z", valid_through: null },
  { id: "d6", company: "Vincit", job_title: "Full Stack Developer", status: "Haastattelu", location: "Tampere", applied_date: "2026-06-27", created_at: "2026-06-27T13:00:00Z", valid_through: "2026-07-05" },
  { id: "d7", company: "Elisa", job_title: "Product Manager", status: "Haettu", location: "Helsinki", applied_date: "2026-06-29", created_at: "2026-06-29T09:15:00Z", valid_through: "2026-07-20" },
  { id: "d8", company: "Fiskars", job_title: "UX Designer", status: "Hylätty", location: "Etä", applied_date: "2026-05-28", created_at: "2026-05-28T09:00:00Z", valid_through: null },
];

export function computeDemoStats() {
  const statsData = DEMO_APPLICATIONS.reduce(
    (acc, app) => {
      const s = app.status?.toLowerCase().trim() || "";
      if (["suosikki", "tallennettu"].includes(s)) acc.favorites++;
      else if (["haastattelu", "interview"].includes(s)) acc.interviews++;
      else if (["tarjous", "offer"].includes(s)) acc.offers++;
      else if (["hylätty", "hylätyt", "rejected"].includes(s)) acc.rejected++;
      else acc.pending++;
      return acc;
    },
    { favorites: 0, interviews: 0, offers: 0, rejected: 0, pending: 0 }
  );

  const totalActive =
    statsData.pending + statsData.interviews + statsData.offers + statsData.rejected;

  return {
    total: totalActive,
    pending: statsData.pending,
    offers: statsData.offers,
    interviews: statsData.interviews,
    rejected: statsData.rejected,
    favorites: statsData.favorites,
    consistency: 71,
  };
}

export function computeDemoLocationStats() {
  const counts: Record<string, number> = {};
  DEMO_APPLICATIONS.forEach((a) => {
    if (a.location) counts[a.location] = (counts[a.location] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}