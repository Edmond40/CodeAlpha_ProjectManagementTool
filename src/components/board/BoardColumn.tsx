import { useMemo } from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus } from 'lucide-react';
import type { Column, Task } from '../../store/useBoardStore';
import { useUIStore } from '../../store/useUIStore';
import { BoardTask } from './BoardTask';

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
}

export function BoardColumn({ column, tasks }: BoardColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const { openCreateTaskModal } = useUIStore();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-primary bg-muted rounded-2xl w-80 h-[500px] flex-shrink-0"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-muted/30 rounded-2xl w-80 flex-shrink-0 flex flex-col max-h-full border shadow-sm"
    >
      {/* Column Header */}
      <div
        {...attributes}
        {...listeners}
        className="p-4 flex items-center justify-between cursor-grab active:cursor-grabbing border-b bg-card rounded-t-2xl"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => openCreateTaskModal(column.id)}
            className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:bg-secondary rounded"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:bg-secondary rounded">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="p-3 flex flex-col gap-3 overflow-y-auto flex-1 min-h-[150px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <BoardTask key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
