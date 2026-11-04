'use strict';
const assert=require('node:assert/strict');
const https=require('node:https');
const {EventEmitter}=require('node:events');
const originalGet=https.get;
const sample=(name)=>`<?xml version="1.0"?><rss><channel><item><title><![CDATA[${name} market headline &amp; outlook]]></title><link>https://news.google.com/articles/${name.replace(/[^A-Za-z]/g,'')}</link><pubDate>Tue, 03 Nov 2026 12:00:00 GMT</pubDate></item></channel></rss>`;
https.get=(url,opts,callback)=>{
 const req=new EventEmitter();req.setTimeout=()=>req;req.destroy=()=>{};
 process.nextTick(()=>{
  if(url.includes('reuters.com')){req.emit('error',new Error('Reuters temporarily unavailable'));return;}
  const res=new EventEmitter();res.statusCode=200;res.resume=()=>{};
  callback(res);res.emit('data',Buffer.from(sample(url.includes('finance.yahoo.com')?'Yahoo Finance':'CNBC')));res.emit('end');
 });
 return req;
};
(async()=>{
 try{
  const handler=require('../api/news');let status=0,result;
  await handler({method:'GET'}, {setHeader(){},status(n){status=n;return this;},json(obj){result=obj;}});
  assert.equal(status,200,'Partial source outage should not blank all feeds');
  assert.equal(result.items.length,2);
  assert(result.items.some(x=>x.source==='Yahoo Finance'));
  assert(result.items.some(x=>x.source==='CNBC'));
  assert.equal(result.sources.find(x=>x.name==='Reuters').available,false);
  assert(result.items.every(x=>/^https:\/\//.test(x.url)));
  console.log('PASS: external feed parser, attribution, and partial-outage resilience');
 }finally{https.get=originalGet;}
})().catch(e=>{console.error(e);process.exitCode=1;});
