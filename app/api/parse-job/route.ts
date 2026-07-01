import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { ratelimit } from "../../../lib/ratelimit";
import { createClient } from "@/lib/supabase-server";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function isAllowedJobSite(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return [
      "duunitori.fi",
      "www.duunitori.fi",
      "tyomarkkinatori.fi",
      "www.tyomarkkinatori.fi",
    ].includes(hostname);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("USER:", user);
    console.log("ERROR:", Error);

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

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    if (!isAllowedJobSite(url)) {
      return NextResponse.json(
        { error: "Unsupported job site" },
        { status: 400 },
      );
    }

    // 8s timeout
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 8000);

    let response: Response;

    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Site returned ${response.status}`,
        },
        {
          status: 502,
        },
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
      } catch {
        // Ignore broken JSON-LD blocks
      }
    });

    if (!jobData) {
      console.warn("JobPosting not found:", url);

      return NextResponse.json(
        { error: "JobPosting not found" },
        { status: 404 },
      );
    }

    let company = jobData.hiringOrganization?.name || "";

    company = company
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(" ");

    const location = jobData.jobLocation?.address?.addressLocality || "";

    const salaryMin = jobData.baseSalary?.value?.minValue || null;

    const salaryMax = jobData.baseSalary?.value?.maxValue || null;

    const employmentType = jobData.employmentType || "";

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

    // estetään valtavat payloadit
    description = description.slice(0, 15000);

    return NextResponse.json({
      title,
      company,
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
        {
          error: "Request timeout while fetching job ad",
        },
        {
          status: 408,
        },
      );
    }

    console.error("Job parser error:", error);

    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
