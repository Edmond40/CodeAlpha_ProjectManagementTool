import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckSquare, Clock, Users, Tag, AlignLeft,
  MessageSquare, Paperclip, MoreHorizontal, Trash2, Flag
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useBoardStore } from '../../store/useBoardStore';
import { Button } from '../Button';
import { PillSelect } from '../ui/Select';

export function TaskModal() {
  const { isTaskModalOpen, activeTaskId, closeTaskModal, addToast } = useUIStore();
  const { tasks, setTasks, columns } = useBoardStore();

  const task = tasks.find(t => t.id === activeTaskId);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [commentValue, setCommentValue] = useState('');
  const [comments, setComments] = useState<{ author: string; text: string; time: string }[]>([]);

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setTitleValue(task.title);
      setDescValue(task.description);
      setComments([
        { author: 'Alex', text: 'Changed the status to In Progress.', time: '2 hours ago' },
      ]);
    }
  }, [task?.id, isTaskModalOpen]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingTitle) { setEditingTitle(false); return; }
        closeTaskModal();
      }
    };
    if (isTaskModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, editingTitle, closeTaskModal]);

  const updateTask = (fields: Partial<typeof task>) => {
    if (!task) return;
    setTasks(tasks.map(t => t.id === task.id ? { ...t, ...fields } : t));
  };

  const saveTitle = () => {
    if (titleValue.trim()) {
      updateTask({ title: titleValue.trim() });
      addToast({ title: 'Task updated', type: 'success' });
    }
    setEditingTitle(false);
  };

  const saveDescription = () => {
    updateTask({ description: descValue });
    addToast({ title: 'Description saved', type: 'success' });
  };

  const deleteTask = () => {
    if (!task) return;
    setTasks(tasks.filter(t => t.id !== task.id));
    addToast({ title: 'Task deleted', type: 'error' });
    closeTaskModal();
  };

  const addComment = () => {
    if (!commentValue.trim()) return;
    setComments(prev => [...prev, { author: 'You', text: commentValue, time: 'Just now' }]);
    updateTask({ comments: (task?.comments || 0) + 1 });
    setCommentValue('');
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeTaskModal}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl border border-border flex flex-col md:flex-row text-foreground"
          >
            {/* ── Main Content ── */}
            <div className="flex-1 p-6 md:p-8 space-y-8 min-w-0 ">
              {/* Title */}
              <div className="flex items-start gap-3">
                <CheckSquare className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
                <div className="flex-1">
                  {editingTitle ? (
                    <input
                      autoFocus
                      value={titleValue}
                      onChange={(e) => setTitleValue(e.target.value)}
                      onBlur={saveTitle}
                      onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                      className="w-full text-2xl font-bold bg-transparent border-b-2 border-primary outline-none"
                    />
                  ) : (
                    <h2
                      className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setEditingTitle(true)}
                      title="Click to edit"
                    >
                      {task.title}
                    </h2>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    in column <span className="font-medium">{columns.find(c => c.id === task.columnId)?.title}</span>
                  </p>
                </div>
                <button onClick={closeTaskModal} className="md:hidden text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <PillSelect
                  value={task.priority}
                  onChange={(p) => {
                    updateTask({ priority: p as typeof task.priority });
                    addToast({ title: `Priority set to ${p}`, type: 'success' });
                  }}
                  options={[
                    { value: 'Low', label: 'Low', icon: <Flag className="w-3.5 h-3.5 text-slate-400" /> },
                    { value: 'Medium', label: 'Medium', icon: <Flag className="w-3.5 h-3.5 text-amber-400" /> },
                    { value: 'High', label: 'High', icon: <Flag className="w-3.5 h-3.5 text-red-500" /> },
                  ]}
                />
                <PillSelect
                  value={task.columnId}
                  onChange={(colId) => {
                    updateTask({ columnId: colId });
                    addToast({ title: 'Status updated', type: 'success' });
                  }}
                  options={columns.map((c) => ({ value: c.id, label: c.title }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <AlignLeft className="h-5 w-5 text-muted-foreground" />
                  <h3>Description</h3>
                </div>
                <div className="pl-7 space-y-2">
                  <textarea
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    placeholder="Add a more detailed description..."
                    className="w-full bg-muted/50 p-4 rounded-xl text-sm border hover:border-border/80 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none resize-none min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={saveDescription}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setDescValue(task.description)}>Discard</Button>
                  </div>
                </div>
              </div>

              {/* Move to column */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <h3>Move to Column</h3>
                </div>
                <div className="pl-7 flex flex-wrap gap-2">
                  {columns.map(col => (
                    <button
                      key={col.id}
                      onClick={() => { updateTask({ columnId: col.id }); addToast({ title: `Moved to "${col.title}"`, type: 'success' }); }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${task.columnId === col.id ? 'bg-primary text-primary-foreground border-primary' : 'border-input bg-background hover:bg-muted'}`}
                    >
                      {col.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity & Comments */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <h3>Activity</h3>
                </div>
                <div className="pl-7 space-y-4">
                  {/* Comment input */}
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                      Y
                    </div>
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={commentValue}
                        onChange={(e) => setCommentValue(e.target.value)}
                        placeholder="Write a comment..."
                        rows={2}
                        className="w-full p-3 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                      />
                      <Button size="sm" onClick={addComment} disabled={!commentValue.trim()}>Post Comment</Button>
                    </div>
                  </div>

                  {/* Comment list */}
                  <div className="space-y-3 pt-2 border-t">
                    {comments.map((c, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary border flex items-center justify-center shrink-0 font-bold text-xs">
                          {c.author[0]}
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-semibold">{c.author}</span> — {c.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="w-full md:w-64 shrink-0 bg-muted/30 border-t md:border-t-0 md:border-l p-6 md:p-8 space-y-6">
              <div className="hidden md:flex justify-end">
                <button onClick={closeTaskModal} className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-md transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Task metadata */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority</span>
                    <span className="font-semibold px-2 py-0.5 rounded text-xs bg-muted text-foreground">{task.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comments</span>
                    <span className="font-medium">{task.comments}</span>
                  </div>
                  {task.assignees.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Assigned</span>
                      <div className="flex -space-x-1.5">
                        {task.assignees.map((a, i) => (
                          <div key={i} className="h-6 w-6 rounded-full bg-primary/20 text-primary border-2 border-background flex items-center justify-center text-[9px] font-bold">
                            {a[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Labels */}
              {task.labels.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Labels</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {task.labels.map(l => (
                      <span key={l} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">{l}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add to card</h4>
                <Button variant="outline" className="w-full justify-start bg-background text-sm h-9"><Users className="mr-2 h-4 w-4" /> Members</Button>
                <Button variant="outline" className="w-full justify-start bg-background text-sm h-9"><Tag className="mr-2 h-4 w-4" /> Labels</Button>
                <Button variant="outline" className="w-full justify-start bg-background text-sm h-9"><Clock className="mr-2 h-4 w-4" /> Due Date</Button>
                <Button variant="outline" className="w-full justify-start bg-background text-sm h-9"><Paperclip className="mr-2 h-4 w-4" /> Attachment</Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button variant="outline" className="w-full justify-start bg-background text-sm h-9"><MoreHorizontal className="mr-2 h-4 w-4" /> Duplicate</Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start text-sm h-9"
                  onClick={deleteTask}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
