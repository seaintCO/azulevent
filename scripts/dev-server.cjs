// No npm packages required. Run `npm run dev`, then open http://localhost:3000
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon'};
const news=require('../api/news.js');
const app=http.createServer(async(req,res)=>{
  if (req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end('Method not allowed');}
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Bad request');}
  if (pathname==='/api/news'){
    // Same serverless handler used by Vercel; no mock news stories.
    if(req.method==='HEAD'){res.writeHead(200);return res.end();}
    const wrapper={setHeader:(...a)=>res.setHeader(...a),status(code){res.statusCode=code;return this;},json(payload){if(!res.headersSent)res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(payload));}};
    try{return await news(req,wrapper);}catch{res.writeHead(502);return res.end(JSON.stringify({items:[],error:'Feed unavailable'}));}
  }
  if (pathname.includes('\0') || pathname.includes('\\')){res.writeHead(400);return res.end('Bad request');}
  // Restrict paths to repo root; reject dotfiles except well-known static assets.
  const segments=pathname.split('/').filter(Boolean);
  if(segments.some(s=>s==='..'||s.startsWith('.'))){res.writeHead(403);return res.end('Forbidden');}
  let target=path.resolve(root,'.'+pathname);
  if(!(target===root||target.startsWith(root+path.sep))){res.writeHead(403);return res.end('Forbidden');}
  try{
    let stat=fs.statSync(target);
    if(stat.isDirectory())target=path.join(target,'index.html');
  }catch{
    if(!path.extname(target))target+='.html';
  }
  let stat;try{stat=fs.statSync(target);if(!stat.isFile())throw Error('not file');}catch{res.writeHead(404,{'Content-Type':'text/plain'});return res.end('404 — Not found');}
  const ext=path.extname(target).toLowerCase();
  res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  if(req.method==='HEAD')return res.end();
  fs.createReadStream(target).pipe(res);
});
app.listen(port,host,()=>{console.log(`\nOcean Azul Newsroom → http://${host}:${port}\nCtrl+C to stop\n`)});
