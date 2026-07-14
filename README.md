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
- **Admin-paneeli** — erillinen hallintanäkymä käyttäjien ja hakemusten valvontaan, roolipohjaisella pääsynhallinnalla sekä käyttäjien bännäystoiminnoilla.
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
│
├── app/                                  # Next.js App Router
│   │
│   ├── layout.tsx                        # Koko sovelluksen layout
│   ├── page.tsx                          # Landing page
│   ├── globals.css                       # Globaalit tyylit
│   ├── favicon.ico
│   │
│   ├── admin/                            # Admin-paneeli
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── logs/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   │
│   ├── api/                              # API Routes
│   │   ├── admin/
│   │   │   └── users/
│   │   │       └── [id]/
│   │   │           ├── ban/              # Reitti käyttäjien bännäämiselle
│   │   │           │   └── route.ts
│   │   │           └── route.ts
│   │   ├── contact/
│   │   │   └── route.ts
│   │   └── parse-job/
│   │       └── route.ts
│   │
│   ├── applications/
│   │   ├── page.tsx
│   │   ├── AddApplicationForm.tsx
│   │   ├── ApplicationCard.tsx
│   │   ├── ApplicationDialog.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── banned/                           # Porttikieltosivu estetyille käyttäjille
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── calendar/
│   │   └── page.tsx
│   │
│   ├── favorites/
│   │   └── page.tsx
│   │
│   ├── history/
│   │   └── page.tsx
│   │
│   ├── settings/
│   │   └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   ├── login/
│   │   ├── actions.ts                    # Kirjautumislogiikka (sis. bännitarkistuksen)
│   │   └── page.tsx
│   │
│   ├── logout/
│   │   └── page.tsx
│   │
│   ├── privacy/
│   │   └── page.tsx
│   │
│   ├── tos/
│   │   └── page.tsx
│   │
│   └── demo/
│       ├── page.tsx
│       ├── applications/
│       │   └── page.tsx
│       ├── calendar/
│       │   └── page.tsx
│       ├── history/
│       │   └── page.tsx
│       └── favorites/
│           └── page.tsx
│
├── components/                           # Jaettavat React-komponentit
│   │
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── LogDetailModal.tsx
│   │   └── UsersTable.tsx                # Käyttäjähallintataulukko bännin keston valinnalla
│   │
│   ├── applications/
│   │   └── AddAttachment.tsx
│   │
│   ├── calendar/
│   │   ├── AddEventModal.tsx
│   │   ├── CalendarClient.tsx
│   │   ├── CalendarView.tsx
│   │   ├── EventDetailModal.tsx
│   │   ├── MiniCalendar.tsx
│   │   └── QuickEvents.tsx
│   │
│   ├── dashboard/
│   │   ├── ActivityHeatmap.tsx
│   │   ├── ApplicationChart.tsx
│   │   ├── ApplicationTrendChart.tsx
│   │   ├── ConsistencyCard.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── ImpactRatingCard.tsx
│   │   ├── LocationsChart.tsx
│   │   ├── MapComponent.tsx
│   │   ├── RecentApplications.tsx
│   │   ├── StatsCard.tsx
│   │   └── UpcomingDeadlines.tsx
│   │
│   ├── demo/
│   │   ├── DemoBanner.tsx
│   │   └── DemoSidebar.tsx
│   │
│   ├── history/
│   │   └── HistoryClient.tsx
│   │
│   ├── logout/
│   │   ├── LogoutConfirmModal.tsx
│   │   └── ModalProvider.tsx
│   │
│   ├── settings/
│   │   ├── AvatarUpload.tsx
│   │   ├── PasswordChangeForm.tsx
│   │   ├── ProfileDetailsForm.tsx
│   │   └── SettingsClient.tsx
│   │
│   ├── ui/                               # Yleiset UI-komponentit
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── skeletons.tsx
│   │   ├── table.tsx
│   │   ├── TimerComponent.tsx
│   │   ├── theme-provider.tsx
│   │   └── tooltip.tsx
│   │
│   ├── Footer.tsx
│   ├── LandingIndexCard.tsx
│   ├── LoginModal.tsx
│   ├── NavBar.tsx
│   ├── NavBarWait.tsx
│   ├── Sidebar.tsx
│   ├── SimpleNav.tsx
│   ├── DownloadButton.tsx
│   ├── WaitlistSignup.tsx
│   └── AppToaster.tsx
│
├── lib/                                  # Sovelluslogiikka
│   ├── auth-errors.ts
│   ├── calendar.ts
│   ├── demo-data.ts
│   ├── export-csv.ts
│   ├── history.ts
│   ├── logger.ts
│   ├── ratelimit.ts
│   ├── supabase.ts
│   ├── supabase-admin.ts
│   └── supabase-server.ts
│
├── middleware.ts                         # Reittien suojaus (Auth + Admin)
│
├── public/                               # Staattiset tiedostot
│   ├── logo.svg
│   ├── favicon.ico
│   ├── icons/
│   ├── screenshots/
│   └── images/
│
├── types/                                # TypeScript-tyypit
│   ├── application.ts
│   ├── user.ts
│   ├── history.ts
│   └── database.ts
│
├── hooks/                                # Custom React Hooks
│   ├── useAuth.ts
│   ├── useApplications.ts
│   ├── useDashboard.ts
│   └── useProfile.ts
│
├── utils/                                # Pienet apufunktiot
│   ├── formatDate.ts
│   ├── formatSalary.ts
│   ├── validators.ts
│   └── constants.ts
│
├── package.json
├── proxy.ts                              # middleware-name-update
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Arkkitehtuuriratkaisuja

- **Row Level Security kaikissa tauluissa** — jokainen taulu (`applications`, `calendar_events`, `application_history`, `profiles`, `deleted_applications_log`) rajaa datan käyttäjäkohtaisesti tietokantatasolla, ei vain sovelluslogiikassa[cite: 3].
- **Julkisen profiilin bännisynkronointi** — käyttäjän porttikielto (`is_banned`, `banned_until`) tallennetaan suoraan `profiles`-tauluun, jotta tieto on helposti luettavissa käyttöliittymän taulukoissa ja sivunvaihdon yhteydessä.
- **Vankka sovellustason porttikieltosuojaus** — `proxy.ts` (middleware) tarkistaa jokaisen pyynnön yhteydessä tietokannasta, onko kirjautunut käyttäjä estetty[cite: 3]. Jos bänni on voimassa, käyttäjä ohjataan välittömästi `/banned`-porttikieltosivulle eikä sivun latausta tai API-kutsuja suoriteta[cite: 3].
- **Turvallinen kirjautumisvirta** — `loginAction` suorittaa bännitarkistuksen välittömästi onnistuneen kirjautumisen jälkeen. Jos käyttäjän profiili on estetty, istunto tyhjennetään heti (`signOut`) ja hänet ohjataan bännisivulle ilman, että ulkopuolisille paljastetaan bännin olemassaoloa ennen oikean salasanan syöttämistä.
- **Erillinen poistoloki** — koska `application_history` on sidottu `applications`-tauluun `cascade`-relaatiolla, poistotapahtumat eivät voisi säilyä samassa taulussa[cite: 3]. `deleted_applications_log` on tarkoituksella irrallinen taulu, joka säilyy vaikka itse hakemus poistetaan[cite: 3].
- **Server- ja client-Supabase-clientit eriytetty** — `lib/supabase.ts` selaimelle (cookie-pohjainen istunto), `lib/supabase-server.ts` palvelinkomponenteille, `lib/supabase-admin.ts` service role -operaatioille (esim. käyttäjän poisto), jota ei koskaan altisteta selaimelle[cite: 3].
- **Middleware suojaa reitit ennen renderöintiä** — sekä tavalliset suojatut reitit että admin-reitit tarkistetaan `middleware.ts`:ssä, jolloin kirjautumaton tai oikeudeton käyttäjä ei koskaan näe edes vilaustakaan suojatusta sisällöstä[cite: 3].
- **Propseihin perustuva demo/tuotanto-jako** — dashboard-komponentit (esim. `LocationsCard`, `ApplicationsChart`) ottavat valinnaisen `demoData`-propin: jos se annetaan, komponentti käyttää sitä eikä kutsu Supabasea ollenkaan[cite: 3]. Sama komponentti palvelee sekä oikeaa sovellusta että kirjautumatonta demoa[cite: 3].

## Kieli

Käyttöliittymä on kokonaan suomeksi, kohdeyleisönä suomalaiset työnhakijat ja suomalaiset työpaikkailmoitussivustot[cite: 3].
