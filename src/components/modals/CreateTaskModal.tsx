import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, User, Tag, Circle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUIStore } from '../../store/useUIStore';
import { useBoardStore } from '../../store/useBoardStore';
import { Button } from '../Button';
import { Input } from '../Input';
import { PillSelect } from '../ui/Select';

const schema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  columnId: z.string(),
});

type FormValues = z.infer<typeof schema>;

const priorityOptions = [
  { value: 'Low', label: 'Low priority', icon: <Flag className="w-3.5 h-3.5 text-slate-400" /> },
  { value: 'Medium', label: 'Medium', icon: <Flag className="w-3.5 h-3.5 text-amber-400" /> },
  { value: 'High', label: 'High', icon: <Flag className="w-3.5 h-3.5 text-red-500" /> },
];

export function CreateTaskModal() {
  const { isCreateTaskModalOpen, activeColumnId, closeCreateTaskModal, addToast } = useUIStore();
  const { columns, tasks, setTasks } = useBoardStore();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'Medium',
      columnId: columns[0]?.id ?? 'todo',
    },
  });

  useEffect(() => {
    if (!isCreateTaskModalOpen) {
      reset({
        title: '',
        description: '',
        priority: 'Medium',
        columnId: activeColumnId || columns[0]?.id || 'todo',
      });
    }
  }, [isCreateTaskModalOpen, activeColumnId, columns, reset]);

  const onSubmit = (data: FormValues) => {
    const newTask = {
      id: `t${Math.random().toString(36).substr(2, 9)}`,
      columnId: data.columnId,
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      labels: [] as string[],
      assignees: [] as string[],
      comments: 0,
    };

    setTasks([...tasks, newTask]);
    addToast({ title: 'Task created', type: 'success' });
    closeCreateTaskModal();
  };

  if (!isCreateTaskModalOpen) return null;

  const columnOptions = columns.map((c) => ({
    value: c.id,
    label: c.title,
    icon: <Circle className="w-3.5 h-3.5" />,
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeCreateTaskModal}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-background rounded-2xl shadow-2xl border border-border p-6"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-xs text-muted-foreground font-medium">DEV › New issue</p>
              <h2 className="text-xl font-bold text-foreground mt-0.5">Create issue</h2>
            </div>
            <button
              onClick={closeCreateTaskModal}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register('title')}
                error={!!errors.title}
                placeholder="Issue title"
                className="text-lg font-semibold border-0 px-0 focus-visible:ring-0 bg-transparent"
              />
              {errors.title && (
                <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <textarea
              {...register('description')}
              placeholder="Add description..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-none"
            />

            <div className="flex flex-wrap gap-2">
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <PillSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={priorityOptions}
                  />
                )}
              />
              <Controller
                name="columnId"
                control={control}
                render={({ field }) => (
                  <PillSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={columnOptions}
                  />
                )}
              />
              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-muted/50 text-xs font-medium text-muted-foreground"
              >
                <User className="w-3.5 h-3.5" /> Assignee
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-muted/50 text-xs font-medium text-muted-foreground"
              >
                <Tag className="w-3.5 h-3.5" /> Labels
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={closeCreateTaskModal}>
                Cancel
              </Button>
              <Button type="submit">Create issue</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
