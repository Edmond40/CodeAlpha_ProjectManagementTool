import { create } from 'zustand';
import { projectService } from '../services/projectService';

export type Project = {
  id: number;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  progress: number;
  deadline: string;
  comments: number;
  tasks: { completed: number; total: number };
};

interface ProjectState {
  projects: Project[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  activeTeamId: string | null;
  setSearchQuery: (query: string) => void;
  filteredProjects: (statusFilter?: string[]) => Project[];
  setActiveTeamId: (teamId: string) => void;
  fetchProjects: (teamId: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  removeProject: (id: number) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  searchQuery: '',
  loading: false,
  error: null,
  activeTeamId: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveTeamId: (teamId) => set({ activeTeamId: teamId }),

  filteredProjects: (statusFilter?: string[]) => {
    const { projects, searchQuery } = get();
    let result = projects;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }
    if (statusFilter?.length) {
      result = result.filter((p) => statusFilter.includes(p.status));
    }
    return result;
  },

  fetchProjects: async (teamId) => {
    set({ loading: true, error: null, activeTeamId: teamId });
    try {
      const response = await projectService.getTeamProjects(teamId);
      const mapped: Project[] = response.map((p) => ({
        id: parseInt(p.id, 36) || Math.floor(Math.random() * 10000),
        name: p.name,
        description: p.description,
        status: p.status as Project['status'],
        progress: p.progress || 0,
        deadline: p.deadline || '',
        comments: p.comments || 0,
        tasks: p.tasks || { completed: 0, total: 0 },
      }));
      set({ projects: mapped, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addProject: (project) => {
    const { activeTeamId } = get();
    const newId = Date.now();
    set((state) => ({
      projects: [...state.projects, { ...project, id: newId }],
    }));
    if (activeTeamId) {
      projectService.createProject({
        name: project.name,
        description: project.description,
        deadline: project.deadline,
        status: project.status,
        teamId: activeTeamId,
      }).catch(() => {
        if (activeTeamId) get().fetchProjects(activeTeamId);
      });
    }
  },

  updateProject: (id, updatedFields) => {
    set((state) => ({
      projects: state.projects.map(p => p.id === id ? { ...p, ...updatedFields } : p),
    }));
    const { activeTeamId } = get();
    if (activeTeamId) {
      projectService.updateProject(String(id), updatedFields).catch(() => {
        if (activeTeamId) get().fetchProjects(activeTeamId);
      });
    }
  },

  removeProject: (id) => {
    set((state) => ({
      projects: state.projects.filter(p => p.id !== id),
    }));
  },
}));
