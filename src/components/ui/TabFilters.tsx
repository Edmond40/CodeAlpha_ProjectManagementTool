import { cn } from '../../utils/cn';

export interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface TabFiltersProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  tabs: TabOption<T>[];
  className?: string;
}

/** Linear-style underline / pill tab row */
export function TabFilters<T extends string>({ value, onChange, tabs, className }: TabFiltersProps<T>) {
  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            value === tab.value
              ? 'bg-muted text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
