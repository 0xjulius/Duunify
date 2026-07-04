// app/api/parse-job/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { ratelimit } from "../../../lib/ratelimit";
import { createClient } from "@/lib/supabase-server";

export const preferredRegion = ["arn1", "fra1"];
export const dynamic = "force-dynamic";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
];

function isAllowedJobSite(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const allowedDomains = ["duunitori.fi", "tyomarkkinatori.fi", "jobly.fi"];

    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith("." + domain),
    );
  } catch {
    return false;
  }
}

function suomennaTyoaika(tyyppiInput: any): string {
  if (!tyyppiInput) return "Ei määritelty";

  let tyypit: string[] = [];
  if (Array.isArray(tyyppiInput)) {
    tyypit = tyyppiInput.map((t) => String(t).trim().toUpperCase());
  } else {
    tyypit = String(tyyppiInput)
      .split(",")
      .map((t) => t.trim().toUpperCase());
  }

  const uniikitTyypit = [
    ...new Set(tyypit.filter((t) => t !== "OTHER" && t !== "")),
  ];

  if (uniikitTyypit.length === 1 && uniikitTyypit[0] === "FULL_TIME") {
    return "Kokoaikainen";
  }

  const kaannokset: Record<string, string> = {
    FULL_TIME: "Kokoaikainen",
    PART_TIME: "Osa-aikainen",
    TEMPORARY: "Määräaikainen",
    CONTRACT: "Projekti / Sopimustyö",
  };

  if (uniikitTyypit.length > 0) {
    return uniikitTyypit.map((t) => kaannokset[t] || t).join(", ");
  }

  return "Muu";
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await ratelimit.limit(user.id);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    if (typeof body.url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const url = body.url.trim();
    if (!url || !isAllowedJobSite(url)) {
      return NextResponse.json(
        { error: "Unsupported or missing URL" },
        { status: 400 },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Arvotaan listasta satunnainen selain-tunniste pyyntöä varten
    const randomUserAgent =
      USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    let response: Response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": randomUserAgent,
          // Lisätyt selain-otsikot tekemään pyynnöstä aidomman näköisen
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Site returned ${response.status}` },
        { status: 502 },
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim();

    let jobData: any = null;

    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const content = $(element).html();
        if (!content) return;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed)) {
          const job = parsed.find(
            (item: any) => item["@type"] === "JobPosting",
          );
          if (job) jobData = job;
        } else if (parsed["@graph"]) {
          const job = parsed["@graph"].find(
            (item: any) => item["@type"] === "JobPosting",
          );
          if (job) jobData = job;
        } else if (parsed["@type"] === "JobPosting") {
          jobData = parsed;
        }
      } catch {}
    });

    if (!jobData) {
      return NextResponse.json(
        { error: "JobPosting not found" },
        { status: 404 },
      );
    }

    const rawCompany = jobData.hiringOrganization?.name?.trim() || "";
    const company = rawCompany
      ? rawCompany
          .toLowerCase()
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";

    const logoData = jobData.hiringOrganization?.logo;
    const companyLogo =
      typeof logoData === "object" ? logoData?.url : logoData || null;

    let location = "";
    if (Array.isArray(jobData.jobLocation)) {
      location = jobData.jobLocation
        .map((loc: any) => loc?.address?.addressLocality)
        .filter(Boolean)
        .join(", ");
    } else {
      location = jobData.jobLocation?.address?.addressLocality || "";
    }

    const salaryMin = jobData.baseSalary?.value?.minValue || null;
    const salaryMax = jobData.baseSalary?.value?.maxValue || null;

    const employmentType = suomennaTyoaika(jobData.employmentType);

    const validThrough = jobData.validThrough || "";
    const datePosted = jobData.datePosted || "";

    let description = jobData.description || "";
    description = description
      .replace(/\\n/g, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<(b|strong)[^>]*>/gi, "**")
      .replace(/<\/(b|strong)>/gi, "**")
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<\/p>/gi, "\n\n")
      .split("\n")
      .map((line: string) => line.trim().replace(/^[-*]\s+/, "• "))
      .join("\n")
      .replace(/<[^>]*>/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    description = description.slice(0, 15000);

    return NextResponse.json({
      title,
      company,
      companyLogo,
      location,
      description,
      salaryMin,
      salaryMax,
      employmentType,
      validThrough,
      datePosted,
    });
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout while fetching job ad" },
        { status: 408 },
      );
    }
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
