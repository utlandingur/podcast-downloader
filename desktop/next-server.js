const http = require('http');
const path = require('path');
const next = require('next');

const dir = process.env.NEXT_SERVER_DIR || process.cwd();
const port = process.env.NEXT_SERVER_PORT
  ? Number.parseInt(process.env.NEXT_SERVER_PORT, 10)
  : 3000;

const app = next({ dev: false, dir });
const handle = app.getRequestHandler();
let server;

const start = async () => {
  try {
    await app.prepare();
    server = http.createServer((req, res) => handle(req, res));
    server.listen(port, '127.0.0.1', () => {
      process.stdout.write(`Next server listening on ${port}\n`);
    });
  } catch (error) {
    process.stderr.write(`Failed to start Next server: ${error}\n`);
    process.exit(1);
  }
};

const shutdown = () => {
  if (server) {
    server.close(() => process.exit(0));
    return;
  }
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
