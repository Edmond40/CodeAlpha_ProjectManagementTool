import { useState } from 'react';
import {
  Filter, X, Sparkles, Circle, User, Flag, Tag, FolderKanban, Calendar,
  UserCircle, ChevronRight, Search
} from 'lucide-react';
import { Button } from '../Button';
import { Popover } from './Popover';
import { useFilterStore } from '../../store/useFilterStore';
import { cn } from '../../utils/cn';
import { countActiveFilters } from '../../utils/filterTasks';

type FilterCategory = 'status' | 'assignee' | 'priority' | 'labels' | 'project' | 'dates';

const CATEGORIES: { id: FilterCategory; label: string; icon: React.ReactNode; hasSub: boolean }[] = [
  { id: 'status', label: 'Status', icon: <Circle className="w-3.5 h-3.5" />, hasSub: true },
  { id: 'assignee', label: 'Assignee', icon: <User className="w-3.5 h-3.5" />, hasSub: true },
  { id: 'priority', label: 'Priority', icon: <Flag className="w-3.5 h-3.5" />, hasSub: true },
  { id: 'labels', label: 'Labels', icon: <Tag className="w-3.5 h-3.5" />, hasSub: true },
  { id: 'project', label: 'Project', icon: <FolderKanban className="w-3.5 h-3.5" />, hasSub: true },
  { id: 'dates', label: 'Dates', icon: <Calendar className="w-3.5 h-3.5" />, hasSub: true },
];

interface AdvancedFilterMenuProps {
  statusOptions?: { value: string; label: string }[];
  assigneeOptions?: { value: string; label: string }[];
  labelOptions?: { value: string; label: string }[];
  className?: string;
}

export function AdvancedFilterMenu({
  statusOptions = [
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ],
  assigneeOptions = [],
  labelOptions = [],
  className,
}: AdvancedFilterMenuProps) {
  const { boardFilters, setBoardFilters, resetBoardFilters } = useFilterStore();
  const [activeCategory, setActiveCategory] = useState<FilterCategory | null>(null);
  const [search, setSearch] = useState('');
  const activeCount = countActiveFilters(boardFilters);

  const toggleArray = (key: 'statuses' | 'assignees' | 'priorities' | 'labels', value: string) => {
    const current = boardFilters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setBoardFilters({ [key]: next });
  };

  const filteredCategories = search
    ? CATEGORIES.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : CATEGORIES;

  const subPanel = () => {
    if (!activeCategory) return null;
    if (activeCategory === 'assignee') {
      return (
        <div className="border-l border-border pl-2 min-w-[160px]">
          <p className="text-[10px] font-semibold uppercase text-muted-foreground px-2 py-1.5">Assignees</p>
          <button
            type="button"
            onClick={() => setBoardFilters({ noAssignee: !boardFilters.noAssignee })}
            className={cn(
              'w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm',
              boardFilters.noAssignee ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
            )}
          >
            <span className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" /> No assignee
            </span>
            <span className="text-xs text-muted-foreground">
              {assigneeOptions.length > 0 ? '—' : '5'}
            </span>
          </button>
          {assigneeOptions.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => toggleArray('assignees', a.value)}
              className={cn(
                'w-full text-left px-2 py-2 rounded-lg text-sm',
                boardFilters.assignees.includes(a.value) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      );
    }
    if (activeCategory === 'status') {
      return (
        <div className="border-l border-border pl-2 min-w-[160px]">
          <p className="text-[10px] font-semibold uppercase text-muted-foreground px-2 py-1.5">Status</p>
          {statusOptions.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => toggleArray('statuses', s.value)}
              className={cn(
                'w-full text-left px-2 py-2 rounded-lg text-sm',
                boardFilters.statuses.includes(s.value) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      );
    }
    if (activeCategory === 'priority') {
      return (
        <div className="border-l border-border pl-2 min-w-[160px]">
          <p className="text-[10px] font-semibold uppercase text-muted-foreground px-2 py-1.5">Priority</p>
          {['High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggleArray('priorities', p)}
              className={cn(
                'w-full text-left px-2 py-2 rounded-lg text-sm',
                boardFilters.priorities.includes(p) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      );
    }
    if (activeCategory === 'labels') {
      return (
        <div className="border-l border-border pl-2 min-w-[160px]">
          <p className="text-[10px] font-semibold uppercase text-muted-foreground px-2 py-1.5">Labels</p>
          {labelOptions.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">No labels yet</p>
          ) : (
            labelOptions.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => toggleArray('labels', l.value)}
                className={cn(
                  'w-full text-left px-2 py-2 rounded-lg text-sm',
                  boardFilters.labels.includes(l.value) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                )}
              >
                {l.label}
              </button>
            ))
          )}
        </div>
      );
    }
    return (
      <div className="border-l border-border pl-2 min-w-[140px] p-3 text-xs text-muted-foreground">
        Coming soon
      </div>
    );
  };

  return (
    <Popover
      className={className}
      contentClassName="p-0 w-auto"
      trigger={
        <Button
          variant="outline"
          size="sm"
          className={cn('h-9 gap-2 text-xs', activeCount > 0 && 'border-primary/50 text-primary')}
        >
          <Filter className="w-3.5 h-3.5" />
          Filter
          {activeCount > 0 && (
            <span className="h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      }
    >
      <div className="flex">
        <div className="w-56 p-2 border-r border-border">
          <div className="flex items-center gap-2 px-2 py-1.5 mb-1 border-b border-border">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Add filter..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {activeCount > 0 && (
              <button type="button" onClick={resetBoardFilters} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI filter
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Filter className="w-3.5 h-3.5" /> Advanced filter
          </button>
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onMouseEnter={() => setActiveCategory(cat.id)}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors',
                activeCategory === cat.id ? 'bg-muted text-foreground' : 'text-foreground hover:bg-muted'
              )}
            >
              <span className="flex items-center gap-2">
                {cat.icon}
                {cat.label}
              </span>
              {cat.hasSub && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          ))}
        </div>
        {subPanel()}
      </div>
    </Popover>
  );
}
