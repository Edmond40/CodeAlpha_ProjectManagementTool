import { create } from 'zustand';

type Toast = {
  id: string;
  title: string;
  description?: string;
  type?: 'default' | 'success' | 'error';
};

interface UIState {
  isTaskModalOpen: boolean;
  activeTaskId: string | null;
  openTaskModal: (taskId: string) => void;
  closeTaskModal: () => void;
  
  isProjectModalOpen: boolean;
  activeProjectId: number | null;
  openProjectModal: (projectId?: number) => void;
  closeProjectModal: () => void;

  isInviteMemberModalOpen: boolean;
  activeMemberId: number | null;
  openInviteMemberModal: (memberId?: number) => void;
  closeInviteMemberModal: () => void;

  isCreateTaskModalOpen: boolean;
  activeColumnId: string | null;
  openCreateTaskModal: (columnId?: string) => void;
  closeCreateTaskModal: () => void;

  isCreateColumnModalOpen: boolean;
  openCreateColumnModal: () => void;
  closeCreateColumnModal: () => void;

  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTaskModalOpen: false,
  activeTaskId: null,
  openTaskModal: (taskId) => set({ isTaskModalOpen: true, activeTaskId: taskId }),
  closeTaskModal: () => set({ isTaskModalOpen: false, activeTaskId: null }),

  isProjectModalOpen: false,
  activeProjectId: null,
  openProjectModal: (projectId) => set({ isProjectModalOpen: true, activeProjectId: projectId || null }),
  closeProjectModal: () => set({ isProjectModalOpen: false, activeProjectId: null }),

  isInviteMemberModalOpen: false,
  activeMemberId: null,
  openInviteMemberModal: (memberId) => set({ isInviteMemberModalOpen: true, activeMemberId: memberId || null }),
  closeInviteMemberModal: () => set({ isInviteMemberModalOpen: false, activeMemberId: null }),

  isCreateTaskModalOpen: false,
  activeColumnId: null,
  openCreateTaskModal: (columnId) => set({ isCreateTaskModalOpen: true, activeColumnId: columnId || null }),
  closeCreateTaskModal: () => set({ isCreateTaskModalOpen: false, activeColumnId: null }),

  isCreateColumnModalOpen: false,
  openCreateColumnModal: () => set({ isCreateColumnModalOpen: true }),
  closeCreateColumnModal: () => set({ isCreateColumnModalOpen: false }),

  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    // Auto remove after 3 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
