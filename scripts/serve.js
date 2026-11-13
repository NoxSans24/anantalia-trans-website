const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || process.argv[2] || 4173);
const backendOrigin = new URL(process.env.BACKEND_API_ORIGIN || 'http://127.0.0.1:3000');
if (backendOrigin.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(backendOrigin.hostname) || backendOrigin.username || backendOrigin.password) {
  throw new Error('BACKEND_API_ORIGIN must be an HTTP loopback origin');
}
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Bad request'); return; }
  if (pathname === '/favicon.ico') {
    response.writeHead(204).end();
    return;
  }
  if (pathname === '/runtime-config.js') {
    response.writeHead(200, {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    });
    response.end(`window.ANANTALIA_API_BASE_URL=${JSON.stringify(process.env.API_BASE_URL || '')};`);
    return;
  }
  if (pathname.startsWith('/api/v1/public/')) {
    const isAllowedPost = (pathname === '/api/v1/public/booking-requests' || pathname === '/api/v1/public/contact-messages') && request.method === 'POST';
    const isPublicGet = request.method === 'GET';
    if (!isPublicGet && !isAllowedPost) {
      response.writeHead(405, { Allow: (pathname === '/api/v1/public/booking-requests' || pathname === '/api/v1/public/contact-messages') ? 'POST' : 'GET' }).end();
      return;
    }
    const upstream = new URL(request.url, backendOrigin);
    const headers = {
      Accept: request.headers.accept || 'application/json',
      ...(request.headers['content-type'] ? { 'Content-Type': request.headers['content-type'] } : {}),
      ...(request.headers['content-length'] ? { 'Content-Length': request.headers['content-length'] } : {}),
    };
    const proxy = http.request(upstream, { method: request.method, headers, timeout: 5000 }, (result) => {
      response.writeHead(result.statusCode || 502, {
        'Content-Type': result.headers['content-type'] || 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...(result.headers['x-request-id'] ? { 'X-Request-Id': result.headers['x-request-id'] } : {}),
      });
      result.pipe(response);
    });
    proxy.on('timeout', () => proxy.destroy(new Error('upstream timeout')));
    proxy.on('error', () => { if (!response.headersSent) response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); response.end('{"error":{"code":"BACKEND_UNAVAILABLE","message":"Katalog belum dapat dimuat."}}'); });
    request.on('aborted', () => proxy.destroy());
    if (isAllowedPost) {
      request.pipe(proxy);
    } else {
      proxy.end();
    }
    return;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const isSafeSegment = !pathname.includes('..') && !pathname.includes('\\') && !pathname.includes('\0')
    && !pathname.split('/').some((seg) => seg.startsWith('.'));
  const isAllowedPublicRoute = pathname === '/index.html'
    || pathname === '/logo.png'
    || pathname === '/runtime-config.js'
    || pathname === '/favicon.ico'
    || /^\/pages\/[a-z0-9-]+\.html$/i.test(pathname)
    || /^\/css\/(?!tailwind\.input\.css$)[a-z0-9._-]+\.css$/i.test(pathname)
    || /^\/js\/[a-z0-9._-]+\.js$/i.test(pathname)
    || /^\/assets\/(?:[a-z0-9._-]+\/)*[a-z0-9._-]+\.(?:svg|png|jpe?g|webp|ico|woff2?)$/i.test(pathname);
  const file = path.resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end('Forbidden'); return; }
  if (!isSafeSegment || !isAllowedPublicRoute) { response.writeHead(404).end('Not found'); return; }
  fs.stat(file, (statError, stat) => {
    if (statError || !stat.isFile()) { response.writeHead(404).end('Not found'); return; }
    response.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    fs.createReadStream(file).pipe(response);
  });
}).listen(port, '127.0.0.1', () => console.log(`Anantalia Trans preview: http://127.0.0.1:${port}`));
