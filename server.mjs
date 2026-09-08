// Dependency-free local HTTP server. Bind to loopback by default.
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
try { await stat(resolve(root,'slopetrace-source.zip')); } catch { await import('./scripts/package.mjs'); }
const port=Number(process.env.PORT||8000),host=process.env.HOST||'127.0.0.1';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.zip':'application/zip','.json':'application/json'};
http.createServer(async(req,res)=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let p=resolve(root,path.slice(1));if(!p.startsWith(root)){res.writeHead(403);res.end();return;}try{const s=await stat(p);if(s.isDirectory())p=resolve(p,'index.html');}catch(e){res.writeHead(404);res.end();return;}const ext=extname(p).toLowerCase(),type=types[ext]||'application/octet-stream';res.writeHead(200,{'Content-Type':type});res.end(await readFile(p));}catch(e){res.writeHead(500);res.end();}}).listen(port,host,()=>console.log(`Listening http://${host}:${port}/`));
