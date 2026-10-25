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
const html=read('index.html');if(html.includes('luis-altamirano')||read('news.html').includes('luis-altamirano'))failures.push('Profile leaked to landing page/archive');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('PASS: three founder articles, linked metadata, JSON-LD, sitemap, image, and unlisted listings.');
