import { create } from 'zustand';

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

const initialTeam: TeamMember[] = [
  { id: 0, name: 'Linear', role: 'Application', email: 'app@linear.app', status: 'Offline', joined: 'May 22', teams: [], lastSeen: 'May 22' },
  { id: 1, name: 'osei edmond', role: 'Admin', email: 'www.obolotech@gmail.com', status: 'Online', joined: 'May 22', teams: ['DEV'], lastSeen: 'Online' },
  { id: 2, name: 'Alex Morgan', role: 'Admin', email: 'alex@taskflow.com', status: 'Online', joined: 'May 22', teams: ['DEV'], lastSeen: 'May 24', invited: true },
  { id: 3, name: 'Sarah Chen', role: 'Manager', email: 'sarah@taskflow.com', status: 'Offline', joined: 'May 20', teams: ['DEV'], lastSeen: 'May 23' },
  { id: 4, name: 'Michael Ross', role: 'Member', email: 'michael@taskflow.com', status: 'Online', joined: 'May 18', teams: [], lastSeen: 'May 24' },
];

interface TeamState {
  members: TeamMember[];
  addMember: (member: Omit<TeamMember, 'id' | 'status' | 'joined' | 'lastSeen' | 'teams'>) => void;
  updateMember: (id: number, fields: Partial<TeamMember>) => void;
  removeMember: (id: number) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: initialTeam,
  addMember: (member) =>
    set((state) => ({
      members: [
        ...state.members,
        {
          ...member,
          id: Date.now(),
          status: 'Offline',
          joined: 'May 24',
          lastSeen: 'Invited',
          teams: ['DEV'],
          invited: true,
        },
      ],
    })),
  updateMember: (id, fields) =>
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? { ...m, ...fields } : m)),
    })),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    })),
}));
