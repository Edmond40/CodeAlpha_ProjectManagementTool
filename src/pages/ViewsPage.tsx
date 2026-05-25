import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Table, BarChart3, GanttChartSquare, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
import { ViewOptionsPopover } from '../components/ui/ViewOptionsPopover';
import { FilterPanel } from '../components/ui/FilterPanel';
import { NewViewModal } from '../components/modals/NewViewModal';
import { useNavigate } from 'react-router-dom';

type ViewType = 'board' | 'table' | 'timeline' | 'chart';

const views: { id: ViewType; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'board', label: 'Board', icon: LayoutGrid },
  { id: 'table', label: 'Table', icon: Table },
  { id: 'timeline', label: 'Timeline', icon: GanttChartSquare },
  { id: 'chart', label: 'Chart', icon: BarChart3 },
];

const mockSavedViews = [
  { name: 'Active Sprint', type: 'board' as ViewType, project: 'All', tasks: 24, href: '/dashboard/boards' },
  { name: 'Project Tracker', type: 'table' as ViewType, project: 'Dashboard Redesign', tasks: 16, href: '/dashboard/projects' },
  { name: 'Release Timeline', type: 'timeline' as ViewType, project: 'All', tasks: 42, href: '/dashboard/roadmaps' },
  { name: 'Burndown', type: 'chart' as ViewType, project: 'Sprint 47', tasks: 20, href: '/dashboard/analytics' },
];

export function ViewsPage() {
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [newViewOpen, setNewViewOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const navigate = useNavigate();

  const filtered = typeFilter.length
    ? mockSavedViews.filter((v) => typeFilter.includes(v.type))
    : mockSavedViews;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Views</h1>
          <p className="text-sm text-muted-foreground mt-1">Saved views and perspectives</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterPanel
            activeCount={typeFilter.length}
            onReset={() => setTypeFilter([])}
            fields={[
              {
                id: 'type',
                label: 'View type',
                type: 'multi-select',
                options: views.map((v) => ({ value: v.id, label: v.label })),
                value: typeFilter,
                onChange: (v) => setTypeFilter(v as string[]),
              },
            ]}
          />
          <ViewOptionsPopover />
          <button
            onClick={() => setNewViewOpen(true)}
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New view
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all',
              activeView === v.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            <v.icon className="w-4 h-4" />
            {v.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((view) => {
          const Icon = views.find((v) => v.id === view.type)?.icon ?? LayoutGrid;
          return (
            <motion.div
              key={view.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(view.href)}
              className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{view.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{view.project}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">{view.tasks} tasks</span>
                <span className="text-[10px] font-medium capitalize text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {view.type}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <NewViewModal open={newViewOpen} onClose={() => setNewViewOpen(false)} />
    </div>
  );
}
