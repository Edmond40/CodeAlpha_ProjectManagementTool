import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface PageToolbarProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function PageToolbar({ children, left, right, className }: PageToolbarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {left}
      <div className="flex-1" />
      {children}
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
