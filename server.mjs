import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4188);

http.createServer((request, response) => {
  const requestPath = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`).pathname;
  const filePath = requestPath === '/' ? path.join(root, 'index.html') : path.join(root, requestPath.replace(/^\/+/, ''));
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  const extension = path.extname(filePath);
  const contentType = extension === '.html' ? 'text/html; charset=utf-8' : extension === '.md' ? 'text/markdown; charset=utf-8' : 'application/octet-stream';
  response.writeHead(200, { 'content-type': contentType, 'cache-control': 'no-store' });
  fs.createReadStream(filePath).pipe(response);
}).listen(port, '0.0.0.0', () => console.log(`briefing-preview-ready port ${port}`));
