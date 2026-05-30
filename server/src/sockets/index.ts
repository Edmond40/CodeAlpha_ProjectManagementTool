import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import { asyncHandler } from '../utils/asyncHandler';

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    try {
      const payload = verifyToken(token);
      socket.data.userId = payload.userId;
      socket.data.teamId = payload.teamId;
      next();
    } catch (error) {
      next(new Error('Socket authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const teamId = socket.data.teamId;
    if (teamId) {
      socket.join(`team_${teamId}`);
    }

    socket.on('switch_team', ({ teamId: newTeamId }) => {
      if (teamId) socket.leave(`team_${teamId}`);
      socket.join(`team_${newTeamId}`);
      socket.data.teamId = newTeamId;
      io.to(`team_${newTeamId}`).emit('team_switched', { teamId: newTeamId, userId: socket.data.userId });
    });

    socket.on('task_updated', (payload) => {
      if (socket.data.teamId) {
        io.to(`team_${socket.data.teamId}`).emit('task_updated', payload);
      }
    });

    socket.on('activity_logged', (payload) => {
      if (socket.data.teamId) {
        io.to(`team_${socket.data.teamId}`).emit('activity_logged', payload);
      }
    });
  });

  return io;
}
