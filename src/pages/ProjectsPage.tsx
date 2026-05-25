import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MoreVertical, Calendar, CheckCircle2, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterPanel } from '../components/ui/FilterPanel';
import { ProjectViewOptionsPopover } from '../components/ui/ProjectViewOptionsPopover';
import { TabFilters } from '../components/ui/TabFilters';
import { useProjectStore } from '../store/useProjectStore';
import { useFilterStore } from '../store/useFilterStore';
import { useUIStore } from '../store/useUIStore';

const PROJECT_COLUMNS = [
  { id: 'backlog', title: 'Backlog', statuses: ['Planning'] as string[] },
  { id: 'planned', title: 'Planned', statuses: [] as string[] },
  { id: 'in-progress', title: 'In Progress', statuses: ['In Progress', 'Review'] },
  { id: 'done', title: 'Done', statuses: ['Completed'] },
];

export function ProjectsPage() {
  const { searchQuery, setSearchQuery, filteredProjects } = useProjectStore();
  const {
    projectFilters,
    setProjectFilters,
    resetProjectFilters,
    projectViewOptions,
    projectListTab,
    setProjectListTab,
  } = useFilterStore();
  const { openProjectModal } = useUIStore();

  const projects = useMemo(() => {
    let list = filteredProjects(projectFilters.statuses);
    if (projectViewOptions.showClosedProjects === 'none') {
      list = list.filter((p) => p.status !== 'Completed');
    }
    if (projectListTab === 'active') {
      list = list.filter((p) => p.status === 'In Progress' || p.status === 'Review');
    }
    return list;
  }, [filteredProjects, projectFilters.statuses, projectViewOptions.showClosedProjects, projectListTab]);

  const activeFilterCount = projectFilters.statuses.length;

  if (projectViewOptions.layout === 'board') {
    return (
      <div className="flex flex-col h-full overflow-hidden space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Projects</h1>
            <button type="button" className="text-muted-foreground hover:text-amber-400">
              <Star className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-48 hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                className="pl-8 h-9 text-xs"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ProjectFilterPanel
              activeCount={activeFilterCount}
              statuses={projectFilters.statuses}
              onChange={(s) => setProjectFilters({ statuses: s })}
              onReset={resetProjectFilters}
            />
            <ProjectViewOptionsPopover />
            <Button size="sm" className="h-9" onClick={() => openProjectModal()}>
              <Plus className="w-3.5 h-3.5 mr-1" /> New
            </Button>
          </div>
        </div>
        <TabFilters
          value={projectListTab}
          onChange={setProjectListTab}
          tabs={[
            { value: 'all', label: 'All projects' },
            { value: 'active', label: 'Active' },
          ]}
        />
        <div className="flex-1 overflow-x-auto pb-4 min-h-0">
          <div className="flex gap-3 min-w-max h-full">
            {PROJECT_COLUMNS.map((col) => {
              const colProjects =
                col.statuses.length > 0
                  ? projects.filter((p) => col.statuses.includes(p.status))
                  : [];
              const showCol = projectViewOptions.showEmptyColumns || colProjects.length > 0 || col.id === 'planned';
              if (!showCol) return null;
              return (
                <div key={col.id} className="flex-shrink-0 w-72 flex flex-col">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {col.title} {colProjects.length}
                    </span>
                    <button type="button" onClick={() => openProjectModal()} className="text-muted-foreground hover:text-foreground p-1">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-2 min-h-[120px] rounded-xl bg-muted/20 p-2 border border-border/50">
                    {colProjects.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => openProjectModal(project.id)}
                        className="w-full text-left bg-card border border-border rounded-lg p-3 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{project.name}</span>
                          <MoreVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {project.deadline}
                          <span>·</span>
                          <span>{project.tasks.total} tasks</span>
                        </div>
                      </button>
                    ))}
                    {col.id === 'planned' && colProjects.length === 0 && (
                      <button
                        type="button"
                        onClick={() => openProjectModal()}
                        className="w-full h-24 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-muted/30"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-foreground">Projects</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 h-9 text-sm"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ProjectFilterPanel
            activeCount={activeFilterCount}
            statuses={projectFilters.statuses}
            onChange={(s) => setProjectFilters({ statuses: s })}
            onReset={resetProjectFilters}
          />
          <ProjectViewOptionsPopover />
          <Button onClick={() => openProjectModal()} className="gap-2 h-9">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No projects found"
          description="Adjust filters or create a new project."
          action={<Button onClick={() => openProjectModal()}><Plus className="mr-2 h-4 w-4" /> New Project</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="card-hover cursor-pointer h-full" onClick={() => openProjectModal(project.id)}>
                  <CardContent className="p-5">
                    <Badge variant={project.status === 'Completed' ? 'success' : 'info'}>{project.status}</Badge>
                    <h3 className="text-base font-bold mt-2">{project.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
                    <div className="flex gap-3 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{project.deadline}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{project.tasks.completed}/{project.tasks.total}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function ProjectFilterPanel({
  activeCount,
  statuses,
  onChange,
  onReset,
}: {
  activeCount: number;
  statuses: string[];
  onChange: (s: string[]) => void;
  onReset: () => void;
}) {
  return (
    <FilterPanel
      activeCount={activeCount}
      onReset={onReset}
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
          value: statuses,
          onChange: (v) => onChange(v as string[]),
        },
      ]}
    />
  );
}
