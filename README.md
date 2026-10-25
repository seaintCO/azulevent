# Ocean Azul Partners — Newsroom (Unlisted founder profile edition)

## In this build
- Original Demo Day landing page preserved at `/demo-day`.
- Main financial news homepage + original stories, archive, search, TradingView widgets, serverless attributed headlines.
- **Eight newly drafted original educational / editorial articles** (2026-10-20 through 2026-10-25), each with its own search-friendly, direct HTML route under `/articles/`. Review drafts and any brand attribution before publishing.
- Luis Altamirano profile **unlisted**, not deleted. The profile remains accessible through direct links at:
  - `/articles/luis-altamirano-murfreesboro-technology-investment-founder` (canonical)
  - `/people/luis-altamirano` (alternate)
- Profile intentionally omitted from homepage promotion, homepage feature cards, search overlay, and news archive. It remains publicly accessible and in `sitemap.xml` for organic search indexing. **This is unlisted, not private or secret.** Visitors and search engines see the same page.
- Full article metadata, Open Graph cards, canonical URLs and JSON-LD schema for the new editorial pages.

## Add and publish future articles
This version uses `data/posts.js` and static HTML article pages, **not an authenticated CMS**. The eight article pages have SEO-friendly direct URLs. Publishing another article presently requires editing content and creating its static HTML route (or using the `/story?slug=` client-rendered route without comparable SEO).

## External feeds and copyright
`/api/news` reads feed metadata and displays attributed external headline links; it does not copy full third-party stories. The TradingView widgets load from TradingView. Equity price delays, API/feed reliability and publisher license terms require production validation.

## Deployment
Upload the contents of this ZIP to `seaintCO/azulevent` and deploy it through Vercel (static pages + serverless `/api/news`). Replace the example canonical domain `https://www.oceanazulpartners.com` with the actual verified production domain throughout before deploying to that domain. No npm build is required.

## Outstanding launch requirements
- CMS with editorial login, media upload, edit and scheduling is **not implemented**.
- Newsletter form is a non-persisting UI demonstration.
- Editorial pieces should receive client review before public release.
- Founder claims are subject-supplied, not independently verified: see `EDITORIAL-VERIFICATION.md`.
