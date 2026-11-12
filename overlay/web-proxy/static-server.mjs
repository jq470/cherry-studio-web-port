/**
 * Zero-dependency static file server with cross-origin isolation headers.
 *
 * expo-sqlite's web build runs wa-sqlite in a worker over SharedArrayBuffer,
 * which browsers expose only when the page is cross-origin isolated:
 *   - Cross-Origin-Opener-Policy: same-origin
 *   - Cross-Origin-Embedder-Policy: require-corp
 *
 * `python3 -m http.server` does not send these, so the smoke test saw
 * `ReferenceError: SharedArrayBuffer is not defined`. This server serves the
 * exported dist-web directory and adds the two isolation headers to every
 * response. Same-origin assets are unaffected; this is a dev/smoke helper,
 * not part of the web bundle.
 *
 * Usage: node static-server.mjs <root-dir> [port]
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.argv[2] || '.');
const port = Number(process.argv[3] || process.env.PORT || 8099);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
};

const ISOLATION_HEADERS = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  let filePath = path.join(root, urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403, ISOLATION_HEADERS);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // SPA fallback: serve index.html for client-side routes.
      filePath = path.join(root, 'index.html');
      fs.stat(filePath, (e2) => {
        if (e2) {
          res.writeHead(404, ISOLATION_HEADERS);
          res.end('Not found');
          return;
        }
        send(filePath, 200);
      });
      return;
    }
    send(filePath, 200);
  });

  function send(file, status) {
    const ext = path.extname(file).toLowerCase();
    res.writeHead(status, {
      ...ISOLATION_HEADERS,
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': statSize(file),
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  }
});

function statSize(file) {
  try {
    return fs.statSync(file).size;
  } catch {
    return 0;
  }
}

server.listen(port, '127.0.0.1', () => {
  console.log(`static server: http://127.0.0.1:${port}/ root=${root}`);
});
