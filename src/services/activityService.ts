import { api } from './api';

export interface Activity {
  id: string;
  user: string;
  action: string;
  project: string;
  time: string;
  type: string;
  createdAt: string;
}

export const activityService = {
  getTeamActivity: async (teamId: string): Promise<Activity[]> => {
    const response = await api.get<Activity[]>(`/activity/team/${teamId}`);
    return response.data;
  },
};
