const http = require('http');
const fs = require('fs');
const path = require('path');

// Use PORT env var, or --port flag, or default 4000
const args = process.argv.slice(2);
const portFlagIdx = args.indexOf('--port');
const PORT = process.env.PORT
  || (portFlagIdx !== -1 ? parseInt(args[portFlagIdx + 1]) : null)
  || 4000;

const BASE_DIR = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(BASE_DIR, req.url === '/' ? '/index.html' : req.url);

  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + req.url);
      return;
    }
    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600' });
    res.end(data);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n✗ Port ${PORT} is already in use.`);
    console.error(`  Try: node server.js --port 5001\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`\n✦ AURUM is live → http://localhost:${PORT}\n`);
  console.log('  Press Ctrl+C to stop.\n');
});