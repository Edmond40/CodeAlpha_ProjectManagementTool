import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { cn } from '../utils/cn';

interface Sprint {
  id: string;
  name: string;
  status: 'Active' | 'Planning' | 'Completed';
  startDate: string;
  endDate: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

const mockSprints: Sprint[] = [
  { id: '1', name: 'Sprint 47', status: 'Active', startDate: 'May 12', endDate: 'May 26', progress: 65, totalTasks: 20, completedTasks: 13 },
  { id: '2', name: 'Sprint 46', status: 'Completed', startDate: 'Apr 28', endDate: 'May 11', progress: 100, totalTasks: 22, completedTasks: 22 },
  { id: '3', name: 'Sprint 48', status: 'Planning', startDate: 'May 27', endDate: 'Jun 10', progress: 0, totalTasks: 18, completedTasks: 0 },
  { id: '4', name: 'Sprint 45', status: 'Completed', startDate: 'Apr 14', endDate: 'Apr 27', progress: 100, totalTasks: 24, completedTasks: 24 },
];

const statusColor: Record<string, string> = {
  Active: 'text-emerald-500 bg-emerald-500/10',
  Planning: 'text-blue-500 bg-blue-500/10',
  Completed: 'text-slate-500 bg-slate-500/10',
};

export function SprintPage() {
  const [sprints] = useState(mockSprints);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Sprint Cycles</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Current and past sprints</p>
      </div>

      <div className="space-y-3">
        {sprints.map((sprint) => (
          <motion.div
            key={sprint.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-primary/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-[var(--foreground)]">{sprint.name}</h3>
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', statusColor[sprint.status])}>
                    {sprint.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {sprint.startDate} – {sprint.endDate}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {sprint.completedTasks}/{sprint.totalTasks}
                  </span>
                </div>
              </div>
              <button className="p-1 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sprint.progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  sprint.status === 'Completed' ? 'bg-emerald-500' : sprint.status === 'Active' ? 'bg-primary' : 'bg-blue-500'
                }`}
              />
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-1.5">{sprint.progress}% complete</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
