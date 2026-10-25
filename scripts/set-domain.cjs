// Run: npm run set-domain -- https://your-verified-domain.com
const fs=require('node:fs'), path=require('node:path');
const base='https://www.oceanazulpartners.com';
const next=process.argv[2]?.trim().replace(/\/+$/,'');
if(!next || !/^https:\/\/[a-z\d.-]+(?::\d+)?$/i.test(next)){
 console.error('Provide an HTTPS base URL, e.g. npm run set-domain -- https://news.example.com');process.exit(1);
}
const root=path.resolve(__dirname,'..');let n=0;
function walk(folder){for(const ent of fs.readdirSync(folder,{withFileTypes:true})){
 if(ent.name==='.git'||ent.name==='node_modules')continue;
 const file=path.join(folder,ent.name);
 if(ent.isDirectory())walk(file);
 else if(/\.(html|xml|txt|js)$/i.test(ent.name)&&!ent.name.endsWith('set-domain.cjs')){
 const text=fs.readFileSync(file,'utf8');
 if(text.includes(base)){fs.writeFileSync(file,text.split(base).join(next));n++;}
 }
}}
walk(root);console.log(`Updated ${n} files. Re-run npm run check, commit, then redeploy.`);
