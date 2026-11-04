const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');const slugs=['luis-altamirano-murfreesboro-technology-investment-founder','luis-altamirano-under-the-radar-tech-founder','luis-altamirano-from-murfreesboro-to-business-building'];
let failures=[];const read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const slug of slugs){const filename=`articles/${slug}/index.html`;const html=read(filename);
 if(!html.includes('og:image')||!html.includes('application/ld+json')||!html.includes('index,follow')||!html.includes('luis-altamirano-aboard-private-aircraft.jpg')) failures.push('Missing metadata: '+filename);
 const json=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);try{JSON.parse(json[1]);}catch{failures.push('Invalid JSON-LD: '+filename);}
 if(!read('sitemap.xml').includes(slug))failures.push('Missing sitemap: '+slug);
}
if(!fs.existsSync(path.join(root,'assets/images/luis-altamirano-aboard-private-aircraft.jpg')))failures.push('Missing portrait image');
if(!read('data/posts.js').includes('"unlisted": true'))failures.push('Unlisted metadata missing');
const html=read('index.html');if(html.includes('/articles/luis-altamirano-murfreesboro-technology-investment-founder')||html.includes('/articles/luis-altamirano-under-the-radar-tech-founder')||html.includes('/articles/luis-altamirano-from-murfreesboro-to-business-building'))failures.push('Unlisted founder series directly linked from homepage');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
for(const slug of ['azul-tech-day-2026-founders-investors-demo-day','azul-founder-of-the-year-under-30-luis-altamirano','luis-altamirano-azul-tech-day-panel-seaint-under-30-founder','seaint-next-frontier-robotics-and-ai-luis-altamirano','luis-altamirano-epec-china-invitation-azul-tech-day']){const h=read(`articles/${slug}/index.html`);if(!h.includes('og:image')||!h.includes('canonical')||!h.includes('Editorial transparency'))failures.push('Missing article metadata: '+slug);const m=h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);try{const o=JSON.parse(m[1]);if(!o.headline||!o.image||!o.datePublished)failures.push('Incomplete JSON-LD: '+slug);}catch{failures.push('Invalid JSON-LD: '+slug)}if(!read('sitemap.xml').includes(slug))failures.push('Missing sitemap entry: '+slug);}
if(!read('tech-demo-day/index.html').includes('event-stories-grid'))failures.push('Event hub not built');
if(!fs.existsSync(path.join(root,'assets/images/azul-tech-day-luis-altamirano-panel.jpg')))failures.push('Missing user-provided event photo');
if(read('robots.txt').includes('www.oceanazulpartners.com'))failures.push('Old sample domain still in robots.txt');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
const front=read('index.html');
if(front.indexOf('id=\"yahoo-news\"')<0)failures.push('Yahoo Finance front-page headlines are absent');
if(front.indexOf('id=\"yahoo-news\"')>front.indexOf('id=\"azul-tech-day\"'))failures.push('Yahoo headlines must precede event coverage');
if(!front.includes('OCTOBER 30, 2026 EDITORIAL EDITION'))failures.push('October 30 editorial edition missing');
if(!read('assets/styles.css').includes('.event-brief-photo{display:block;position:relative;height:185px'))failures.push('Compact event photo styles missing');
if(!read('assets/app.js').includes('Yahoo Finance headlines are temporarily unavailable'))failures.push('Yahoo empty-feed fallback missing');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('PASS: V6 — Yahoo-first market desk, compact AZUL images, October 30 editorial edition, preservation of existing founder stories and SEO.');

const hub=read('tech-demo-day/index.html');
if(!hub.includes('event-standfirst')||!hub.includes('event-editorial-note'))failures.push('V7 editorial hub markup missing');
if(!read('assets/styles.css').includes('@media(max-width:820px)')||!read('assets/styles.css').includes('body[data-page="event"] .event-hero-layout{grid-template-columns:minmax(0,1fr)'))failures.push('V7 responsive hero reset missing');
if(!read('assets/app.js').includes('aria-controls=\"mobile-nav\"'))failures.push('V7 mobile menu missing');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('PASS: V7 mobile hero, event editorial design and accessible navigation.');
