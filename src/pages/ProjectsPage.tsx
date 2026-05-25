import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Grid, List as ListIcon, MoreVertical, Calendar, CheckCircle2
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterPanel } from '../components/ui/FilterPanel';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { useProjectStore } from '../store/useProjectStore';
import { useFilterStore } from '../store/useFilterStore';
import { useUIStore } from '../store/useUIStore';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { cn } from '../utils/cn';

export function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { searchQuery, setSearchQuery, filteredProjects } = useProjectStore();
  const { projectFilters, setProjectFilters, resetProjectFilters } = useFilterStore();
  const { openProjectModal } = useUIStore();

  const projects = filteredProjects(projectFilters.statuses);
  const activeFilterCount = projectFilters.statuses.length;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all your workspaces.</p>
        </div>
        <Button onClick={() => openProjectModal()} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card p-2 rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 h-10 w-full text-sm"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <FilterPanel
            activeCount={activeFilterCount}
            onReset={resetProjectFilters}
            fields={[
              {
                id: 'status',
                label: 'Status',
                type: 'multi-select',
                options: [
                  { value: 'Planning', label: 'Planning' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Review', label: 'Review' },
                  { value: 'Completed', label: 'Completed' },
                ],
                value: projectFilters.statuses,
                onChange: (v) => setProjectFilters({ statuses: v as string[] }),
              },
            ]}
          />
        </div>

        <SegmentedControl
          value={view}
          onChange={setView}
          size="sm"
          options={[
            { value: 'grid', label: 'Grid', icon: <Grid className="w-3.5 h-3.5" /> },
            { value: 'list', label: 'List', icon: <ListIcon className="w-3.5 h-3.5" /> },
          ]}
        />
      </motion.div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No projects found"
          description={searchQuery || activeFilterCount ? 'Try adjusting your search or filters.' : 'Create your first project to get started.'}
          action={
            !searchQuery && !activeFilterCount ? (
              <Button onClick={() => openProjectModal()}>
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            ) : undefined
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card className="card-hover h-full flex flex-col group cursor-pointer" onClick={() => openProjectModal(project.id)}>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        variant={
                          project.status === 'Completed'
                            ? 'success'
                            : project.status === 'In Progress'
                              ? 'info'
                              : project.status === 'Review'
                                ? 'warning'
                                : 'default'
                        }
                      >
                        {project.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProjectModal(project.id);
                        }}
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <h3 className="text-base font-bold mb-1.5 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{project.description}</p>

                    <div className="space-y-3 mt-auto">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-foreground">Progress</span>
                          <span className="text-muted-foreground">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all', project.progress === 100 ? 'bg-emerald-500' : 'bg-primary')}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{project.deadline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              {project.tasks.completed}/{project.tasks.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Deadline</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => openProjectModal(project.id)}>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-foreground">{project.name}</span>
                      <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={project.status === 'Completed' ? 'success' : 'info'}>{project.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{project.deadline}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openProjectModal(project.id); }}>
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
