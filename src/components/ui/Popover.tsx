import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useClickOutside } from '../../hooks/useClickOutside';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  side?: 'bottom' | 'top' | 'left' | 'right';
  className?: string;
  contentClassName?: string;
}

export function Popover({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  align = 'end',
  side = 'bottom',
  className,
  contentClassName,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const alignClass =
    align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2';
  const sideClass =
    side === 'bottom' ? 'top-full mt-1.5' : side === 'top' ? 'bottom-full mb-1.5' : side === 'left' ? 'right-full mr-1.5' : 'left-full ml-1.5';

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <div onClick={() => setOpen(!open)} className="inline-flex">
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <>
            {createPortal(
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />,
              document.body
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: side === 'bottom' ? -4 : 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className={cn(
                'absolute z-50 min-w-[200px] rounded-xl border border-border bg-popover text-popover-foreground shadow-xl',
                alignClass,
                sideClass,
                contentClassName
              )}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
