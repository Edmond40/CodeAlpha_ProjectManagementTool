import { Filter, X } from 'lucide-react';
import { Button } from '../Button';
import { Popover } from './Popover';
import { Select, type SelectOption } from './Select';
import { Toggle } from './Toggle';
import { cn } from '../../utils/cn';

export interface FilterField {
  id: string;
  label: string;
  type: 'multi-select' | 'select' | 'toggle';
  options?: SelectOption[];
  value: string | string[] | boolean;
  onChange: (value: string | string[] | boolean) => void;
}

interface FilterPanelProps {
  fields: FilterField[];
  onReset: () => void;
  activeCount?: number;
  className?: string;
}

export function FilterPanel({ fields, onReset, activeCount = 0, className }: FilterPanelProps) {
  return (
    <Popover
      className={className}
      contentClassName="w-72 p-0"
      trigger={
        <Button
          variant="outline"
          size="sm"
          className={cn('h-9 gap-2 text-xs', activeCount > 0 && 'border-primary/50 text-primary')}
        >
          <Filter className="w-3.5 h-3.5" />
          Filter
          {activeCount > 0 && (
            <span className="ml-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      }
    >
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Filters</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>
      <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
        {fields.map((field) => (
          <div key={field.id}>
            {field.type === 'toggle' ? (
              <Toggle
                label={field.label}
                checked={field.value as boolean}
                onChange={(v) => field.onChange(v)}
                size="sm"
              />
            ) : field.type === 'select' && field.options ? (
              <Select
                label={field.label}
                value={field.value as string}
                onChange={(v) => field.onChange(v)}
                options={field.options}
                size="sm"
              />
            ) : field.type === 'multi-select' && field.options ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">{field.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {field.options.map((opt) => {
                    const selected = (field.value as string[]).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          const current = field.value as string[];
                          const next = selected
                            ? current.filter((v) => v !== opt.value)
                            : [...current, opt.value];
                          field.onChange(next);
                        }}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors',
                          selected
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Popover>
  );
}
