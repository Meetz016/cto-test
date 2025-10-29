import http from 'http';

import app from './app';
import { env } from './config/env';
import { disconnectPrisma } from './utils/prisma';

const server = http.createServer(app);
let isShuttingDown = false;

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server is running on http://localhost:${env.port}`);
});

const shutdown = async (signal: NodeJS.Signals | 'unhandledRejection' | 'uncaughtException') => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received. Closing server gracefully...`);

  server.close(async (closeError) => {
    if (closeError) {
      console.error(closeError);
      process.exit(1);
    }

    try {
      await disconnectPrisma();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception', error);
  void shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection', reason);
  void shutdown('unhandledRejection');
});
