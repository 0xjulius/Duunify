import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = body.url

    if (!url) {
      return NextResponse.json(
        { error: 'Missing URL' },
        { status: 400 }
      )
    }

    // Lisätty kattavampi User-Agent, jotta sivut eivät estä pyyntöä
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    const html = await response.text()
    const $ = cheerio.load(html)

    // Haetaan otsikko: yritetään ensin h1, sitten title-tägi
    const title = $('h1').first().text().trim() || $('title').text().trim()

    let jobData: any = null

    // Vankempi JSON-LD haku
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const content = $(element).html()
        if (!content) return

        const parsed = JSON.parse(content)

        // Joillain sivuilla JSON-LD on array tai @graph-rakenne
        if (Array.isArray(parsed)) {
          const job = parsed.find((item: any) => item['@type'] === 'JobPosting')
          if (job) jobData = job
        } else if (parsed['@graph']) {
          const job = parsed['@graph'].find((item: any) => item['@type'] === 'JobPosting')
          if (job) jobData = job
        } else if (parsed['@type'] === 'JobPosting') {
          jobData = parsed
        }
      } catch (err) {
        // ohitetaan virheellinen json
      }
    })

    if (!jobData) {
      return NextResponse.json(
        { error: 'JobPosting not found' },
        { status: 404 }
      )
    }

    let company = jobData.hiringOrganization?.name || ''

    // Fiksumpi Capital Letter (korjaa esim. "GOOGLE INC" -> "Google Inc")
    company = company
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    const location = jobData.jobLocation?.address?.addressLocality || ''
    const salaryMin = jobData.baseSalary?.value?.minValue || null
    const salaryMax = jobData.baseSalary?.value?.maxValue || null
    const employmentType = jobData.employmentType || ''
    const validThrough = jobData.validThrough || ''
    const datePosted = jobData.datePosted || ''

    let description = jobData.description || ''

    // -------------------------------------------------------------------
    // ÄLYKÄS DESCRIPTIONIN SIIVOUS (Säilyttää rivivälit ja muotoilut)
    // -------------------------------------------------------------------
    
description = description
      .replace(/\\n/g, '\n')                   // 1. Oikeat rivinvaihdot
      .replace(/<br\s*\/?>/ig, '\n')           // 2. <br> rivinvaihdoksi
      .replace(/<(b|strong)[^>]*>/ig, '**')    // 3. Boldaukset alku
      .replace(/<\/(b|strong)>/ig, '**')       // 4. Boldaukset loppu
      .replace(/<li[^>]*>/ig, '\n• ')          // 5. Selkeä pallura + rivinvaihto
      .replace(/<\/p>/ig, '\n\n')              // 6. Kappaleet
      // Etsitään tekstistä kohtia, jotka näyttävät listoilta (alkaa viivalla tai tähdellä)
      // ja muutetaan ne palluroiksi, jos ne ovat rivin alussa
      .split('\n')
      .map(line => line.trim().replace(/^[-*]\s+/, '• '))
      .join('\n')
      .replace(/<[^>]*>/g, '')                 // 7. Poistetaan loput HTML-tägit
      .replace(/[ \t]+/g, ' ')                 // 8. Poistetaan tuplavälit
      .replace(/\n{3,}/g, '\n\n')              // 9. Max 2 rivinvaihtoa putkeen
      .trim()

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
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Parsing failed' },
      { status: 500 }
    )
  }
}