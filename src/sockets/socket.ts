import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to real-time server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from real-time server');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscribe to board updates
  subscribeToBoard(boardId: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.emit('join_board', boardId);
      this.socket.on('board_updated', callback);
    }
  }

  // Unsubscribe from board updates
  unsubscribeFromBoard(boardId: string) {
    if (this.socket) {
      this.socket.emit('leave_board', boardId);
      this.socket.off('board_updated');
    }
  }

  // Emit task movement
  moveTask(taskId: string, newColumnId: string, newIndex: number) {
    if (this.socket) {
      this.socket.emit('task_moved', { taskId, newColumnId, newIndex });
    }
  }
}

export const socketService = new SocketService();
