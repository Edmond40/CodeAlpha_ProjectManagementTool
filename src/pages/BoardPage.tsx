import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Star } from 'lucide-react';

import { useBoardStore } from '../store/useBoardStore';
import type { Column, Task } from '../store/useBoardStore';
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

const ISSUE_TABS = [
  { value: 'all' as const, label: 'All issues' },
  { value: 'active' as const, label: 'Active' },
  { value: 'backlog' as const, label: 'Backlog' },
  { value: 'dashboard-done' as const, label: 'dashboard done' },
];

export function BoardPage() {
  const { columns, tasks, moveTask, reorderColumn, setTasks } = useBoardStore();
  const { openCreateTaskModal, openCreateColumnModal, openTaskModal } = useUIStore();
  const {
    boardFilters,
    viewOptions,
    issueViewTab,
    setIssueViewTab,
    hiddenColumnIds,
  } = useFilterStore();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks, boardFilters, viewOptions, issueViewTab),
    [tasks, boardFilters, viewOptions, issueViewTab]
  );

  const visibleColumns = useMemo(() => {
    let cols = columns.filter((c) => !hiddenColumnIds.includes(c.id));
    if (!viewOptions.showEmptyColumns) {
      cols = cols.filter((col) => filteredTasks.some((t) => t.columnId === col.id));
    }
    return cols;
  }, [columns, filteredTasks, viewOptions.showEmptyColumns, hiddenColumnIds]);

  const columnsId = useMemo(() => visibleColumns.map((col) => col.id), [visibleColumns]);

  const assigneeOptions = [...new Set(tasks.flatMap((t) => t.assignees))].map((a) => ({
    value: a,
    label: a,
  }));
  const labelOptions = [...new Set(tasks.flatMap((t) => t.labels))].map((l) => ({
    value: l,
    label: l,
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    if (active.data.current?.type !== 'Task') return;

    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (isOverTask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        moveTask(activeId as string, tasks[overIndex].columnId, overIndex);
      } else {
        setTasks(arrayMove(tasks, activeIndex, overIndex));
      }
    }
    if (isOverColumn) {
      moveTask(activeId as string, overId as string, tasks.filter((t) => t.columnId === overId).length);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (active.data.current?.type === 'Column') {
      reorderColumn(active.id as string, over.id as string);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 mb-4 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Issues</h1>
            <button type="button" className="text-muted-foreground hover:text-amber-400 transition-colors">
              <Star className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <AdvancedFilterMenu assigneeOptions={assigneeOptions} labelOptions={labelOptions} />
            <ViewOptionsPopover />
            <Button size="sm" className="h-9 gap-1.5 text-xs" onClick={() => openCreateTaskModal()}>
              <Plus className="w-3.5 h-3.5" /> New issue
            </Button>
          </div>
        </div>
        <TabFilters value={issueViewTab} onChange={setIssueViewTab} tabs={ISSUE_TABS} />
      </div>

      {viewOptions.layout === 'list' ? (
        <div className="flex-1 overflow-y-auto bg-card border border-border rounded-xl">
          {filteredTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">No issues match your filters.</p>
          ) : (
            filteredTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => openTaskModal(task.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 border-b border-border text-left transition-colors"
              >
                <span className="text-xs font-mono text-muted-foreground w-14">{task.id.toUpperCase()}</span>
                <span className="text-sm text-foreground flex-1">{task.title}</span>
                <span className="text-xs text-muted-foreground">May 22</span>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 min-h-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <div className="flex gap-3 h-full min-w-max px-0.5">
              <SortableContext items={columnsId} strategy={horizontalListSortingStrategy}>
                {visibleColumns.map((col) => (
                  <BoardColumn
                    key={col.id}
                    column={col}
                    tasks={filteredTasks.filter((task) => task.columnId === col.id)}
                  />
                ))}
              </SortableContext>
              <button
                type="button"
                onClick={() => openCreateColumnModal()}
                className="flex-shrink-0 w-64 rounded-xl border border-dashed border-border hover:bg-muted/20 h-12 flex items-center justify-center text-muted-foreground text-sm gap-1.5 mt-10"
              >
                <Plus className="w-4 h-4" /> Add column
              </button>
              <HiddenColumnsPanel />
            </div>
            {createPortal(
              <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
                {activeColumn && (
                  <BoardColumn column={activeColumn} tasks={filteredTasks.filter((t) => t.columnId === activeColumn.id)} />
                )}
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
