import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Filter, Grid, List as ListIcon, 
  MoreVertical, Calendar, CheckCircle2
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent } from '../components/Card';

import { useProjectStore } from '../store/useProjectStore';
import { useUIStore } from '../store/useUIStore';

export function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { searchQuery, setSearchQuery, filteredProjects } = useProjectStore();
  // We need deleteProject but it's not in the store yet, so I will add it to the store in another call, or just simulate it.
  const { openProjectModal } = useUIStore();
  const projects = filteredProjects();

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your workspaces.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => openProjectModal()}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-2 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9 h-10 w-full" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center bg-muted p-1 rounded-xl">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow h-full flex flex-col group cursor-pointer">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    project.status === 'Completed' ? 'bg-green-500/10 text-green-600' :
                    project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600' :
                    project.status === 'Review' ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-slate-500/10 text-slate-600'
                  }`}>
                    {project.status}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProjectModal(project.id);
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">{project.description}</p>

                <div className="space-y-4 mt-auto">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">Progress</span>
                      <span className="text-muted-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${project.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                        style={{ width: `${project.progress}%` }} 
                      />
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{project.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{project.tasks.completed}/{project.tasks.total}</span>
                      </div>
                    </div>
                    <div className="flex items-center -space-x-2">
                      {[1, 2, 3].map((avatar) => (
                        <div key={avatar} className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                          {avatar === 3 ? '+2' : 'U'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
