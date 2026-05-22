import { create } from 'zustand';

export type TeamMember = {
  id: number;
  name: string;
  role: 'Admin' | 'Manager' | 'Member';
  email: string;
  status: 'Online' | 'Offline' | 'In a meeting';
};

const initialTeam: TeamMember[] = [
  { id: 1, name: 'Alex Morgan', role: 'Admin', email: 'alex@taskflow.com', status: 'Online' },
  { id: 2, name: 'Sarah Chen', role: 'Manager', email: 'sarah@taskflow.com', status: 'Offline' },
  { id: 3, name: 'Michael Ross', role: 'Member', email: 'michael@taskflow.com', status: 'Online' },
  { id: 4, name: 'Emma Watson', role: 'Member', email: 'emma@taskflow.com', status: 'In a meeting' },
];

interface TeamState {
  members: TeamMember[];
  addMember: (member: Omit<TeamMember, 'id' | 'status'>) => void;
  updateMember: (id: number, fields: Partial<TeamMember>) => void;
  removeMember: (id: number) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: initialTeam,
  addMember: (member) => set((state) => ({
    members: [...state.members, { ...member, id: Date.now(), status: 'Offline' }]
  })),
  updateMember: (id, fields) => set((state) => ({
    members: state.members.map(m => m.id === id ? { ...m, ...fields } : m)
  })),
  removeMember: (id) => set((state) => ({
    members: state.members.filter(m => m.id !== id)
  })),
}));
