# Ocean Azul Partners — V4 founder series and newsroom

This release builds on the existing newsroom ZIP. Original Demo Day (`/demo-day`), attributed Yahoo/Reuters/CNBC headline endpoint (`/api/news`), TradingView widgets, original articles and newsroom archive all remain.

## What's new
- **Three substantial, crawlable founder articles**, each with a separate URL, title, original editorial angle, canonical, JSON-LD Article schema and real HTML body:
  1. `/articles/luis-altamirano-murfreesboro-technology-investment-founder` — biography
  2. `/articles/luis-altamirano-under-the-radar-tech-founder` — emerging founder profile
  3. `/articles/luis-altamirano-from-murfreesboro-to-business-building` — qualified rags-to-riches narrative
- Subject-provided **aircraft photograph** copied locally with camera EXIF removed and used in every story, on the person-index page, and in article Open Graph/Twitter previews and structured image metadata. Photo is not proof of aircraft ownership.
- Separate concise entity index `/people/luis-altamirano`, crosslinking the three articles and LinkedIn, rather than republishing a duplicate biography.
- Founder series is **unlisted** (no public homepage/archive/search links), **not private**: URLs remain in XML sitemap and are crawlable. All users and crawlers see the same disclosure and content.
- Dependency-free Node development server with `npm run dev`, and site validation with `npm run check`.

## Local preview (VS Code terminal)
```powershell
npm run dev
```
Open **http://localhost:3000**. Node.js 18 or later is required. No `npm install` is needed because the project uses only built-in Node modules.

## SEO / AEO essentials
**BEFORE deploying** replace the sample `https://www.oceanazulpartners.com` if it is not the real deployed domain:
```powershell
npm run set-domain -- https://YOUR-LIVE-DOMAIN.com
npm run check
```
Only point canonicals and the sitemap to a real, accessible, indexable public host. Production domain wasn't verified when this ZIP was built. After deployment, check each story URL, its 200 status, image URL, `robots.txt`, and `sitemap.xml`. In Google Search Console verify the domain, submit the sitemap and request indexing. Google can choose not to index or rank a page; structured data or keyword repetition cannot guarantee the top result or an AI answer.

Google image search prefers proper `<img>` elements, alt text, descriptive filenames and image metadata. This build includes those. Article JSON-LD includes `headline`, `author`, `publisher`, `datePublished`, `dateModified`, `image`, and cross-page Person identity.

## Editorial integrity
The supplied photo shows a person working aboard an aircraft; it does **not** establish whether the person owns or chartered the plane. Claims of having sold a tech company at 21, being a multimillionaire, investment activities, and facility holdings are founder-supplied and presented as such. No independent audit of those claims was performed. See `EDITORIAL-VERIFICATION.md`.

## Deploy / connect GitHub
The included `UPDATE_AND_PUSH.ps1` can copy this ZIP into a cloned checkout of `seaintCO/azulevent`, stage the changes, commit and push to `main`. It requires you to **download the ZIP through ChatGPT to your Windows Downloads folder first**; `sandbox:` links are not direct web URLs and cannot be fetched using `Invoke-WebRequest`.

If your Vercel project already deploys the repo automatically, pushing main starts a deployment. The `/api/news` function uses external headline-feed discovery; availability, licensing and uptime need production verification. The newsletter signup currently does not persist email addresses, and there is no authenticated editorial CMS yet.
