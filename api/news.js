const https = require('https');

function fetchText(url){return new Promise((resolve,reject)=>{https.get(url,{headers:{'User-Agent':'Mozilla/5.0 OAP-Newsroom/1.0'}},res=>{let data='';res.on('data',c=>data+=c);res.on('end',()=>resolve(data));}).on('error',reject);});}
function decode(s=''){return s.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');}
function tag(block,name){const m=block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'));return m?decode(m[1].trim()):''}
function image(block){let m=block.match(/<media:content[^>]+url=["']([^"']+)/i)||block.match(/<media:thumbnail[^>]+url=["']([^"']+)/i);return m?m[1]:''}
function timeAgo(d){const ms=Date.now()-new Date(d).getTime(),m=Math.max(1,Math.round(ms/60000));if(m<60)return `${m}m ago`;const h=Math.round(m/60);if(h<24)return `${h}h ago`;return `${Math.round(h/24)}d ago`}
function parse(xml,source){return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(x=>{const b=x[1],title=tag(b,'title'),url=tag(b,'link'),published=tag(b,'pubDate');return {title,url,published,timeAgo:published?timeAgo(published):'Latest',source,image:image(b)}}).filter(x=>x.title&&x.url)}
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=900');
  res.setHeader('Access-Control-Allow-Origin','*');
  const feeds=[
    ['Yahoo Finance','https://news.google.com/rss/search?q=site%3Afinance.yahoo.com%20markets%20OR%20stocks%20when%3A1d&hl=en-US&gl=US&ceid=US%3Aen'],
    ['Reuters','https://news.google.com/rss/search?q=site%3Areuters.com%20markets%20OR%20technology%20when%3A1d&hl=en-US&gl=US&ceid=US%3Aen'],
    ['CNBC','https://news.google.com/rss/search?q=site%3Acnbc.com%20markets%20when%3A1d&hl=en-US&gl=US&ceid=US%3Aen']
  ];
  try{
    const results=await Promise.all(feeds.map(async([name,url])=>parse(await fetchText(url),name)));
    const seen=new Set();const items=results.flat().sort((a,b)=>new Date(b.published)-new Date(a.published)).filter(x=>{const k=x.title.toLowerCase().replace(/\s+/g,' ').slice(0,90);if(seen.has(k))return false;seen.add(k);return true}).slice(0,30);
    res.status(200).json({items,notice:'Headline metadata only. Follow links to original publishers.'});
  }catch(e){res.status(502).json({items:[],error:'News feed temporarily unavailable'});}
}
