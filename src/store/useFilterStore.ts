import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BoardLayout = 'board' | 'list';
export type ProjectLayout = 'list' | 'board' | 'timeline';
export type BoardGroupBy = 'status' | 'priority' | 'assignee' | 'none';
export type BoardOrderBy = 'manual' | 'priority' | 'title' | 'created' | 'activity';
export type CompletedFilter = 'all' | 'none' | 'last-week';
export type IssueViewTab = 'all' | 'active' | 'backlog' | 'dashboard-done';
export type MyIssuesTab = 'assigned' | 'created' | 'subscribed' | 'activity';
export type ViewsContentTab = 'issues' | 'projects';

export interface BoardFilters {
  priorities: string[];
  assignees: string[];
  labels: string[];
  statuses: string[];
  search: string;
  noAssignee: boolean;
}

export interface ViewOptions {
  layout: BoardLayout;
  groupBy: BoardGroupBy;
  orderBy: BoardOrderBy;
  sortDesc: boolean;
  showSubIssues: boolean;
  showEmptyColumns: boolean;
  orderCompletedByRecency: boolean;
  completedIssues: CompletedFilter;
  displayProperties: string[];
}

export interface ProjectViewOptions {
  layout: ProjectLayout;
  groupBy: 'status' | 'lead' | 'none';
  orderBy: 'manual' | 'name' | 'updated';
  showClosedProjects: CompletedFilter;
  showEmptyColumns: boolean;
  displayProperties: string[];
}

export interface ProjectFilters {
  statuses: string[];
  search: string;
}

interface FilterState {
  boardFilters: BoardFilters;
  projectFilters: ProjectFilters;
  viewOptions: ViewOptions;
  projectViewOptions: ProjectViewOptions;
  issueViewTab: IssueViewTab;
  myIssuesTab: MyIssuesTab;
  viewsContentTab: ViewsContentTab;
  hiddenColumnIds: string[];
  setBoardFilters: (filters: Partial<BoardFilters>) => void;
  resetBoardFilters: () => void;
  setProjectFilters: (filters: Partial<ProjectFilters>) => void;
  resetProjectFilters: () => void;
  setViewOptions: (options: Partial<ViewOptions>) => void;
  setProjectViewOptions: (options: Partial<ProjectViewOptions>) => void;
  toggleDisplayProperty: (prop: string) => void;
  toggleProjectDisplayProperty: (prop: string) => void;
  setIssueViewTab: (tab: IssueViewTab) => void;
  setMyIssuesTab: (tab: MyIssuesTab) => void;
  setViewsContentTab: (tab: ViewsContentTab) => void;
  toggleHiddenColumn: (columnId: string) => void;
  resetViewOptions: () => void;
}

const defaultBoardFilters: BoardFilters = {
  priorities: [],
  assignees: [],
  labels: [],
  statuses: [],
  search: '',
  noAssignee: false,
};

const defaultProjectFilters: ProjectFilters = {
  statuses: [],
  search: '',
};

const defaultViewOptions: ViewOptions = {
  layout: 'board',
  groupBy: 'status',
  orderBy: 'manual',
  sortDesc: false,
  showSubIssues: true,
  showEmptyColumns: false,
  orderCompletedByRecency: false,
  completedIssues: 'all',
  displayProperties: ['id', 'status', 'assignee', 'priority', 'project', 'due date', 'labels'],
};

const defaultProjectViewOptions: ProjectViewOptions = {
  layout: 'board',
  groupBy: 'status',
  orderBy: 'manual',
  showClosedProjects: 'all',
  showEmptyColumns: true,
  displayProperties: ['status', 'priority', 'lead', 'target date', 'issues', 'health'],
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      boardFilters: defaultBoardFilters,
      projectFilters: defaultProjectFilters,
      viewOptions: defaultViewOptions,
      projectViewOptions: defaultProjectViewOptions,
      issueViewTab: 'all',
      myIssuesTab: 'assigned',
      viewsContentTab: 'issues',
      hiddenColumnIds: ['backlog', 'review-hidden', 'done-hidden', 'canceled', 'duplicate'],
      setBoardFilters: (filters) =>
        set((s) => ({ boardFilters: { ...s.boardFilters, ...filters } })),
      resetBoardFilters: () => set({ boardFilters: defaultBoardFilters }),
      setProjectFilters: (filters) =>
        set((s) => ({ projectFilters: { ...s.projectFilters, ...filters } })),
      resetProjectFilters: () => set({ projectFilters: defaultProjectFilters }),
      setViewOptions: (options) =>
        set((s) => ({ viewOptions: { ...s.viewOptions, ...options } })),
      setProjectViewOptions: (options) =>
        set((s) => ({ projectViewOptions: { ...s.projectViewOptions, ...options } })),
      toggleDisplayProperty: (prop) =>
        set((s) => {
          const props = s.viewOptions.displayProperties;
          const next = props.includes(prop)
            ? props.filter((p) => p !== prop)
            : [...props, prop];
          return { viewOptions: { ...s.viewOptions, displayProperties: next } };
        }),
      toggleProjectDisplayProperty: (prop) =>
        set((s) => {
          const props = s.projectViewOptions.displayProperties;
          const next = props.includes(prop)
            ? props.filter((p) => p !== prop)
            : [...props, prop];
          return { projectViewOptions: { ...s.projectViewOptions, displayProperties: next } };
        }),
      setIssueViewTab: (tab) => set({ issueViewTab: tab }),
      setMyIssuesTab: (tab) => set({ myIssuesTab: tab }),
      setViewsContentTab: (tab) => set({ viewsContentTab: tab }),
      toggleHiddenColumn: (columnId) =>
        set((s) => ({
          hiddenColumnIds: s.hiddenColumnIds.includes(columnId)
            ? s.hiddenColumnIds.filter((id) => id !== columnId)
            : [...s.hiddenColumnIds, columnId],
        })),
      resetViewOptions: () =>
        set({ viewOptions: defaultViewOptions, projectViewOptions: defaultProjectViewOptions }),
    }),
    {
      name: 'planora-filters',
      partialize: (s) => ({
        viewOptions: s.viewOptions,
        projectViewOptions: s.projectViewOptions,
        hiddenColumnIds: s.hiddenColumnIds,
        issueViewTab: s.issueViewTab,
      }),
    }
  )
);
