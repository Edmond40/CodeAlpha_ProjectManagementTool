import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Filter, Plus } from 'lucide-react';

import { useBoardStore } from '../store/useBoardStore';
import type { Column, Task } from '../store/useBoardStore';
import { useUIStore } from '../store/useUIStore';
import { BoardColumn } from '../components/board/BoardColumn';
import { BoardTask } from '../components/board/BoardTask';
import { Button } from '../components/Button';


export function BoardPage() {
  const { columns, tasks, moveTask, reorderColumn, setTasks } = useBoardStore();
  const { openCreateTaskModal, openCreateColumnModal } = useUIStore();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

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
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Dropping task over another task
    if (isActiveTask && isOverTask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        moveTask(activeId as string, tasks[overIndex].columnId, overIndex);
      } else {
        const newTasks = arrayMove(tasks, activeIndex, overIndex);
        setTasks(newTasks);
      }
    }

    // Dropping task over an empty column
    if (isActiveTask && isOverColumn) {
      moveTask(activeId as string, overId as string, tasks.filter(t => t.columnId === overId).length);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveColumn = active.data.current?.type === 'Column';
    if (isActiveColumn) {
      reorderColumn(activeId as string, overId as string);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sprint Board</h1>
          <p className="text-muted-foreground mt-1">TaskFlow Redesign</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-4">
            {['A', 'B', 'C'].map((avatar, i) => (
              <div key={i} className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold z-10 hover:z-20 transition-transform hover:scale-110">
                {avatar}
              </div>
            ))}
            <button className="h-8 w-8 rounded-full bg-muted border-2 border-border flex items-center justify-center text-muted-foreground hover:bg-secondary z-10">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button onClick={() => openCreateTaskModal()}><Plus className="mr-2 h-4 w-4" /> Create Task</Button>
        </div>
      </div>

      {/* Board Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="flex gap-6 h-full px-1">
            <SortableContext items={columnsId} strategy={horizontalListSortingStrategy}>
              {columns.map((col) => (
                <BoardColumn
                  key={col.id}
                  column={col}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
            
            <button 
              onClick={() => openCreateColumnModal()}
              className="flex-shrink-0 w-80 rounded-2xl border-2 border-dashed border-border bg-transparent hover:bg-muted/50 hover:border-muted-foreground transition-colors h-14 flex items-center justify-center text-muted-foreground font-medium gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Column
            </button>
          </div>

          {createPortal(
            <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
              {activeColumn && (
                <BoardColumn
                  column={activeColumn}
                  tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                />
              )}
              {activeTask && <BoardTask task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
}
