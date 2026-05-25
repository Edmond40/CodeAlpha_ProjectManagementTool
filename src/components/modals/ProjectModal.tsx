import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Box, Flag, Users, Calendar } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUIStore } from '../../store/useUIStore';
import { useProjectStore } from '../../store/useProjectStore';
import { Button } from '../Button';
import { Input } from '../Input';
import { PillSelect } from '../ui/Select';

const schema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  status: z.enum(['Planning', 'In Progress', 'Review', 'Completed']),
});

type FormValues = z.infer<typeof schema>;

const statusOptions = [
  { value: 'Planning', label: 'Backlog', icon: <Box className="w-3.5 h-3.5 text-slate-400" /> },
  { value: 'In Progress', label: 'In Progress', icon: <Box className="w-3.5 h-3.5 text-amber-400" /> },
  { value: 'Review', label: 'In Review', icon: <Box className="w-3.5 h-3.5 text-violet-400" /> },
  { value: 'Completed', label: 'Done', icon: <Box className="w-3.5 h-3.5 text-emerald-400" /> },
];

export function ProjectModal() {
  const { isProjectModalOpen, activeProjectId, closeProjectModal, addToast } = useUIStore();
  const { projects, addProject, updateProject, removeProject } = useProjectStore();

  const project = activeProjectId ? projects.find((p) => p.id === activeProjectId) : null;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        deadline: project.deadline,
        status: project.status,
      });
    } else {
      reset({ name: '', description: '', deadline: '', status: 'Planning' });
    }
  }, [project, reset, isProjectModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProjectModal();
    };
    if (isProjectModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProjectModalOpen, closeProjectModal]);

  const onSubmit = (data: FormValues) => {
    if (project) {
      updateProject(project.id, data);
      addToast({ title: 'Project updated', description: `"${data.name}" has been saved.`, type: 'success' });
    } else {
      addProject({
        name: data.name,
        description: data.description,
        deadline: data.deadline,
        status: data.status,
        progress: 0,
        comments: 0,
        tasks: { completed: 0, total: 0 },
      });
      addToast({ title: 'Project created', description: `"${data.name}" is ready to go.`, type: 'success' });
    }
    closeProjectModal();
  };

  const handleDelete = () => {
    if (project) {
      removeProject(project.id);
      addToast({ title: 'Project deleted', description: `"${project.name}" has been removed.`, type: 'error' });
      closeProjectModal();
    }
  };

  if (!isProjectModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeProjectModal}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-xs text-muted-foreground font-medium">DEV › {project ? 'Edit project' : 'New project'}</p>
              <h2 className="text-xl font-bold text-foreground mt-0.5">
                {project ? project.name : 'New project'}
              </h2>
            </div>
            <button
              onClick={closeProjectModal}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('name')}
              placeholder="Project name"
              error={!!errors.name}
              className="text-lg font-bold border-0 px-0 focus-visible:ring-0 bg-transparent"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}

            <textarea
              {...register('description')}
              placeholder="Write a description, project brief, or collect ideas..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[120px] resize-none"
            />

            <div className="flex flex-wrap gap-2">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <PillSelect value={field.value} onChange={field.onChange} options={statusOptions} />
                )}
              />
              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-muted/50 text-xs font-medium text-muted-foreground"
              >
                <Flag className="w-3.5 h-3.5" /> No priority
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-muted/50 text-xs font-medium text-muted-foreground"
              >
                <Users className="w-3.5 h-3.5" /> Members
              </button>
              <div className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-muted/50 text-xs font-medium text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <Input type="date" {...register('deadline')} className="h-6 border-0 p-0 text-xs bg-transparent w-auto" />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              {project ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={closeProjectModal}>
                  Cancel
                </Button>
                <Button type="submit">{project ? 'Save' : 'Create project'}</Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
