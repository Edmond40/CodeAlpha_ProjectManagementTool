import { create } from 'zustand';

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
  setTasks: (tasks: Task[]) => void;
  setColumns: (columns: Column[]) => void;
  moveTask: (taskId: string, toColumnId: string, newIndex: number) => void;
  reorderColumn: (activeId: string, overId: string) => void;
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

const initialTasks: Task[] = [
  { id: 't1', columnId: 'todo', title: 'Design Landing Page', description: 'Create wireframes and hi-fi mockups.', priority: 'High', labels: ['Design'], assignees: ['Alex'], comments: 3 },
  { id: 't2', columnId: 'todo', title: 'Setup CI/CD', description: 'Configure GitHub Actions for deployment.', priority: 'Medium', labels: ['DevOps'], assignees: ['Sam'], comments: 0 },
  { id: 't3', columnId: 'in-progress', title: 'Implement Auth', description: 'JWT authentication using Node.js.', priority: 'High', labels: ['Backend'], assignees: ['Alex', 'Sam'], comments: 5 },
  { id: 't4', columnId: 'review', title: 'Update dependencies', description: 'Bump React and Vite to latest.', priority: 'Low', labels: ['Maintenance'], assignees: [], comments: 1 },
  { id: 't5', columnId: 'done', title: 'Project Kickoff', description: 'Initial meeting with stakeholders.', priority: 'High', labels: ['Management'], assignees: ['Alex'], comments: 12 },
];

export const useBoardStore = create<BoardState>((set) => ({
  columns: initialColumns,
  tasks: initialTasks,
  setTasks: (tasks) => set({ tasks }),
  setColumns: (columns) => set({ columns }),
  moveTask: (taskId, toColumnId, newIndex) => set((state) => {
    const taskIndex = state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return state;

    const newTasks = [...state.tasks];
    const [task] = newTasks.splice(taskIndex, 1);
    task.columnId = toColumnId;

    // Insert at new index relative to the column
    const columnTasks = newTasks.filter(t => t.columnId === toColumnId);
    const otherTasks = newTasks.filter(t => t.columnId !== toColumnId);
    
    columnTasks.splice(newIndex, 0, task);
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
