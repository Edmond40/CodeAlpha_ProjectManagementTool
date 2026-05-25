import { useEffect, useCallback, useRef } from 'react';
import { socketService } from '../sockets/socket';

export function useSocketBoard(boardId: string) {
  const callbackRef = useRef<((data: any) => void) | null>(null);

  useEffect(() => {
    socketService.subscribeToBoard(boardId, (data) => {
      callbackRef.current?.(data);
    });
    return () => socketService.unsubscribeFromBoard(boardId);
  }, [boardId]);

  const onBoardUpdate = useCallback((cb: (data: any) => void) => {
    callbackRef.current = cb;
  }, []);

  const moveTask = useCallback((taskId: string, newColumnId: string, newIndex: number) => {
    socketService.moveTask(taskId, newColumnId, newIndex);
  }, []);

  return { onBoardUpdate, moveTask };
}
