import { cn } from '../../utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  size = 'md',
  className,
}: ToggleProps) {
  const trackW = size === 'sm' ? 'w-9' : 'w-11';
  const trackH = size === 'sm' ? 'h-5' : 'h-6';
  const thumbSize = size === 'sm' ? 'size-4' : 'size-5';
  const thumbOn = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  const hasText = Boolean(label || description);

  return (
    <div
      className={cn(
        'flex w-full gap-3',
        hasText ? (description ? 'items-start' : 'items-center') : 'items-center justify-center',
        hasText && 'justify-between',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {hasText && (
        <div className="min-w-0 flex-1 pr-2">
          {label && <p className="text-sm font-medium text-foreground leading-tight">{label}</p>}
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative shrink-0 self-center rounded-full transition-colors duration-200',
          trackW,
          trackH,
          checked ? 'bg-primary' : 'bg-secondary'
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 left-0.5 rounded-full bg-background shadow-sm border border-border transition-transform duration-200',
            thumbSize,
            checked && thumbOn
          )}
        />
      </button>
    </div>
  );
}
