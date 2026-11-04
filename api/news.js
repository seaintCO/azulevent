'use strict';
const https=require('node:https');

// This endpoint displays only headline metadata from public discovery feeds.
// It neither scrapes publishers' article bodies nor claims any redistribution license.
const feedUrls=[
  {source:'Yahoo Finance',url:'https://news.google.com/rss/search?q=site%3Afinance.yahoo.com%20(markets%20OR%20stocks%20OR%20economy%20OR%20technology)%20when%3A3d&hl=en-US&gl=US&ceid=US%3Aen'},
  {source:'Reuters',url:'https://news.google.com/rss/search?q=site%3Areuters.com%20(markets%20OR%20business%20OR%20technology)%20when%3A2d&hl=en-US&gl=US&ceid=US%3Aen'},
  {source:'CNBC',url:'https://news.google.com/rss/search?q=site%3Acnbc.com%20(markets%20OR%20economy)%20when%3A2d&hl=en-US&gl=US&ceid=US%3Aen'}
];
const MAX_BYTES=1600000;
function fetchXml(url){
 return new Promise((resolve,reject)=>{
  const req=https.get(url,{headers:{'User-Agent':'OceanAzulNewsroom/1.0 (+headline attribution)',Accept:'application/rss+xml,application/xml,text/xml;q=0.9'}},res=>{
   if(res.statusCode!==200){res.resume();return reject(new Error('RSS returned status '+res.statusCode));}
   let length=0;const chunks=[];
   res.on('data',chunk=>{length+=chunk.length;if(length>MAX_BYTES){req.destroy(new Error('RSS feed too large'));return;}chunks.push(chunk);});
   res.on('end',()=>resolve(Buffer.concat(chunks).toString('utf8')));
   res.on('error',reject);
  });
  req.setTimeout(7000,()=>req.destroy(new Error('RSS timed out')));
  req.on('error',reject);
 });
}
function decodeText(s=''){
 return String(s).replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi,(raw,key)=>{
  const named={amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' '};
  if(named[key.toLowerCase()])return named[key.toLowerCase()];
  if(key[0]==='#'){const n=key[1]?.toLowerCase()==='x'?parseInt(key.slice(2),16):parseInt(key.slice(1),10);return Number.isInteger(n)&&n>=0&&n<=0x10ffff?String.fromCodePoint(n):raw;}
  return raw;
 }).replace(/<[^>]*>/g,'').trim();
}
function field(block,key){
 const m=block.match(new RegExp('<'+key+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+key+'>','i'));
 return m?decodeText(m[1]):'';
}
function age(str){const ms=Date.now()-new Date(str).getTime();if(!Number.isFinite(ms))return 'Recent';const min=Math.max(1,Math.round(ms/60000));if(min<60)return min+'m ago';if(min<1440)return Math.round(min/60)+'h ago';return Math.round(min/1440)+'d ago';}
function parse(xml,source){
 return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(match=>{
  const block=match[1],title=field(block,'title'),link=field(block,'link'),published=field(block,'pubDate');
  if(!title||!link)return null;
  let safeURL;try{const u=new URL(link);if(u.protocol!=='https:'&&u.protocol!=='http:')return null;safeURL=u.toString();}catch{return null;}
  return {title,url:safeURL,published,source,timeAgo:age(published)};
 }).filter(Boolean);
}
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=600');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'&&req.method!=='HEAD')return res.status(405).json({items:[],error:'Method not allowed'});
 const collected=await Promise.allSettled(feedUrls.map(async f=>({source:f.source,items:parse(await fetchXml(f.url),f.source)})));
 const items=[];const sources=[];const seen=new Set();
 for(let i=0;i<collected.length;i++){
  const r=collected[i];
  if(r.status==='fulfilled'){
   const entries=r.value.items;
   sources.push({name:feedUrls[i].source,available:entries.length>0,count:entries.length});
   for(const item of entries){const k=item.title.toLowerCase().replace(/\s+/g,' ').replace(/\s+[-|].*$/,'').slice(0,120);if(seen.has(k))continue;seen.add(k);items.push(item);}
  }else sources.push({name:feedUrls[i].source,available:false,count:0});
 }
 items.sort((a,b)=>(Date.parse(b.published)||0)-(Date.parse(a.published)||0));
 const response={items:items.slice(0,45),sources,updatedAt:new Date().toISOString(),notice:'External headline metadata only, discovered via public RSS feeds. Open the source or aggregator to read the original story. No publisher article bodies are reproduced.'};
 if(!response.items.length)return res.status(503).json({...response,error:'External feeds currently unavailable'});
 return res.status(200).json(response);
};
