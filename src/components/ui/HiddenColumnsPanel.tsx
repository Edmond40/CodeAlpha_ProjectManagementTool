import { ChevronDown, Circle, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { cn } from '../../utils/cn';

const HIDDEN_STATUSES = [
  { id: 'backlog', label: 'Backlog', icon: <Circle className="w-3.5 h-3.5 text-slate-500 stroke-dashed" strokeDasharray="3 3" /> },
  { id: 'review-hidden', label: 'In Review', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
  { id: 'done-hidden', label: 'Done', icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> },
  { id: 'canceled', label: 'Canceled', icon: <XCircle className="w-3.5 h-3.5 text-slate-500" /> },
  { id: 'duplicate', label: 'Duplicate', icon: <Copy className="w-3.5 h-3.5 text-slate-500" /> },
];

export function HiddenColumnsPanel({ taskCounts }: { taskCounts?: Record<string, number> }) {
  const { hiddenColumnIds, toggleHiddenColumn } = useFilterStore();

  return (
    <div className="flex-shrink-0 w-48 pt-2">
      <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-muted-foreground">
        <ChevronDown className="w-3.5 h-3.5" />
        Hidden columns
      </div>
      <div className="space-y-0.5 mt-1">
        {HIDDEN_STATUSES.map((col) => {
          const isHidden = hiddenColumnIds.includes(col.id);
          const count = taskCounts?.[col.id] ?? 0;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => toggleHiddenColumn(col.id)}
              className={cn(
                'w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors',
                isHidden ? 'text-muted-foreground hover:bg-muted hover:text-foreground' : 'bg-primary/10 text-primary'
              )}
              title={isHidden ? 'Show column' : 'Hide column'}
            >
              <span className="flex items-center gap-2 truncate">
                {col.icon}
                {col.label}
              </span>
              <span className="text-muted-foreground tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
