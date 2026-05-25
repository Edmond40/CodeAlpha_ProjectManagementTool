export const PRIORITY_COLORS = {
  Urgent: { bg: 'bg-red-500/10', text: 'text-red-500', dot: 'bg-red-500' },
  High: { bg: 'bg-orange-500/10', text: 'text-orange-500', dot: 'bg-orange-500' },
  Medium: { bg: 'bg-blue-500/10', text: 'text-blue-500', dot: 'bg-blue-500' },
  Low: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
} as const;

export const STATUS_COLORS = {
  'Backlog': { bg: 'bg-slate-500/10', text: 'text-slate-400' },
  'Todo': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'In Progress': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'Review': { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  'Done': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
} as const;

export const ROLES = ['Admin', 'Manager', 'Member'] as const;

export const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Done' },
] as const;
