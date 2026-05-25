import { useMemo } from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus } from 'lucide-react';
import type { Column, Task } from '../../store/useBoardStore';
import { useUIStore } from '../../store/useUIStore';
import { BoardTask } from './BoardTask';
import { cn } from '../../utils/cn';

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
}

const columnColors: Record<string, string> = {
  backlog: 'bg-slate-500/10 border-slate-500/20',
  todo: 'bg-blue-500/10 border-blue-500/20',
  'in-progress': 'bg-amber-500/10 border-amber-500/20',
  review: 'bg-violet-500/10 border-violet-500/20',
  done: 'bg-emerald-500/10 border-emerald-500/20',
};

const columnDots: Record<string, string> = {
  backlog: 'bg-slate-400',
  todo: 'bg-blue-400',
  'in-progress': 'bg-amber-400',
  review: 'bg-violet-400',
  done: 'bg-emerald-400',
};

export function BoardColumn({ column, tasks }: BoardColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const { openCreateTaskModal } = useUIStore();

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: 'Column', column },
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="opacity-30 border-2 border-dashed border-primary bg-muted/30 rounded-2xl w-72 flex-shrink-0" />
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={cn('bg-muted/20 rounded-2xl w-72 flex-shrink-0 flex flex-col max-h-full border', columnColors[column.id] || 'border-border/50')}>
      {/* Column Header */}
      <div {...attributes} {...listeners} className="p-3.5 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-border/30 rounded-t-2xl bg-card/40">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', columnDots[column.id])} />
          <h3 className="font-semibold text-sm text-foreground">{column.title}</h3>
          <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {tasks.length}
          </span>
        </div>
        <div className="flex gap-0.5">
          <button onClick={() => openCreateTaskModal(column.id)} className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="p-2.5 flex flex-col gap-2.5 overflow-y-auto flex-1 min-h-[120px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <BoardTask key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-muted-foreground/60">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
