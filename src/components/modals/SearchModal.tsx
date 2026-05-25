import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, Target, ListTodo, Users, Calendar, Plus,
  FileText, LayoutGrid, Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { useBoardStore } from '../../store/useBoardStore';
import { useProjectStore } from '../../store/useProjectStore';
import { cn } from '../../utils/cn';

type SearchResult = {
  id: string;
  label: string;
  sublabel?: string;
  category: 'pages' | 'tasks' | 'projects' | 'actions';
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
};

const pages = [
  { label: 'Dashboard', icon: Command, href: '/dashboard' },
  { label: 'Inbox', icon: Inbox, href: '/dashboard/inbox' },
  { label: 'My tasks', icon: ListTodo, href: '/dashboard/my-tasks' },
  { label: 'Projects', icon: Target, href: '/dashboard/projects' },
  { label: 'Board', icon: LayoutGrid, href: '/dashboard/boards' },
  { label: 'Views', icon: Command, href: '/dashboard/views' },
  { label: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
  { label: 'Team', icon: Users, href: '/dashboard/team' },
  { label: 'Drafts', icon: FileText, href: '/dashboard/drafts' },
];

export function SearchModal() {
  const { isSearchModalOpen, closeSearchModal, openCreateTaskModal, openProjectModal } = useUIStore();
  const { tasks } = useBoardStore();
  const { projects } = useProjectStore();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();
    const list: SearchResult[] = [];

    if (!q || 'create'.includes(q) || 'new'.includes(q)) {
      list.push({
        id: 'action-task',
        label: 'Create new task',
        sublabel: 'Shortcut: C',
        category: 'actions',
        icon: Plus,
        onSelect: () => { openCreateTaskModal(); closeSearchModal(); },
      });
      list.push({
        id: 'action-project',
        label: 'Create new project',
        category: 'actions',
        icon: Plus,
        onSelect: () => { openProjectModal(); closeSearchModal(); },
      });
    }

    pages.forEach((p) => {
      if (!q || p.label.toLowerCase().includes(q)) {
        list.push({
          id: `page-${p.href}`,
          label: p.label,
          category: 'pages',
          icon: p.icon,
          onSelect: () => { navigate(p.href); closeSearchModal(); },
        });
      }
    });

    tasks.forEach((t) => {
      if (!q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) {
        list.push({
          id: `task-${t.id}`,
          label: t.title,
          sublabel: t.id.toUpperCase(),
          category: 'tasks',
          icon: ListTodo,
          onSelect: () => { navigate('/dashboard/boards'); closeSearchModal(); },
        });
      }
    });

    projects.forEach((p) => {
      if (!q || p.name.toLowerCase().includes(q)) {
        list.push({
          id: `project-${p.id}`,
          label: p.name,
          sublabel: p.status,
          category: 'projects',
          icon: Target,
          onSelect: () => { navigate('/dashboard/projects'); closeSearchModal(); },
        });
      }
    });

    return list;
  }, [query, tasks, projects, navigate, closeSearchModal, openCreateTaskModal, openProjectModal]);

  const grouped = useMemo(() => {
    const order: SearchResult['category'][] = ['actions', 'pages', 'tasks', 'projects'];
    return order
      .map((cat) => ({ category: cat, items: results.filter((r) => r.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [results]);

  const flatResults = grouped.flatMap((g) => g.items);

  useEffect(() => {
    if (isSearchModalOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatResults[activeIndex]) {
      flatResults[activeIndex].onSelect();
    } else if (e.key === 'Escape') {
      closeSearchModal();
    }
  };

  const categoryLabel: Record<SearchResult['category'], string> = {
    actions: 'Actions',
    pages: 'Pages',
    tasks: 'Tasks',
    projects: 'Projects',
  };

  let idx = 0;

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeSearchModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-[12%] -translate-x-1/2 z-50 w-full max-w-xl px-4"
          >
            <div className="bg-popover rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search tasks, projects, pages..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                  ESC
                </kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {flatResults.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No results found.</p>
                ) : (
                  grouped.map((group) => (
                    <div key={group.category} className="mb-2 last:mb-0">
                      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {categoryLabel[group.category]}
                      </p>
                      {group.items.map((item) => {
                        const currentIdx = idx++;
                        return (
                          <button
                            key={item.id}
                            onClick={item.onSelect}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors',
                              currentIdx === activeIndex
                                ? 'bg-primary/10 text-primary'
                                : 'text-foreground hover:bg-muted'
                            )}
                          >
                            <item.icon className="w-4 h-4 shrink-0 opacity-70" />
                            <div className="flex-1 min-w-0">
                              <span className="block truncate">{item.label}</span>
                              {item.sublabel && (
                                <span className="text-[11px] text-muted-foreground">{item.sublabel}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
