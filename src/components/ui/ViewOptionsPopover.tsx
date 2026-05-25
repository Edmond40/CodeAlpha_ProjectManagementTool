import { SlidersHorizontal, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { Button } from '../Button';
import { Popover } from './Popover';
import { Select } from './Select';
import { Toggle } from './Toggle';
import { SegmentedControl } from './SegmentedControl';
import { useFilterStore } from '../../store/useFilterStore';
import { cn } from '../../utils/cn';

const DISPLAY_PROPERTIES = [
  'id', 'status', 'assignee', 'priority', 'project', 'due date',
  'milestone', 'labels', 'links', 'time in status', 'created', 'updated', 'pull requests',
];

export function ViewOptionsPopover() {
  const { viewOptions, setViewOptions, toggleDisplayProperty, resetViewOptions } = useFilterStore();

  return (
    <Popover
      contentClassName="w-80 p-0"
      align="end"
      trigger={
        <Button variant="outline" size="sm" className="h-9 gap-2 text-xs" title="Show display options">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Display
        </Button>
      }
    >
      <div className="p-3 border-b border-border flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">View options</p>
        <button
          type="button"
          onClick={resetViewOptions}
          className="text-[11px] text-muted-foreground hover:text-foreground"
        >
          Reset
        </button>
      </div>
      <div className="p-3 space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">View</p>
          <SegmentedControl
            value={viewOptions.layout}
            onChange={(v) => setViewOptions({ layout: v })}
            options={[
              { value: 'list', label: 'List', icon: <List className="w-3.5 h-3.5" /> },
              { value: 'board', label: 'Board', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
            ]}
            size="sm"
            className="w-full"
          />
        </div>

        <Select
          label="Columns"
          value={viewOptions.groupBy}
          onChange={(v) => setViewOptions({ groupBy: v as typeof viewOptions.groupBy })}
          options={[
            { value: 'status', label: 'Status' },
            { value: 'priority', label: 'Priority' },
            { value: 'assignee', label: 'Assignee' },
            { value: 'none', label: 'No grouping' },
          ]}
          size="sm"
        />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="Ordering"
              value={viewOptions.orderBy}
              onChange={(v) => setViewOptions({ orderBy: v as typeof viewOptions.orderBy })}
              options={[
                { value: 'manual', label: 'Manual' },
                { value: 'priority', label: 'Priority' },
                { value: 'title', label: 'Title' },
                { value: 'created', label: 'Created date' },
                { value: 'activity', label: 'My activity date' },
              ]}
              size="sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setViewOptions({ sortDesc: !viewOptions.sortDesc })}
            className="h-9 w-9 shrink-0 rounded-lg border border-border bg-muted/50 flex items-center justify-center hover:bg-muted"
            title="Toggle sort direction"
          >
            <ArrowUpDown className={cn('w-3.5 h-3.5', viewOptions.sortDesc && 'text-primary')} />
          </button>
        </div>

        <Select
          label="Completed issues"
          value={viewOptions.completedIssues}
          onChange={(v) => setViewOptions({ completedIssues: v as typeof viewOptions.completedIssues })}
          options={[
            { value: 'all', label: 'All' },
            { value: 'none', label: 'None' },
            { value: 'last-week', label: 'Past week' },
          ]}
          size="sm"
        />

        <div className="space-y-3 pt-1 border-t border-border">
          <Toggle
            label="Order completed by recency"
            checked={viewOptions.orderCompletedByRecency}
            onChange={(v) => setViewOptions({ orderCompletedByRecency: v })}
            size="sm"
          />
          <Toggle
            label="Show sub-issues"
            checked={viewOptions.showSubIssues}
            onChange={(v) => setViewOptions({ showSubIssues: v })}
            size="sm"
          />
          <Toggle
            label="Show empty columns"
            checked={viewOptions.showEmptyColumns}
            onChange={(v) => setViewOptions({ showEmptyColumns: v })}
            size="sm"
          />
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Display properties</p>
          <div className="flex flex-wrap gap-1.5">
            {DISPLAY_PROPERTIES.map((prop) => {
              const active = viewOptions.displayProperties.includes(prop);
              return (
                <button
                  key={prop}
                  type="button"
                  onClick={() => toggleDisplayProperty(prop)}
                  className={cn(
                    'px-2 py-1 rounded-md text-[11px] font-medium capitalize transition-colors',
                    active
                      ? 'bg-foreground/10 text-foreground border border-border'
                      : 'bg-muted/50 text-muted-foreground border border-transparent hover:text-foreground'
                  )}
                >
                  {prop}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Popover>
  );
}
