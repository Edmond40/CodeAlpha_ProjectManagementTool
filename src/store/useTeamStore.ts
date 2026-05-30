import { create } from 'zustand';
import { teamService } from '../services/teamService';

export type TeamMember = {
  id: number;
  name: string;
  role: 'Admin' | 'Manager' | 'Member' | 'Application';
  email: string;
  status: 'Online' | 'Offline' | 'In a meeting';
  joined: string;
  teams: string[];
  lastSeen: string;
  invited?: boolean;
};

interface TeamState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  activeTeamId: string | null;
  setActiveTeamId: (teamId: string) => void;
  fetchMembers: (teamId: string) => Promise<void>;
  addMember: (member: Omit<TeamMember, 'id' | 'status' | 'joined' | 'lastSeen' | 'teams'>) => void;
  updateMember: (id: number, fields: Partial<TeamMember>) => void;
  removeMember: (id: number) => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  loading: false,
  error: null,
  activeTeamId: null,

  setActiveTeamId: (teamId) => set({ activeTeamId: teamId }),

  fetchMembers: async (teamId) => {
    set({ loading: true, error: null, activeTeamId: teamId });
    try {
      const response = await teamService.listMembers(teamId);
      const mapped: TeamMember[] = response.map((m, idx) => ({
        id: parseInt(m.id, 36) || idx + 1,
        name: m.name,
        role: m.role === 'ADMIN' ? 'Admin' : m.role === 'MANAGER' ? 'Manager' : 'Member',
        email: m.email,
        status: (m.status as TeamMember['status']) || 'Offline',
        joined: m.joined || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        teams: [],
        lastSeen: m.lastSeen || 'Offline',
      }));
      set({ members: mapped, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addMember: (member) => {
    const { activeTeamId } = get();
    const newId = Date.now();
    set((state) => ({
      members: [
        ...state.members,
        {
          ...member,
          id: newId,
          status: 'Offline',
          joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          lastSeen: 'Invited',
          teams: ['DEV'],
          invited: true,
        },
      ],
    }));
    if (activeTeamId) {
      teamService.inviteMember(activeTeamId, {
        name: member.name,
        email: member.email,
        role: member.role.toUpperCase() as 'ADMIN' | 'MANAGER' | 'MEMBER',
      }).catch(() => {
        if (activeTeamId) get().fetchMembers(activeTeamId);
      });
    }
  },

  updateMember: (id, fields) => {
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? { ...m, ...fields } : m)),
    }));
    const { activeTeamId } = get();
    if (activeTeamId && fields.role) {
      teamService.updateMember(activeTeamId, String(id), { role: fields.role.toUpperCase() }).catch(() => {
        if (activeTeamId) get().fetchMembers(activeTeamId);
      });
    }
  },

  removeMember: (id) => {
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    }));
  },
}));
