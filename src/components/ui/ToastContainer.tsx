import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../utils/cn';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  default: Info,
};

const colors = {
  success: 'border-emerald-500/30 bg-emerald-500/5',
  error: 'border-red-500/30 bg-red-500/5',
  default: 'border-border bg-card',
};

const iconColors = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  default: 'text-primary',
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type || 'default'];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={cn('flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-xl', colors[toast.type || 'default'])}
            >
              <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconColors[toast.type || 'default'])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{toast.title}</p>
                {toast.description && <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>}
              </div>
              <button onClick={() => removeToast(toast.id)} className="p-0.5 rounded hover:bg-secondary text-muted-foreground transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
