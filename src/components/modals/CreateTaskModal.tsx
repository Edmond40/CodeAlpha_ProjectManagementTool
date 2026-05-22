import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUIStore } from '../../store/useUIStore';
import { useBoardStore } from '../../store/useBoardStore';
import { Button } from '../Button';
import { Input } from '../Input';

const schema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
});

type FormValues = z.infer<typeof schema>;

export function CreateTaskModal() {
  const { isCreateTaskModalOpen, activeColumnId, closeCreateTaskModal, addToast } = useUIStore();
  const { columns, tasks, setTasks } = useBoardStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'Medium' }
  });

  useEffect(() => {
    if (!isCreateTaskModalOpen) reset();
  }, [isCreateTaskModalOpen, reset]);

  const onSubmit = (data: FormValues) => {
    const colId = activeColumnId || columns[0]?.id || 'todo';
    const newTask = {
      id: `t${Math.random().toString(36).substr(2, 9)}`,
      columnId: colId,
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      labels: [],
      assignees: [],
      comments: 0,
    };
    
    setTasks([...tasks, newTask]);
    addToast({ title: 'Task created', type: 'success' });
    closeCreateTaskModal();
  };

  if (!isCreateTaskModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeCreateTaskModal}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl border p-6 text-white"
        >
          <div className="flex justify-between items-center mb-6 ">
            <h2 className="text-xl font-bold">Create Task</h2>
            <button onClick={closeCreateTaskModal} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input {...register('title')} error={!!errors.title} placeholder="Task title..." />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea 
                {...register('description')} 
                placeholder="Add a detailed description..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px] resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <select 
                {...register('priority')} 
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeCreateTaskModal}>Cancel</Button>
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
