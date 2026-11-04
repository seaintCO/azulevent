# Ocean Azul Partners — V5 / AZUL Tech Day Event Desk

This project remains **static HTML + Node dev server + Vercel news endpoint**. The original Demo Day (`/demo-day`), five existing founder/news sections, all earlier founder article pages, and market widgets remain. No npm dependencies required.

## Added

- **Five original AZUL Tech Day stories** with standalone server-readable HTML, canonical URLs, descriptions, social tags, schema.org Article/NewsArticle structured data and crosslinks.
- **Event hub:** `/tech-demo-day` — full editorial cover, supplied panel portrait and five stories.
- **Homepage feature** and navigation to the event coverage; originals remain available.
- **Images:** `assets/images/azul-tech-day-luis-altamirano-panel.jpg`, plus 16:9, 4:3 and 1:1 copies stripped of EXIF.
- **News archive** filter for AZUL Tech Day.
- **Live default canonical domain**: `https://azulventurepartners.space` (previous sample `oceanazulpartners.com` was not publicly accessible at build time). This domain still must actually serve the V5 pages after deployment.

### Article URLs

1. `/articles/azul-tech-day-2026-founders-investors-demo-day` — event overview
2. `/articles/azul-founder-of-the-year-under-30-luis-altamirano` — organizer-supplied award recognition
3. `/articles/luis-altamirano-azul-tech-day-panel-seaint-under-30-founder` — founder panel context and SEAINT
4. `/articles/seaint-next-frontier-robotics-and-ai-luis-altamirano` — proposed robotics roadmap
5. `/articles/luis-altamirano-epec-china-invitation-azul-tech-day` — explicitly unconfirmed invitation account

### Editorial integrity — review before publishing

The private event's public listing documents the planned April 25–26, 2026 schedule, **not independently audited attendance, award decisions, audience reactions, or commercial outcomes**. The award for Luis Altamirano and the China/EPEC invitation are organizer/founder-supplied. They are described on the site as such. “Under 30” is the AZUL award category, not a Forbes recognition. **EPEC is not assumed to be APEC.** Verify the award presentation and invitation source and event name before issuing further publicity claims; see `EVENT_EDITORIAL_CHECKLIST.md`.

### Development

Use Node.js 18+ (no npm install necessary):

```powershell
npm run check
npm run dev
```

Open `http://localhost:3000/tech-demo-day` or `http://localhost:3000`.

If you connect a new production domain, update all canonical and sitemap references with:

```powershell
npm run set-domain -- https://YOUR-CONNECTED-DOMAIN.com
npm run check
```

### GitHub and Vercel

Download ZIP to Windows Downloads, then run **`UPDATE_AND_PUSH.ps1`** or paste the script's commands in PowerShell. It clones or updates `seaintCO/azulevent`, copies V5 files, validates, and pushes to `main`. This does not change the `miami-finance-media` repo or make a separate multi-tenant CMS; those were future architecture concepts. Vercel must be connected to the `main` branch. Confirm new routes and image URLs after deploy.

### SEO/AEO

Sitemap + JSON-LD communicate context to search engines, but do not guarantee indexing, AI answers, Google News acceptance or ranking. Submit the live sitemap to Search Console only when deployed and validated. Maintain one canonical biography and include external evidence for extraordinary claims.


## V6: Front-page corrections (November 2026)
- Yahoo Finance headlines appear in the top section of the homepage; Reuters/CNBC headlines appear directly below.
- Headlines are attributed and link externally. Live feed availability depends on the external Google News RSS discovery feeds.
- The very large AZUL Tech Day photo was replaced with a short image feature below the market headlines, and the dedicated event hub photo was reduced in height.
- The event editorial series is labeled **October 30, 2026 edition**. The independently documented original event page advertises an **April 25–26, 2026** program; those dates are not conflated.
- Existing article `datePublished` values remain unchanged to avoid falsely backdating publication; the October 30 date denotes the editorial edition, not a new claim about original publication time.
- External source feed health can be tested after deployment at `/api/news`. It returns limited headline metadata and links, never copied article bodies.
- `npm run dev` starts the local preview at http://localhost:3000 and the API also works locally when external feed access is available.


## V7: Mobile-first editorial redesign

- `/tech-demo-day` now uses a clean editorial hero with responsive one-column layout below 820px.
- Photo is a compact 16:10 crop with a separate photo credit; editorial sourcing notes remain present at the end of the section.
- Founder coverage is a lead story with four text-first related stories, eliminating repeated large images.
- Typography uses Manrope and IBM Plex Mono with local font fallbacks.
- The newsroom now includes an accessible mobile navigation toggle.
- V6 finance headlines, original Demo Day, all articles, SEO, and API are unchanged.

Local development: `npm run dev` (http://localhost:3000). Check: `npm run check`.
