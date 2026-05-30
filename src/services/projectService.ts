import { api } from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  deadline: string;
  teamId: string;
  createdAt: string;
  progress?: number;
  comments?: number;
  tasks?: { completed: number; total: number };
}

export interface CreateProjectInput {
  name: string;
  description: string;
  deadline: string;
  status: string;
  teamId: string;
}

export const projectService = {
  createProject: async (data: CreateProjectInput): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  getTeamProjects: async (teamId: string): Promise<Project[]> => {
    const response = await api.get<Project[]>(`/projects/team/${teamId}`);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },
};
