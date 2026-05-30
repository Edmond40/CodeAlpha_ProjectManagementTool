import { api } from './api';

export interface Notification {
  id: string;
  type: string;
  message: string;
  time: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  getTeamNotifications: async (teamId: string): Promise<Notification[]> => {
    const response = await api.get<Notification[]>(`/notifications/team/${teamId}`);
    return response.data;
  },

  updateNotification: async (id: string, state: 'READ' | 'UNREAD' | 'ARCHIVED'): Promise<Notification> => {
    const response = await api.put<Notification>(`/notifications/${id}`, { state });
    return response.data;
  },
};
