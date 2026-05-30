import { create } from 'zustand';
import { taskService } from '../services/taskService';

export type Task = {
  id: string;
  columnId: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  labels: string[];
  assignees: string[];
  comments: number;
};

export type Column = {
  id: string;
  title: string;
};

interface BoardState {
  columns: Column[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  activeTeamId: string | null;
  setTasks: (tasks: Task[]) => void;
  setColumns: (columns: Column[]) => void;
  setActiveTeamId: (teamId: string) => void;
  fetchTasks: (teamId: string) => Promise<void>;
  createTask: (task: { title: string; description?: string; priority: 'Low' | 'Medium' | 'High'; columnId: string }) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  moveTask: (taskId: string, toColumnId: string, newIndex: number) => void;
  reorderColumn: (activeId: string, overId: string) => void;
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: initialColumns,
  tasks: [],
  loading: false,
  error: null,
  activeTeamId: null,

  setTasks: (tasks) => set({ tasks }),
  setColumns: (columns) => set({ columns }),

  setActiveTeamId: (teamId) => set({ activeTeamId: teamId }),

  fetchTasks: async (teamId) => {
    set({ loading: true, error: null, activeTeamId: teamId });
    try {
      const tasks = await taskService.getTeamTasks(teamId);
      const mapped: Task[] = tasks.map((t) => ({
        id: t.id,
        columnId: t.columnId || t.status?.toLowerCase().replace(/\s+/g, '-') || 'todo',
        title: t.title,
        description: t.description || '',
        priority: t.priority as Task['priority'],
        labels: t.labels || [],
        assignees: t.assignees || [],
        comments: t.comments || 0,
      }));
      set({ tasks: mapped, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createTask: async (task) => {
    const { activeTeamId } = get();
    if (!activeTeamId) return;
    try {
      const created = await taskService.createTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.columnId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        columnId: task.columnId,
        teamId: activeTeamId,
      });
      const newTask: Task = {
        id: created.id,
        columnId: created.columnId || task.columnId,
        title: created.title,
        description: created.description || '',
        priority: (created.priority || task.priority) as Task['priority'],
        labels: created.labels || [],
        assignees: created.assignees || [],
        comments: created.comments || 0,
      };
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateTask: async (id, data) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
    try {
      await taskService.updateTask(id, data);
    } catch (error) {
      const { activeTeamId } = get();
      if (activeTeamId) get().fetchTasks(activeTeamId);
    }
  },

  moveTask: (taskId, toColumnId, newIndex) => set((state) => {
    const taskIndex = state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return state;

    const newTasks = [...state.tasks];
    const [task] = newTasks.splice(taskIndex, 1);
    task.columnId = toColumnId;

    const columnTasks = newTasks.filter(t => t.columnId === toColumnId);
    const otherTasks = newTasks.filter(t => t.columnId !== toColumnId);

    columnTasks.splice(newIndex, 0, task);

    taskService.updateTask(taskId, { columnId: toColumnId }).catch(() => {
      const { activeTeamId } = get();
      if (activeTeamId) get().fetchTasks(activeTeamId);
    });

    return { tasks: [...otherTasks, ...columnTasks] };
  }),

  reorderColumn: (activeId, overId) => set((state) => {
    const oldIndex = state.columns.findIndex(c => c.id === activeId);
    const newIndex = state.columns.findIndex(c => c.id === overId);
    if (oldIndex === -1 || newIndex === -1) return state;

    const newColumns = [...state.columns];
    const [col] = newColumns.splice(oldIndex, 1);
    newColumns.splice(newIndex, 0, col);
    return { columns: newColumns };
  }),
}));
