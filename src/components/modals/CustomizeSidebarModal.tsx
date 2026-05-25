import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSidebarStore } from '../../store/useSidebarStore';

const items: { key: keyof ReturnType<typeof useSidebarStore.getState>['config']; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'inbox', label: 'Inbox' },
  { key: 'myTasks', label: 'My tasks' },
  { key: 'drafts', label: 'Drafts' },
  { key: 'projects', label: 'Projects' },
  { key: 'views', label: 'Views' },
];

export function CustomizeSidebarModal() {
  const { isCustomizeOpen, setCustomizeOpen, config, updateConfig } = useSidebarStore();

  return (
    <AnimatePresence>
      {isCustomizeOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setCustomizeOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-[var(--popover)] rounded-2xl shadow-2xl border border-[var(--border)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">Customize sidebar</h2>
              <button
                onClick={() => setCustomizeOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-4">
              Choose which items appear in your sidebar.
            </p>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[var(--secondary)] transition-colors"
                >
                  <span className="text-sm text-[var(--foreground)]">{item.label}</span>
                  <select
                    value={config[item.key]}
                    onChange={(e) => updateConfig(item.key, e.target.value as any)}
                    className="text-xs bg-[var(--background)] border border-[var(--border)] rounded-lg px-2 py-1 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Don't show">Don't show</option>
                    <option value="Show">Show</option>
                    <option value="Always show">Always show</option>
                  </select>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
