import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MessageSquare, MoreHorizontal, Flag } from 'lucide-react';
import type { Task } from '../../store/useBoardStore';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';
import { PRIORITY_COLORS } from '../../constants';
import { cn } from '../../utils/cn';

interface BoardTaskProps {
  task: Task;
}

export function BoardTask({ task }: BoardTaskProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
  });
  const { openTaskModal } = useUIStore();
  const { viewOptions } = useFilterStore();
  const show = (prop: string) => viewOptions.displayProperties.includes(prop);

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="opacity-30 rounded-xl border-2 border-dashed border-primary bg-card/30 h-[100px]" />
    );
  }

  const priority = task.priority as keyof typeof PRIORITY_COLORS;
  const taskId = task.id.toUpperCase().replace(/^T/, 'DEV-');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openTaskModal(task.id)}
      className="bg-card p-3 rounded-xl border border-border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-md transition-all flex flex-col gap-2 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {show('id') && (
            <span className="text-[11px] font-mono text-muted-foreground shrink-0">{taskId}</span>
          )}
          {show('priority') && priority && task.priority === 'High' && (
            <Flag className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          )}
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-0.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      <h4 className="font-medium text-sm text-foreground leading-snug">{task.title}</h4>

      {show('labels') && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.slice(0, 2).map((label) => (
            <span key={label} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          {show('priority') && task.priority !== 'High' && (
            <span className={cn('font-medium', PRIORITY_COLORS[priority]?.text)}>{task.priority}</span>
          )}
          {task.comments > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare className="w-3 h-3" />
              {task.comments}
            </span>
          )}
          {show('created') && <span>May 22</span>}
        </div>
        {show('assignee') && task.assignees.length > 0 && (
          <div className="flex -space-x-1">
            {task.assignees.slice(0, 2).map((a, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-muted border border-card flex items-center justify-center text-[8px] font-bold"
              >
                {a[0]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
