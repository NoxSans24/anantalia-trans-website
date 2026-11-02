const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || process.argv[2] || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Bad request'); return; }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end('Forbidden'); return; }
  fs.stat(file, (statError, stat) => {
    if (statError || !stat.isFile()) { response.writeHead(404).end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    fs.createReadStream(file).pipe(response);
  });
}).listen(port, '127.0.0.1', () => console.log(`Anantalia Trans preview: http://127.0.0.1:${port}`));
