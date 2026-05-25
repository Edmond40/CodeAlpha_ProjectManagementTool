import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Lock, Plus } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import { useUIStore } from '../store/useUIStore';
import { useViewsStore, type SavedViewType } from '../store/useViewsStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PillSelect } from '../components/ui/Select';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { ViewOptionsPopover } from '../components/ui/ViewOptionsPopover';
import { AdvancedFilterMenu } from '../components/ui/AdvancedFilterMenu';

const STATUS_GROUPS = [
  { id: 'in-progress', label: 'In Progress', icon: '◐', tasks: ['t3'] },
  { id: 'todo', label: 'Todo', icon: '○', tasks: ['t1', 't2', 't4', 't5'] },
];

export function NewViewPage() {
  const navigate = useNavigate();
  const { tasks } = useBoardStore();
  const { addToast, openTaskModal } = useUIStore();
  const { addView } = useViewsStore();
  const [name, setName] = useState('All tasks');
  const [type, setType] = useState<SavedViewType>('tasks');
  const [saveTo, setSaveTo] = useState('personal');

  const getTask = (id: string) => tasks.find((t) => t.id === id);

  const handleSave = () => {
    const href = type === 'tasks' ? '/dashboard/boards' : '/dashboard/projects';
    addView({
      name: name.trim() || 'Untitled view',
      type,
      owner: 'Alex Morgan',
      href,
      description: saveTo === 'team' ? 'Team view' : undefined,
    });
    addToast({ title: 'View saved', description: `"${name}" is ready.`, type: 'success' });
    navigate('/dashboard/views');
  };

  return (
    <div className="flex flex-col h-full -m-4 sm:-m-6 lg:-m-8">
      <div className="border-b border-border bg-card/50 px-4 sm:px-6 py-4 space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
              <Layers className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Views › All tasks</p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg font-semibold border-0 px-0 h-auto bg-transparent focus-visible:ring-0"
              />
              <Input placeholder="Description (optional)" className="text-sm border-0 px-0 h-8 bg-transparent text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <PillSelect
              value={saveTo}
              onChange={setSaveTo}
              options={[
                { value: 'personal', label: 'Personal', icon: <Lock className="w-3 h-3" /> },
                { value: 'team', label: 'Team' },
              ]}
            />
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/views')}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <SegmentedControl
            value={type}
            onChange={setType}
            size="sm"
            options={[
              { value: 'tasks', label: 'Tasks' },
              { value: 'projects', label: 'Projects' },
            ]}
          />
          <div className="flex items-center gap-2">
            <AdvancedFilterMenu />
            <ViewOptionsPopover />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        {STATUS_GROUPS.map((group) => {
          const groupTasks = group.tasks.map(getTask).filter(Boolean);
          return (
            <div key={group.id} className="mb-6">
              <div className="flex items-center justify-between py-2 group/header">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="text-muted-foreground">{group.icon}</span>
                  {group.label}
                  <span className="text-muted-foreground font-normal">{groupTasks.length}</span>
                </span>
                <button type="button" className="opacity-0 group-hover/header:opacity-100 p-1 text-muted-foreground hover:text-foreground">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-0.5">
                {groupTasks.map((task) => task && (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => openTaskModal(task.id)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 text-left transition-colors group/row"
                  >
                    <span className="text-xs font-mono text-muted-foreground w-12">
                      {task.id.toUpperCase().replace('T', 'DEV-')}
                    </span>
                    <span className="text-muted-foreground text-sm">{group.icon}</span>
                    <span className="text-sm text-foreground flex-1 truncate">{task.title}</span>
                    <span className="w-6 h-6 rounded-full bg-muted opacity-0 group-hover/row:opacity-100" />
                    <span className="text-xs text-muted-foreground">May 22</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
