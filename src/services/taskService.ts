import { api } from './api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: string;
  columnId?: string;
  assignees?: string[];
  labels?: string[];
  comments?: number;
  teamId: string;
  projectId?: string;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: string;
  columnId?: string;
  teamId: string;
}

export const taskService = {
  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  getTeamTasks: async (teamId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tasks/team/${teamId}`);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },
};
