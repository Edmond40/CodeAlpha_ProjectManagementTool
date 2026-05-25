import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { FolderOpen, SearchX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon = FolderOpen, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-[var(--muted-foreground)]" />
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--muted-foreground)] mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </motion.div>
  );
}

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      icon={SearchX}
      title="No results found"
      description={`No results for "${query}". Try a different search term.`}
    />
  );
}
