import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { ViewOptionsPopover } from '../components/ui/ViewOptionsPopover';
import { FilterPanel } from '../components/ui/FilterPanel';
import { Button } from '../components/Button';
import { useUIStore } from '../store/useUIStore';

type TaskStatus = 'Todo' | 'In Progress' | 'Done';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  project: string;
  dueDate: string;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Redesign navigation sidebar', status: 'In Progress', priority: 'High', project: 'Dashboard Redesign', dueDate: 'May 28' },
  { id: '2', title: 'Create color token documentation', status: 'Todo', priority: 'Medium', project: 'Design System v2', dueDate: 'Jun 02' },
  { id: '3', title: 'Finalize mobile breakpoints', status: 'Done', priority: 'Medium', project: 'Dashboard Redesign', dueDate: 'May 20' },
  { id: '4', title: 'Accessibility audit report', status: 'Todo', priority: 'Urgent', project: 'Design System v2', dueDate: 'May 25' },
  { id: '5', title: 'Icon set optimization', status: 'Todo', priority: 'Low', project: 'Dashboard Redesign', dueDate: 'Jun 10' },
  { id: '6', title: 'Implement rate limiting middleware', status: 'In Progress', priority: 'High', project: 'API Gateway', dueDate: 'May 30' },
];

const priorityColor: Record<string, string> = {
  Urgent: 'text-red-500 bg-red-500/10',
  High: 'text-orange-500 bg-orange-500/10',
  Medium: 'text-blue-500 bg-blue-500/10',
  Low: 'text-slate-500 bg-slate-500/10',
};

export function MyTasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [tab, setTab] = useState<'assigned' | 'created' | 'subscribed' | 'activity'>('assigned');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const { openCreateTaskModal } = useUIStore();

  const filtered = tasks.filter((t) => {
    if (statusFilter.length && !statusFilter.includes(t.status)) return false;
    if (priorityFilter.length && !priorityFilter.includes(t.priority)) return false;
    return true;
  });

  const toggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'Done' ? 'Todo' : 'Done' } : t))
    );
  };

  const activeFilterCount = statusFilter.length + priorityFilter.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">{tasks.length} tasks across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterPanel
            activeCount={activeFilterCount}
            onReset={() => { setStatusFilter([]); setPriorityFilter([]); }}
            fields={[
              {
                id: 'status',
                label: 'Status',
                type: 'multi-select',
                options: [
                  { value: 'Todo', label: 'Todo' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Done', label: 'Done' },
                ],
                value: statusFilter,
                onChange: (v) => setStatusFilter(v as string[]),
              },
              {
                id: 'priority',
                label: 'Priority',
                type: 'multi-select',
                options: [
                  { value: 'Urgent', label: 'Urgent' },
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' },
                ],
                value: priorityFilter,
                onChange: (v) => setPriorityFilter(v as string[]),
              },
            ]}
          />
          <ViewOptionsPopover />
          <Button size="sm" className="h-9 gap-1.5" onClick={() => openCreateTaskModal()}>
            <Plus className="w-3.5 h-3.5" /> New
          </Button>
        </div>
      </div>

      <SegmentedControl
        value={tab}
        onChange={setTab}
        size="sm"
        options={[
          { value: 'assigned', label: 'Assigned' },
          { value: 'created', label: 'Created' },
          { value: 'subscribed', label: 'Subscribed' },
          { value: 'activity', label: 'Activity' },
        ]}
      />

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.map((task) => (
            <motion.div
              key={task.id}
              layout
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
            >
              <button
                onClick={() => toggleDone(task.id)}
                className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
              >
                {task.status === 'Done' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span
                  className={cn(
                    'text-sm',
                    task.status === 'Done' ? 'line-through text-muted-foreground' : 'text-foreground'
                  )}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">{task.project}</span>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {task.dueDate}
                  </span>
                </div>
              </div>
              <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', priorityColor[task.priority])}>
                {task.priority}
              </span>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No tasks match this filter.</div>
        )}
      </div>
    </div>
  );
}
