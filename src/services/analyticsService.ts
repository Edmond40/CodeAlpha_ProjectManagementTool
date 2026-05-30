import { api } from './api';

export interface TeamAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  teamMembers: number;
  completionRate: number;
  sprintVelocity: number;
  taskDistribution: { name: string; value: number }[];
  weeklyActivity: { name: string; tasks: number }[];
  teamPerformance: { name: string; tasks: number; completed: number }[];
}

export const analyticsService = {
  getTeamAnalytics: async (teamId: string): Promise<TeamAnalytics> => {
    const response = await api.get<TeamAnalytics>(`/analytics/team/${teamId}`);
    return response.data;
  },
};
