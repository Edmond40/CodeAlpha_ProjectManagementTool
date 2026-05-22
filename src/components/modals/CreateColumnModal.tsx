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
  title: z.string().min(1, 'Column title is required'),
});

type FormValues = z.infer<typeof schema>;

export function CreateColumnModal() {
  const { isCreateColumnModalOpen, closeCreateColumnModal, addToast } = useUIStore();
  const { columns, setColumns } = useBoardStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isCreateColumnModalOpen) reset();
  }, [isCreateColumnModalOpen, reset]);

  const onSubmit = (data: FormValues) => {
    const newColumn = {
      id: `col-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title,
    };
    
    setColumns([...columns, newColumn]);
    addToast({ title: 'Column created', type: 'success' });
    closeCreateColumnModal();
  };

  if (!isCreateColumnModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeCreateColumnModal}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-background rounded-2xl shadow-2xl border p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">New Column</h2>
            <button onClick={closeCreateColumnModal} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Column Title</label>
              <Input {...register('title')} error={!!errors.title} placeholder="e.g. Backlog, Testing..." />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeCreateColumnModal}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
