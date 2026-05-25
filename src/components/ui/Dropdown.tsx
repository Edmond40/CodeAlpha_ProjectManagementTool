import { useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownProps {
  trigger?: ReactNode;
  label?: string;
  items: DropdownItem[];
  align?: 'start' | 'end';
  className?: string;
}

export function Dropdown({ trigger, label, items, align = 'end', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const defaultTrigger = (
    <button
      type="button"
      className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors"
    >
      {label}
      <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
    </button>
  );

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <div onClick={() => setOpen(!open)}>{trigger ?? defaultTrigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[180px] py-1 rounded-xl border border-border bg-popover shadow-xl',
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) =>
            item.separator ? (
              <div key={item.id} className="my-1 border-t border-border" />
            ) : (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors',
                  item.destructive
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'text-foreground hover:bg-muted',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
