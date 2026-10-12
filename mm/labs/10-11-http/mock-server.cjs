// Companion mock API, plain Node.js. Start outside src: node mock-server.cjs
const http = require('node:http');
const rows = [
  { ticker: 'VOD.L', quantity: 800, price: 0.72 },
  { ticker: 'HSBA.L', quantity: 300, price: 6.4 },
];
const ALLOWED_ORIGIN = 'http://localhost:4200';
const server = http.createServer((req, res) => {
  if (req.headers.origin === ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'GET' && req.url === '/api/holdings') {
    res.writeHead(200); res.end(JSON.stringify(rows));
  } else if (req.method === 'GET' && req.url === '/api/holdings/error') {
    res.writeHead(500); res.end(JSON.stringify({ message: 'The lighthouse API is temporarily unavailable' }));
  } else { res.writeHead(404); res.end(JSON.stringify({ message: 'Not found' })); }
});
if (require.main === module) server.listen(3500, () => console.log('Mock API on http://localhost:3500'));
module.exports = server;
