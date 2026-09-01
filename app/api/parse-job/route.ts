import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { ratelimit } from "../../../lib/ratelimit";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const preferredRegion = ["arn1"];
export const dynamic = "force-dynamic";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
];

function isAllowedJobSite(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const allowedDomains = ["duunitori.fi", "tyomarkkinatori.fi", "jobly.fi"];

    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith("." + domain)
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

function cleanDescription(rawHtml: string): string {
  if (!rawHtml) return "";
  return rawHtml
    .replace(/\\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<(b|strong)[^>]*>/gi, "**")
    .replace(/<\/(b|strong)>/gi, "**")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .split("\n")
    .map((line: string) => line.trim().replace(/^[-*]\s+/, "• "))
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 15000);
}

// Jobly-kohtainen ohitus (Cloudflare-suojauksen purkuun)
async function fetchJoblyHtml(targetUrl: string): Promise<string> {
  const scraperApiKey = process.env.SCRAPER_API_KEY;

  if (scraperApiKey) {
    const scraperUrl = `https://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(
      targetUrl
    )}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(scraperUrl, {
        signal: controller.signal,
        headers: {
          "Accept-Language": "fi-FI,fi;q=0.9,en;q=0.8",
        },
      });

      if (!res.ok) {
        throw new Error(`ScraperAPI palautti virheen: ${res.status}`);
      }

      return await res.text();
    } finally {
      clearTimeout(timeout);
    }
  }

  const isVercel = process.env.VERCEL === "1";
  let browser = null;

  try {
    if (isVercel) {
      const executablePath = await chromium.executablePath();
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: { width: 1280, height: 720 },
        executablePath,
        headless: true,
      });
    } else {
      const puppeteerModule = await import("puppeteer");
      const localPuppeteer = puppeteerModule.default || puppeteerModule;

      browser = await localPuppeteer.launch({
        headless: true,
        defaultViewport: { width: 1280, height: 720 },
      });
    }

    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENTS[0]);

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    return await page.content();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
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
        { status: 400 }
      );
    }

    let html = "";

    // 1. Jobly haku (ScraperAPI / Puppeteer Cloudflare-ohitukseen)
    if (url.includes("jobly.fi")) {
      try {
        html = await fetchJoblyHtml(url);
      } catch (err: any) {
        console.error("Jobly fetch error:", err);
        return NextResponse.json(
          { error: "Failed to bypass Jobly anti-bot protection" },
          { status: 502 }
        );
      }
    } else {
      // 2. Duunitori & Työmarkkinatori (nopea suora fetch)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const randomUserAgent =
        USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

      let response: Response;
      try {
        response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": randomUserAgent,
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
          { status: 502 }
        );
      }
      html = await response.text();
    }

    const $ = cheerio.load(html);
    let jobData: any = null;

    // Haetaan JSON-LD-skripti
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const content = $(element).html();
        if (!content) return;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed)) {
          const job = parsed.find(
            (item: any) => item["@type"] === "JobPosting"
          );
          if (job) jobData = job;
        } else if (parsed["@graph"]) {
          const job = parsed["@graph"].find(
            (item: any) => item["@type"] === "JobPosting"
          );
          if (job) jobData = job;
        } else if (parsed["@type"] === "JobPosting") {
          jobData = parsed;
        }
      } catch {}
    });

    // Työmarkkinatori-varajärjestelmä (fallback OpenGraph-metatiedoista, jos JSON-LD puuttuu)
    const title =
      jobData?.title ||
      $('meta[property="og:title"]').attr("content") ||
      $("h1").first().text().trim() ||
      $("title").text().trim();

    const company =
      jobData?.hiringOrganization?.name?.trim() ||
      $('meta[property="og:site_name"]').attr("content") ||
      "";

    const logoData = jobData?.hiringOrganization?.logo;
    const companyLogo =
      typeof logoData === "object" ? logoData?.url : logoData || null;

    let location = "";
    if (Array.isArray(jobData?.jobLocation)) {
      location = jobData.jobLocation
        .map((loc: any) =>
          typeof loc === "string" ? loc : loc?.address?.addressLocality
        )
        .filter(Boolean)
        .join(", ");
    } else if (typeof jobData?.jobLocation === "string") {
      location = jobData.jobLocation;
    } else {
      location = jobData?.jobLocation?.address?.addressLocality || "";
    }

    const salaryMin = jobData?.baseSalary?.value?.minValue || null;
    const salaryMax = jobData?.baseSalary?.value?.maxValue || null;
    const employmentType = suomennaTyoaika(jobData?.employmentType);
    const validThrough = jobData?.validThrough || "";
    const datePosted = jobData?.datePosted || "";

    const rawDescription =
      jobData?.description ||
      $('meta[property="og:description"]').attr("content") ||
      "";
    const description = cleanDescription(rawDescription);

    if (!title && !description) {
      return NextResponse.json(
        { error: "JobPosting data not found" },
        { status: 404 }
      );
    }

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
        { status: 408 }
      );
    }
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}