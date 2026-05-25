import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FABProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

export function FAB({ onClick, className, label = 'Create' }: FABProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-40 flex items-center gap-2 h-14 px-5 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all',
        className
      )}
    >
      <Plus className="w-5 h-5" />
      <span className="text-sm font-semibold hidden sm:inline">{label}</span>
    </motion.button>
  );
}
