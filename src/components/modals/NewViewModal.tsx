import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select, PillSelect } from '../ui/Select';
import { SegmentedControl } from '../ui/SegmentedControl';
import { useUIStore } from '../../store/useUIStore';
import { useViewsStore, type SavedViewType } from '../../store/useViewsStore';

interface NewViewModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewViewModal({ open, onClose }: NewViewModalProps) {
  const [name, setName] = useState('All tasks');
  const [type, setType] = useState<SavedViewType>('tasks');
  const [saveTo, setSaveTo] = useState('personal');
  const { addToast } = useUIStore();
  const { addView } = useViewsStore();

  const handleSave = () => {
    const href = type === 'tasks' ? '/dashboard/boards' : '/dashboard/projects';
    addView({
      name: name.trim() || 'Untitled view',
      type,
      owner: 'Alex Morgan',
      href,
      description: saveTo === 'team' ? 'Team view' : undefined,
    });
    addToast({ title: 'View saved', description: `"${name}" is now available.`, type: 'success' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative w-full max-w-4xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground">Views › New view</p>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xl font-bold border-0 px-0 mt-1 focus-visible:ring-0 bg-transparent"
                />
                <Input placeholder="Description (optional)" className="text-sm mt-1 border-0 px-0 bg-transparent text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <PillSelect
                  value={saveTo}
                  onChange={setSaveTo}
                  options={[
                    { value: 'personal', label: 'Personal', icon: <Lock className="w-3 h-3" /> },
                    { value: 'team', label: 'Team' },
                    { value: 'workspace', label: 'Workspace' },
                  ]}
                />
                <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                <Button size="sm" onClick={handleSave}>Save</Button>
                <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground ml-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <SegmentedControl
                value={type}
                onChange={setType}
                size="sm"
                options={[
                  { value: 'tasks', label: 'Tasks' },
                  { value: 'projects', label: 'Projects' },
                ]}
              />
              <Select
                value="status"
                onChange={() => {}}
                options={[{ value: 'status', label: 'Group by Status' }]}
                size="sm"
              />
            </div>
            <div className="p-6 min-h-[200px] text-sm text-muted-foreground text-center">
              Preview of {type} view — configure filters and display options after saving.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
