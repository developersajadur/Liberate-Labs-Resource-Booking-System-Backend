import { Server } from 'http';
import app from './app';
import config from './app/config';

const port = config.port || 5000;

let server: Server;

async function main() {
  try {
    server = app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

// Global error handlers
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection detected, shutting down...', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception detected, shutting down...', error);
  process.exit(1);
});
