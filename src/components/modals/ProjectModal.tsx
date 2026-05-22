import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUIStore } from '../../store/useUIStore';
import { useProjectStore } from '../../store/useProjectStore';
import { Button } from '../Button';
import { Input } from '../Input';

const schema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  status: z.enum(['Planning', 'In Progress', 'Review', 'Completed']),
});

type FormValues = z.infer<typeof schema>;

export function ProjectModal() {
  const { isProjectModalOpen, activeProjectId, closeProjectModal, addToast } = useUIStore();
  const { projects, addProject, updateProject, removeProject } = useProjectStore();

  const project = activeProjectId ? projects.find(p => p.id === activeProjectId) : null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Populate form when editing
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

  // Escape key closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProjectModal();
    };
    if (isProjectModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProjectModalOpen, closeProjectModal]);

  const onSubmit = (data: FormValues) => {
    if (project) {
      updateProject(project.id, { name: data.name, description: data.description, deadline: data.deadline, status: data.status });
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeProjectModal}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl border p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">{project ? 'Edit Project' : 'New Project'}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{project ? 'Update project details.' : 'Create a new project workspace.'}</p>
            </div>
            <button onClick={closeProjectModal} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Project Name</label>
              <Input {...register('name')} placeholder="e.g. Mobile App Redesign" error={!!errors.name} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <textarea
                {...register('description')}
                placeholder="Describe the project goals and scope..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px] resize-none placeholder:text-muted-foreground"
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Status</label>
                <select
                  {...register('status')}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Deadline</label>
                <Input type="date" {...register('deadline')} error={!!errors.deadline} />
                {errors.deadline && <p className="text-xs text-destructive mt-1">{errors.deadline.message}</p>}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              {project ? (
                <Button type="button" variant="ghost" onClick={handleDelete} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              ) : (
                <div /> // Spacer
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={closeProjectModal}>Cancel</Button>
                <Button type="submit">{project ? 'Save Changes' : 'Create Project'}</Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
