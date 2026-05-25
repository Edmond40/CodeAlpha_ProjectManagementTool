import { useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'row';
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  description,
  size = 'md',
  variant = 'default',
  className,
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const selected = options.find((o) => o.value === value);

  if (variant === 'row') {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors',
          disabled && 'opacity-60 pointer-events-none',
          className
        )}
      >
        <div className="min-w-0">
          {label && <p className="text-sm font-medium text-foreground">{label}</p>}
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="relative shrink-0">
          <SelectTrigger
            open={open}
            setOpen={setOpen}
            selected={selected}
            placeholder={placeholder}
            size={size}
            disabled={disabled}
          />
          {open && (
            <SelectMenu
              options={options}
              value={value}
              onChange={(v) => {
                onChange(v);
                setOpen(false);
              }}
              className="right-0 top-full mt-1 min-w-[200px]"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      )}
      <SelectTrigger
        open={open}
        setOpen={setOpen}
        selected={selected}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        fullWidth
      />
      {open && (
        <SelectMenu
          options={options}
          value={value}
          onChange={(v) => {
            onChange(v);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function SelectTrigger({
  open,
  setOpen,
  selected,
  placeholder,
  size,
  disabled,
  fullWidth,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected?: SelectOption;
  placeholder: string;
  size: 'sm' | 'md';
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setOpen(!open)}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-sm font-medium text-foreground transition-colors shrink-0',
        size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3',
        fullWidth && 'w-full justify-between',
        open && 'ring-2 ring-ring/30 border-primary/40'
      )}
    >
      <span className="flex items-center gap-2 truncate">
        {selected?.icon}
        <span className="truncate">{selected?.label ?? placeholder}</span>
      </span>
      <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')} />
    </button>
  );
}

function SelectMenu({
  options,
  value,
  onChange,
  className,
}: {
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute z-50 mt-1 w-full min-w-[180px] max-h-60 overflow-y-auto rounded-xl border border-border bg-popover shadow-xl py-1',
        className
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={opt.disabled}
          onClick={() => !opt.disabled && onChange(opt.value)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors',
            opt.value === value
              ? 'bg-primary/10 text-primary'
              : 'text-foreground hover:bg-muted',
            opt.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {opt.icon}
          <span className="flex-1 truncate">{opt.label}</span>
          {opt.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
        </button>
      ))}
    </div>
  );
}

/** Pill-style selector for modals (status, priority, etc.) */
export function PillSelect({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-muted/50 hover:bg-muted text-xs font-medium text-foreground transition-colors"
      >
        {selected?.icon}
        {selected?.label}
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
      {open && (
        <SelectMenu options={options} value={value} onChange={(v) => { onChange(v); setOpen(false); }} className="left-0 w-max min-w-[140px]" />
      )}
    </div>
  );
}
