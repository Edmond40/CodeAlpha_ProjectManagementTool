import http from 'http';
import app from './app';
import { config } from './config';
import { initializeSocketServer } from './sockets';
import { registerBackgroundJobs } from './jobs/schedule';

export function createServer() {
  const httpServer = http.createServer(app);
  const socketServer = initializeSocketServer(httpServer);
  registerBackgroundJobs();
  return { app, httpServer, socketServer };
}

if (require.main === module) {
  const { httpServer } = createServer();
  httpServer.listen(config.port, () => {
    console.log(`Planora backend listening on port ${config.port}`);
  });
}
