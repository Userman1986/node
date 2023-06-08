const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // Log the request URL and timestamp to log.txt
  const logEntry = `${req.url} - ${new Date().toISOString()}\n`;
  fs.appendFile('log.txt', logEntry, (err) => {
    if (err) {
      console.error('Error writing to log.txt:', err);
    }
  });

  // Parse the requested URL
  const parsedUrl = url.parse(req.url, true);

  // Get the path from the parsed URL
  const path = parsedUrl.pathname;

  // Check if the URL contains the word "documentation"
  if (path.includes('documentation')) {
    // If the URL contains "documentation", return the "documentation.html" file
    fs.readFile('documentation.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading documentation.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    // If the URL does not contain "documentation", return the "index.html" file
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
