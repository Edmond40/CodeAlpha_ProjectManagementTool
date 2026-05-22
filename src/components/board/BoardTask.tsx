import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MessageSquare, MoreHorizontal, Clock } from 'lucide-react';
import type { Task } from '../../store/useBoardStore';
import { useUIStore } from '../../store/useUIStore';

interface BoardTaskProps {
  task: Task;
}

export function BoardTask({ task }: BoardTaskProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const { openTaskModal } = useUIStore();

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 rounded-xl border-2 border-primary bg-card/50 h-[140px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openTaskModal(task.id)}
      className="bg-card p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors flex flex-col gap-3 group relative"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span key={label} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {label}
            </span>
          ))}
          {task.priority === 'High' && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-destructive/10 text-destructive">
              High
            </span>
          )}
        </div>
        <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium">
          {task.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comments}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Oct 12</span>
          </div>
        </div>
        
        {task.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignees.map((a, i) => (
              <div key={i} className="h-6 w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[9px] font-bold">
                {a[0]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
