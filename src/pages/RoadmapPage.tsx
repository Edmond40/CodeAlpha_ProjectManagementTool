import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '../utils/cn';

interface Milestone {
  id: string;
  name: string;
  quarter: string;
  status: 'On track' | 'At risk' | 'Completed';
  progress: number;
  dueDate: string;
  description: string;
}

const mockRoadmap: Milestone[] = [
  { id: '1', name: 'Q2 2026 — Platform Foundation', quarter: 'Q2 2026', status: 'On track', progress: 72, dueDate: 'Jun 30', description: 'Core platform infrastructure, auth, and team management' },
  { id: '2', name: 'Q3 2026 — Feature Expansion', quarter: 'Q3 2026', status: 'At risk', progress: 35, dueDate: 'Sep 30', description: 'Advanced boards, integrations, and analytics' },
  { id: '3', name: 'Q4 2026 — Enterprise Ready', quarter: 'Q4 2026', status: 'On track', progress: 15, dueDate: 'Dec 31', description: 'SSO, audit logs, RBAC, and compliance' },
  { id: '4', name: 'Mobile App Launch', quarter: 'H1 2027', status: 'On track', progress: 8, dueDate: 'Mar 31', description: 'Native iOS and Android apps' },
];

const statusColor: Record<string, string> = {
  'On track': 'text-emerald-500 bg-emerald-500/10',
  'At risk': 'text-amber-500 bg-amber-500/10',
  'Completed': 'text-slate-500 bg-slate-500/10',
};

const statusDot: Record<string, string> = {
  'On track': 'bg-emerald-500',
  'At risk': 'bg-amber-500',
  'Completed': 'bg-primary',
};

export function RoadmapPage() {
  const [milestones] = useState(mockRoadmap);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Roadmap</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Product milestones and timeline</p>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[var(--border)]" />
        <div className="space-y-6">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-10"
            >
              <div className={cn('absolute left-3 top-1.5 w-3 h-3 rounded-full ring-4 ring-[var(--background)]', statusDot[milestone.status])} />
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-[var(--foreground)]">{milestone.name}</h3>
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', statusColor[milestone.status])}>
                        {milestone.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">{milestone.description}</p>
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)] shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {milestone.dueDate}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--muted-foreground)]">{milestone.quarter}</span>
                  <div className="flex-1 h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${milestone.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--foreground)]">{milestone.progress}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
