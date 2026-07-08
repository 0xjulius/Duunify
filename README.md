# Duunify

**Duunify** on suomalaisille työnhakijoille suunnattu työhakemusten hallintasovellus. Se korvaa hajanaiset Excel-taulukot yhdellä paikalla, josta näkee koko hakuprosessin: mitä on haettu, missä vaiheessa kukin hakemus on, milloin haastattelut ja hakuajat ovat, ja miten hakeminen on edistynyt ajan myötä.

Tavoite ei ole vain tallentaa rivejä, vaan aidosti helpottaa työnhaun arkea — automatisoida toistuva näppäily, näyttää trendit visuaalisesti, ja muistuttaa asioista joita muuten unohtuisi kesken kuormittavan hakuprosessin.

## Ominaisuudet

- **Automaattinen tietojen täyttö** — liitä työpaikkailmoituksen linkki (Duunitori, Työmarkkinatori, Jobly), ja yritys, tehtävänimike, palkka, sijainti ja kuvaus täyttyvät automaattisesti JSON-LD-rakenteisesta datasta.
- **Hakemusten hallinta** — CRUD-toiminnot hakemuksille, tilaseuranta (Haettu / Haastattelu / Tarjous / Hylätty / Tallennettu), muistiinpanot, CV/liitetiedostot.
- **Älykäs kalenteri** — haastattelut, hakuaikojen päättymiset ja itse luodut muistutukset samassa näkymässä. Tapahtumat voi merkitä valmiiksi, poistaa suoraan kalenterista, ja niitä voi selata isolla kuukausinäkymällä tai kompaktilla minikalenterilla.
- **Dashboard ja visualisoinnit** — statusjakauma, hakemustrendi ajan yli, sijaintijakauma kartalla, GitHub-tyylinen aktiivisuusruudukko, sekä tulkitsevat mittarit kuten työnhaku-indeksi ja viikoittainen aktiivisuusprosentti.
- **Toimintaloki** — automaattinen aikajana kaikista tapahtumista (hakemuksen luonti, tilamuutokset, kalenteritapahtumat, poistot), suodatettavissa tyypin ja ajanjakson mukaan, vietävissä CSV:nä.
- **Suosikit** — työpaikkojen tallentaminen myöhempää hakemista varten, erillisillä tilastoilla ja suodattimilla.
- **Admin-paneeli** — erillinen hallintanäkymä käyttäjien ja hakemusten valvontaan, roolipohjaisella pääsynhallinnalla.
- **Yhteydenottolomake** — viestit tallentuvat tietokantaan ja lähetetään sähköpostitse, jotta mikään ei katoa vaikka sähköposti epäonnistuisi.
- **Demo-tila** — kirjautumista vaatimaton esikatselu mock-datalla, jotta palvelun voi kokeilla ennen rekisteröitymistä.

## Teknologiat

| Osa-alue | Teknologia |
|---|---|
| Framework | Next.js (App Router) |
| Kieli | TypeScript |
| Tyylit | Tailwind CSS |
| Tietokanta & Auth | Supabase (Postgres, Row Level Security, Auth, Storage) |
| Sähköposti | Resend |
| Kaaviot | Recharts |
| Kalenteri | react-big-calendar |
| Ilmoitukset (toast) | Sonner |
| Web-scraping | Cheerio |
| Deployment | Vercel |

## Projektin rakenne

```
duunify/
├── app/
│   ├── admin/                  # Admin-paneeli (roolipohjainen pääsy)
│   │   ├── applications/       # Kaikkien käyttäjien hakemusten hallinta
│   │   ├── users/              # Käyttäjähallinta (roolit, poisto)
│   │   ├── layout.tsx          # Admin-oikeustarkistus + sivupalkki
│   │   └── page.tsx            # Admin-dashboard, koko palvelun tilastot
│   ├── api/
│   │   ├── admin/users/[id]/   # Käyttäjän poisto (service role)
│   │   ├── auth/callback/      # OAuth- ja sähköpostivahvistuksen koodinvaihto
│   │   ├── contact/            # Yhteydenottolomakkeen käsittely + Resend
│   │   └── parse-job/          # Työpaikkailmoituksen automaattihaku
│   ├── applications/           # Hakemusten CRUD-näkymä
│   ├── calendar/                # Kalenterinäkymä
│   ├── dashboard/               # Pääasiallinen tilastonäkymä
│   ├── demo/                    # Julkinen demo mock-datalla
│   ├── favorites/                # Tallennetut työpaikat
│   ├── history/                  # Toimintaloki
│   ├── settings/                 # Käyttäjän profiili, salasana, tilaus
│   ├── contact/                  # Yhteydenottosivu
│   ├── login/                    # Kirjautumissivu
│   ├── logout/                   # Uloskirjautumisen vahvistussivu
│   ├── layout.tsx                # Root layout, providerit, fontit
│   └── page.tsx                  # Etusivu / landing page
│
├── components/
│   ├── admin/                   # Admin-sivupalkki, käyttäjätaulukko
│   ├── calendar/                 # Kalenterinäkymä, minikalenteri, tapahtumamodaalit
│   ├── dashboard/                 # Kaaviot, tilastokortit, aktiivisuusruudukko
│   ├── demo/                      # Demo-tilan sivupalkki ja bannerit
│   ├── history/                    # Toimintalokin aikajananäkymä
│   ├── landing/                    # Etusivun esittelykomponentit
│   ├── logout/                      # Uloskirjautumisen vahvistusmodaali + provider
│   ├── ui/                           # Yleiskäyttöiset UI-komponentit (mm. Toaster)
│   ├── Sidebar.tsx                    # Pääsovelluksen sivupalkki
│   ├── LoginModal.tsx                  # Kirjautumis-/rekisteröintimodaali
│   └── Footer.tsx                       # Sivuston alatunniste
│
├── lib/
│   ├── auth-errors.ts                 # Supabasen virheviestien suomennokset
│   ├── calendar.ts                     # Kalenteritapahtumien haku ja yhdistely
│   ├── demo-data.ts                     # Demo-tilan mock-data
│   ├── export-csv.ts                     # Yleiskäyttöinen CSV-vientifunktio
│   ├── history.ts                         # Toimintalokin datan haku ja yhdistely
│   ├── middleware.ts                       # Supabase-istunnon päivityslogiikka
│   ├── ratelimit.ts                         # API-reittien rajoitus
│   ├── supabase.ts                           # Selainpuolen Supabase-client
│   ├── supabase-admin.ts                      # Service role -client (vain palvelin)
│   └── supabase-server.ts                      # Palvelinpuolen Supabase-client (SSR)
│
├── middleware.ts                # Reitityksen suojaus (auth + admin-tarkistus)
└── app/globals.css              # Globaalit tyylit
```

## Arkkitehtuuriratkaisuja

- **Row Level Security kaikissa tauluissa** — jokainen taulu (`applications`, `calendar_events`, `application_history`, `profiles`, `deleted_applications_log`) rajaa datan käyttäjäkohtaisesti tietokantatasolla, ei vain sovelluslogiikassa.
- **Erillinen poistoloki** — koska `application_history` on sidottu `applications`-tauluun `cascade`-relaatiolla, poistotapahtumat eivät voisi säilyä samassa taulussa. `deleted_applications_log` on tarkoituksella irrallinen taulu, joka säilyy vaikka itse hakemus poistetaan.
- **Server- ja client-Supabase-clientit eriytetty** — `lib/supabase.ts` selaimelle (cookie-pohjainen istunto), `lib/supabase-server.ts` palvelinkomponenteille, `lib/supabase-admin.ts` service role -operaatioille (esim. käyttäjän poisto), jota ei koskaan altisteta selaimelle.
- **Middleware suojaa reitit ennen renderöintiä** — sekä tavalliset suojatut reitit että admin-reitit tarkistetaan `middleware.ts`:ssä, jolloin kirjautumaton tai oikeudeton käyttäjä ei koskaan näe edes vilaustakaan suojatusta sisällöstä.
- **Propseihin perustuva demo/tuotanto-jako** — dashboard-komponentit (esim. `LocationsCard`, `ApplicationsChart`) ottavat valinnaisen `demoData`-propin: jos se annetaan, komponentti käyttää sitä eikä kutsu Supabasea ollenkaan. Sama komponentti palvelee sekä oikeaa sovellusta että kirjautumatonta demoa.

## Kieli

Käyttöliittymä on kokonaan suomeksi, kohdeyleisönä suomalaiset työnhakijat ja suomalaiset työpaikkailmoitussivustot.