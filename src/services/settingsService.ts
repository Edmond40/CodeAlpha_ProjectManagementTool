import { api } from './api';

export interface TeamSettings {
  timezone?: string;
  copyFromTeamId?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    tasks: boolean;
    deadlines: boolean;
  };
}

export const settingsService = {
  getSettings: async (teamId: string): Promise<TeamSettings> => {
    const response = await api.get<TeamSettings>(`/teams/${teamId}/settings`);
    return response.data;
  },

  updateSettings: async (teamId: string, data: TeamSettings): Promise<TeamSettings> => {
    const response = await api.put<TeamSettings>(`/teams/${teamId}/settings`, data);
    return response.data;
  },
};
