import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import type { Task } from '../store/useBoardStore';
import { useUIStore } from '../store/useUIStore';
import { useFilterStore } from '../store/useFilterStore';
import { BoardColumn } from '../components/board/BoardColumn';
import { BoardTask } from '../components/board/BoardTask';
import { Button } from '../components/Button';
import { AdvancedFilterMenu } from '../components/ui/AdvancedFilterMenu';
import { ViewOptionsPopover } from '../components/ui/ViewOptionsPopover';
import { HiddenColumnsPanel } from '../components/ui/HiddenColumnsPanel';
import { TabFilters } from '../components/ui/TabFilters';
import { filterAndSortTasks } from '../utils/filterTasks';

const MY_TABS = [
  { value: 'assigned' as const, label: 'Assigned' },
  { value: 'created' as const, label: 'Created' },
  { value: 'subscribed' as const, label: 'Subscribed' },
  { value: 'activity' as const, label: 'Activity' },
];

export function MyTasksPage() {
  const { columns, tasks } = useBoardStore();
  const { openCreateTaskModal, openTaskModal } = useUIStore();
  const { boardFilters, viewOptions, myTasksTab, setMyTasksTab, hiddenColumnIds } = useFilterStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const tabFiltered = useMemo(() => {
    const base = filterAndSortTasks(tasks, boardFilters, viewOptions);
    if (myTasksTab === 'assigned') return base.filter((t) => t.assignees.includes('Alex') || t.assignees.length === 0);
    if (myTasksTab === 'created') return base.filter((_, i) => i % 2 === 0);
    if (myTasksTab === 'subscribed') return base.filter((t) => t.comments > 0);
    return base;
  }, [tasks, boardFilters, viewOptions, myTasksTab]);

  const visibleColumns = useMemo(() => {
    let cols = columns.filter((c) => !hiddenColumnIds.includes(c.id));
    if (!viewOptions.showEmptyColumns) {
      cols = cols.filter((col) => tabFiltered.some((t) => t.columnId === col.id));
    }
    return cols;
  }, [columns, tabFiltered, viewOptions.showEmptyColumns, hiddenColumnIds]);

  const assigneeOptions = [...new Set(tasks.flatMap((t) => t.assignees))].map((a) => ({ value: a, label: a }));
  const labelOptions = [...new Set(tasks.flatMap((t) => t.labels))].map((l) => ({ value: l, label: l }));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col gap-3 mb-4 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-semibold text-foreground">My tasks</h1>
          <div className="flex items-center gap-2">
            <AdvancedFilterMenu assigneeOptions={assigneeOptions} labelOptions={labelOptions} />
            <ViewOptionsPopover />
            <Button size="sm" className="h-9 gap-1.5 text-xs" onClick={() => openCreateTaskModal()}>
              <Plus className="w-3.5 h-3.5" /> New task
            </Button>
          </div>
        </div>
        <TabFilters value={myTasksTab} onChange={setMyTasksTab} tabs={MY_TABS} />
      </div>

      {viewOptions.layout === 'list' ? (
        <div className="flex-1 overflow-y-auto bg-card border border-border rounded-xl divide-y divide-border">
          {tabFiltered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No tasks match this tab or filters.</p>
          ) : (
            tabFiltered.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => openTaskModal(task.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 text-left"
              >
                <span className="text-xs font-mono text-muted-foreground">{task.id.toUpperCase()}</span>
                <span className="text-sm flex-1">{task.title}</span>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e: DragStartEvent) => {
              if (e.active.data.current?.type === 'Task') setActiveTask(e.active.data.current.task);
            }}
            onDragEnd={() => setActiveTask(null)}
          >
            <div className="flex gap-3 min-w-max">
              <SortableContext items={visibleColumns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
                {visibleColumns.map((col) => (
                  <BoardColumn
                    key={col.id}
                    column={col}
                    tasks={tabFiltered.filter((t) => t.columnId === col.id)}
                  />
                ))}
              </SortableContext>
              <HiddenColumnsPanel />
            </div>
            {createPortal(
              <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
                {activeTask && <BoardTask task={activeTask} />}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      )}
    </div>
  );
}
