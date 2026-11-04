// Run: npm run set-domain -- https://your-verified-domain.com
const fs=require('node:fs'),path=require('node:path');
const next=process.argv[2]?.trim().replace(/\/+$/,'');
const domainFile=path.resolve(__dirname,'..','data','production-domain.json');
if(!next || !/^https:\/\/[a-z\d.-]+(?::\d+)?$/i.test(next)){console.error('Provide a verified HTTPS domain, e.g. npm run set-domain -- https://news.example.com');process.exit(1);}
const from=JSON.parse(fs.readFileSync(domainFile,'utf8')).domain;
if(from===next){console.log('Already using '+next);process.exit(0);}
let n=0;function walk(folder){for(const ent of fs.readdirSync(folder,{withFileTypes:true})){
if(ent.name==='.git'||ent.name==='node_modules')continue;const p=path.join(folder,ent.name);
if(ent.isDirectory())walk(p);else if(/\.(html|xml|txt|js|md)$/i.test(ent.name)&&!ent.name.endsWith('set-domain.cjs')){let t=fs.readFileSync(p,'utf8');if(t.includes(from)){fs.writeFileSync(p,t.split(from).join(next));n++;}}}}
walk(path.resolve(__dirname,'..'));fs.writeFileSync(domainFile,JSON.stringify({domain:next},null,2)+'\n');console.log('Updated '+n+' files from '+from+' to '+next);
