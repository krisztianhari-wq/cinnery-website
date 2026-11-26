// Local test of the live menu: serves the site and forwards /api/menu* to a local Planner (like Caddy does on cinnery.nl).
//   ROTA=http://127.0.0.1:8872 PORT=8793 node tools/dev-live.mjs
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROTA = process.env.ROTA || 'http://127.0.0.1:8872';
const PORT = +(process.env.PORT || 8793);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml', '.ico': 'image/x-icon', '.json': 'application/json' };

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/menu' || url.pathname.startsWith('/api/menu/')) {
    try {
      const r = await fetch(ROTA + url.pathname + url.search);
      res.writeHead(r.status, { 'content-type': r.headers.get('content-type') || 'application/octet-stream', 'cache-control': r.headers.get('cache-control') || 'no-store' });
      res.end(Buffer.from(await r.arrayBuffer()));
    } catch { res.writeHead(502); res.end(); }
    return;
  }
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = resolve(join(ROOT, p));
  if (!f.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  try { const b = await readFile(f); res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('not found'); }
}).listen(PORT, '127.0.0.1', () => console.log(`cinnery live-menu test: http://127.0.0.1:${PORT} → menu from ${ROTA}`));
