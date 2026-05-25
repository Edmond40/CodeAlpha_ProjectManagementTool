import { SlidersHorizontal, LayoutGrid, List, GanttChartSquare } from 'lucide-react';
import { Button } from '../Button';
import { Popover } from './Popover';
import { Select } from './Select';
import { Toggle } from './Toggle';
import { SegmentedControl } from './SegmentedControl';
import { useFilterStore } from '../../store/useFilterStore';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../utils/cn';

const PROJECT_DISPLAY = [
  'milestones', 'summary', 'priority', 'status', 'health', 'lead',
  'target date', 'tasks', 'teams', 'members', 'dependencies',
  'start date', 'created', 'updated', 'completed', 'labels',
];

export function ProjectViewOptionsPopover() {
  const { projectViewOptions, setProjectViewOptions, toggleProjectDisplayProperty, resetViewOptions, saveViewDefaults } =
    useFilterStore();
  const { addToast } = useUIStore();

  const handleSave = () => {
    saveViewDefaults();
    addToast({ title: 'Display options saved', type: 'success' });
  };

  return (
    <Popover
      contentClassName="w-80 p-0"
      align="end"
      trigger={
        <Button variant="outline" size="sm" className="h-9 gap-2 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Display
        </Button>
      }
    >
      <div className="p-3 border-b border-border flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">View options</p>
        <button type="button" onClick={resetViewOptions} className="text-[11px] text-muted-foreground hover:text-foreground">
          Reset
        </button>
      </div>
      <div className="p-3 space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">View</p>
          <SegmentedControl
            value={projectViewOptions.layout}
            onChange={(v) => setProjectViewOptions({ layout: v })}
            options={[
              { value: 'list', label: 'List', icon: <List className="w-3.5 h-3.5" /> },
              { value: 'board', label: 'Board', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
              { value: 'timeline', label: 'Timeline', icon: <GanttChartSquare className="w-3.5 h-3.5" /> },
            ]}
            size="sm"
            className="w-full flex-wrap"
          />
        </div>

        <Select
          label="Columns"
          value={projectViewOptions.groupBy}
          onChange={(v) => setProjectViewOptions({ groupBy: v as typeof projectViewOptions.groupBy })}
          options={[
            { value: 'status', label: 'Status' },
            { value: 'lead', label: 'Lead' },
            { value: 'none', label: 'No grouping' },
          ]}
          size="sm"
        />

        <Select
          label="Ordering"
          value={projectViewOptions.orderBy}
          onChange={(v) => setProjectViewOptions({ orderBy: v as typeof projectViewOptions.orderBy })}
          options={[
            { value: 'manual', label: 'Manual' },
            { value: 'name', label: 'Name' },
            { value: 'updated', label: 'Updated' },
          ]}
          size="sm"
        />

        <Select
          label="Show closed projects"
          value={projectViewOptions.showClosedProjects}
          onChange={(v) =>
            setProjectViewOptions({ showClosedProjects: v as typeof projectViewOptions.showClosedProjects })
          }
          options={[
            { value: 'all', label: 'All' },
            { value: 'none', label: 'None' },
            { value: 'last-week', label: 'Past week' },
          ]}
          size="sm"
        />

        <Toggle
          label="Show empty columns"
          checked={projectViewOptions.showEmptyColumns}
          onChange={(v) => setProjectViewOptions({ showEmptyColumns: v })}
          size="sm"
        />

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Display properties</p>
          <div className="flex flex-wrap gap-1.5">
            {PROJECT_DISPLAY.map((prop) => {
              const active = projectViewOptions.displayProperties.includes(prop);
              return (
                <button
                  key={prop}
                  type="button"
                  onClick={() => toggleProjectDisplayProperty(prop)}
                  className={cn(
                    'px-2 py-1 rounded-md text-[11px] font-medium capitalize transition-colors',
                    active
                      ? 'bg-foreground/10 text-foreground border border-border'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {prop}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="p-3 border-t border-border flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => addToast({ title: 'Default set for workspace', type: 'default' })}
          className="text-[11px] text-muted-foreground hover:text-foreground"
        >
          Set default for everyone…
        </button>
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>
    </Popover>
  );
}
