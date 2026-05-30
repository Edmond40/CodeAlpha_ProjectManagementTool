import { api } from './api';

export interface Team {
  id: string;
  name: string;
  identifier?: string;
  createdAt: string;
  memberCount?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  status?: string;
  joined?: string;
  lastSeen?: string;
}

export interface CreateTeamInput {
  name: string;
  identifier?: string;
  timezone?: string;
}

export interface InviteMemberInput {
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
}

export const teamService = {
  createTeam: async (data: CreateTeamInput): Promise<Team> => {
    const response = await api.post<Team>('/teams', data);
    return response.data;
  },

  getTeams: async (): Promise<Team[]> => {
    const response = await api.get<Team[]>('/teams');
    return response.data;
  },

  getTeam: async (id: string): Promise<Team> => {
    const response = await api.get<Team>(`/teams/${id}`);
    return response.data;
  },

  updateTeam: async (id: string, data: Partial<Team>): Promise<Team> => {
    const response = await api.put<Team>(`/teams/${id}`, data);
    return response.data;
  },

  deleteTeam: async (id: string): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },

  inviteMember: async (teamId: string, data: InviteMemberInput): Promise<TeamMember> => {
    const response = await api.post<TeamMember>(`/teams/${teamId}/invite`, data);
    return response.data;
  },

  listMembers: async (teamId: string): Promise<TeamMember[]> => {
    const response = await api.get<TeamMember[]>(`/teams/${teamId}/members`);
    return response.data;
  },

  updateMember: async (teamId: string, memberId: string, data: { role: string }): Promise<TeamMember> => {
    const response = await api.put<TeamMember>(`/teams/${teamId}/members/${memberId}`, data);
    return response.data;
  },
};
