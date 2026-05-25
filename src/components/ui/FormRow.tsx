import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface FormRowProps {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Linear-style settings row: label left, control right */
export function FormRow({ label, description, children, className }: FormRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-border bg-card',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
