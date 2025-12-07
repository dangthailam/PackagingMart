const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // Enable gzip compression for JSON files
      if (extname === '.json') {
        const acceptEncoding = req.headers['accept-encoding'] || '';
        if (acceptEncoding.includes('gzip')) {
          zlib.gzip(content, (err, compressed) => {
            if (err) {
              res.writeHead(500);
              res.end('Compression error');
              return;
            }
            res.writeHead(200, { 
              'Content-Type': contentType,
              'Content-Encoding': 'gzip',
              'Cache-Control': 'public, max-age=31536000'
            });
            res.end(compressed);
          });
          return;
        }
      }
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': extname === '.json' ? 'public, max-age=31536000' : 'no-cache'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}/`);
  console.log(`\n🌐 Open your browser and go to: http://localhost:${PORT}\n`);
  console.log('Press Ctrl+C to stop the server\n');
});
