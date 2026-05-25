import { create } from 'zustand';

type ItemVisibility = "Don't show" | "Show" | "Always show";

type SidebarConfig = {
  dashboard: ItemVisibility;
  inbox: ItemVisibility;
  myTasks: ItemVisibility;
  drafts: ItemVisibility;
  projects: ItemVisibility;
  views: ItemVisibility;
};

interface SidebarState {
  config: SidebarConfig;
  isCustomizeOpen: boolean;
  setCustomizeOpen: (open: boolean) => void;
  updateConfig: (key: keyof SidebarConfig, value: ItemVisibility) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  config: {
    dashboard: 'Always show',
    inbox: 'Show',
    myTasks: 'Show',
    drafts: 'Show',
    projects: 'Show',
    views: 'Show',
  },
  isCustomizeOpen: false,
  setCustomizeOpen: (open) => set({ isCustomizeOpen: open }),
  updateConfig: (key, value) =>
    set((state) => ({
      config: { ...state.config, [key]: value },
    })),
}));
