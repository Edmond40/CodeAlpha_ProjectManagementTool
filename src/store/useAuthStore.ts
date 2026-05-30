import { create } from 'zustand';
import { authService } from '../services/authService';
import { teamService } from '../services/teamService';
import type { Team } from '../services/teamService';

export type User = {
  id: string;
  name: string;
  email: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  teams: Team[];
  activeTeamId: string | null;
  loading: boolean;
  initialized: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchTeams: () => Promise<void>;
  setActiveTeam: (teamId: string) => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  teams: [],
  activeTeamId: null,
  loading: false,
  initialized: false,

  init: () => {
    const token = localStorage.getItem('taskflow_token');
    const userJson = localStorage.getItem('taskflow_user');
    const activeTeamId = localStorage.getItem('activeTeamId');
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        set({ token, user, activeTeamId, initialized: true });
        get().fetchTeams();
      } catch {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        set({ initialized: true });
      }
    } else {
      set({ initialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('taskflow_token', response.token);
      localStorage.setItem('taskflow_user', JSON.stringify(response.user));
      set({ user: response.user, token: response.token, loading: false });
      await get().fetchTeams();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await authService.register({ name, email, password });
      localStorage.setItem('taskflow_token', response.token);
      localStorage.setItem('taskflow_user', JSON.stringify(response.user));
      set({ user: response.user, token: response.token, loading: false });
      await get().fetchTeams();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('activeTeamId');
    set({ user: null, token: null, teams: [], activeTeamId: null });
  },

  fetchTeams: async () => {
    try {
      const teams = await teamService.getTeams();
      set({ teams });
      const { activeTeamId } = get();
      if (!activeTeamId && teams.length > 0) {
        const firstId = teams[0].id;
        localStorage.setItem('activeTeamId', firstId);
        set({ activeTeamId: firstId });
      }
    } catch {
      // User may have no teams yet
    }
  },

  setActiveTeam: (teamId: string) => {
    localStorage.setItem('activeTeamId', teamId);
    set({ activeTeamId: teamId });
  },
}));
