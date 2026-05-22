import { create } from 'zustand';

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

const initialProjects: Project[] = [
  { id: 1, name: 'TaskFlow Redesign', description: 'Complete overhaul of the main dashboard and kanban board.', status: 'In Progress', progress: 65, deadline: 'Oct 24', comments: 12, tasks: { completed: 24, total: 36 } },
  { id: 2, name: 'Q3 Marketing Campaign', description: 'Social media assets, email sequences, and ad copies for Q3.', status: 'Planning', progress: 15, deadline: 'Nov 05', comments: 4, tasks: { completed: 5, total: 42 } },
  { id: 3, name: 'Mobile App Launch', description: 'React Native app deployment to App Store and Google Play.', status: 'Review', progress: 90, deadline: 'Oct 15', comments: 28, tasks: { completed: 110, total: 120 } },
  { id: 4, name: 'Customer Portal', description: 'Self-service portal for enterprise customers.', status: 'Completed', progress: 100, deadline: 'Sep 30', comments: 45, tasks: { completed: 85, total: 85 } },
];

interface ProjectState {
  projects: Project[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProjects: () => Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  removeProject: (id: number) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: initialProjects,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filteredProjects: () => {
    const { projects, searchQuery } = get();
    if (!searchQuery) return projects;
    const lowerQuery = searchQuery.toLowerCase();
    return projects.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
  },
  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: Date.now() }]
  })),
  updateProject: (id, updatedFields) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updatedFields } : p)
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  }))
}));
