import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BoardLayout = 'board' | 'list';
export type ProjectLayout = 'list' | 'board' | 'timeline';
export type BoardGroupBy = 'status' | 'priority' | 'assignee' | 'none';
export type BoardOrderBy = 'manual' | 'priority' | 'title' | 'created' | 'activity';
export type CompletedFilter = 'all' | 'none' | 'last-week';
export type TaskViewTab = 'all' | 'active' | 'backlog' | 'dashboard-done';
export type MyTasksTab = 'assigned' | 'created' | 'subscribed' | 'activity';
export type ViewsContentTab = 'tasks' | 'projects';
export type ProjectListTab = 'all' | 'active';

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
  showSubTasks: boolean;
  showEmptyColumns: boolean;
  orderCompletedByRecency: boolean;
  completedTasks: CompletedFilter;
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
  taskViewTab: TaskViewTab;
  myTasksTab: MyTasksTab;
  viewsContentTab: ViewsContentTab;
  projectListTab: ProjectListTab;
  hiddenColumnIds: string[];
  viewsSortKey: 'name' | 'created' | 'updated';
  viewsSortDesc: boolean;
  setBoardFilters: (filters: Partial<BoardFilters>) => void;
  resetBoardFilters: () => void;
  setProjectFilters: (filters: Partial<ProjectFilters>) => void;
  resetProjectFilters: () => void;
  setViewOptions: (options: Partial<ViewOptions>) => void;
  setProjectViewOptions: (options: Partial<ProjectViewOptions>) => void;
  toggleDisplayProperty: (prop: string) => void;
  toggleProjectDisplayProperty: (prop: string) => void;
  setTaskViewTab: (tab: TaskViewTab) => void;
  setMyTasksTab: (tab: MyTasksTab) => void;
  setViewsContentTab: (tab: ViewsContentTab) => void;
  setProjectListTab: (tab: ProjectListTab) => void;
  setViewsSort: (key: 'name' | 'created' | 'updated', desc: boolean) => void;
  toggleHiddenColumn: (columnId: string) => void;
  resetViewOptions: () => void;
  saveViewDefaults: () => void;
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
  showSubTasks: true,
  showEmptyColumns: false,
  orderCompletedByRecency: false,
  completedTasks: 'all',
  displayProperties: ['id', 'status', 'assignee', 'priority', 'project', 'due date', 'labels'],
};

const defaultProjectViewOptions: ProjectViewOptions = {
  layout: 'board',
  groupBy: 'status',
  orderBy: 'manual',
  showClosedProjects: 'all',
  showEmptyColumns: true,
  displayProperties: ['status', 'priority', 'lead', 'target date', 'tasks', 'health'],
};

function migratePersisted(state: FilterState): FilterState {
  const s = state as FilterState & {
    issueViewTab?: TaskViewTab;
    myIssuesTab?: MyTasksTab;
    viewsContentTab?: string;
    viewOptions?: ViewOptions & { showSubIssues?: boolean; completedIssues?: CompletedFilter };
    projectViewOptions?: ProjectViewOptions & { displayProperties?: string[] };
  };
  if (s.issueViewTab) s.taskViewTab = s.issueViewTab;
  if (s.myIssuesTab) s.myTasksTab = s.myIssuesTab;
  if ((s.viewsContentTab as string) === 'issues') s.viewsContentTab = 'tasks';
  if (s.viewOptions?.showSubIssues !== undefined) {
    s.viewOptions.showSubTasks = s.viewOptions.showSubIssues;
  }
  if (s.viewOptions?.completedIssues) {
    s.viewOptions.completedTasks = s.viewOptions.completedIssues;
  }
  if (s.projectViewOptions?.displayProperties) {
    s.projectViewOptions.displayProperties = s.projectViewOptions.displayProperties.map((p) =>
      p === 'issues' ? 'tasks' : p
    );
  }
  return s;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      boardFilters: defaultBoardFilters,
      projectFilters: defaultProjectFilters,
      viewOptions: defaultViewOptions,
      projectViewOptions: defaultProjectViewOptions,
      taskViewTab: 'all',
      myTasksTab: 'assigned',
      viewsContentTab: 'tasks',
      projectListTab: 'all',
      hiddenColumnIds: ['backlog', 'review-hidden', 'done-hidden', 'canceled', 'duplicate'],
      viewsSortKey: 'name',
      viewsSortDesc: true,
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
      setTaskViewTab: (tab) => set({ taskViewTab: tab }),
      setMyTasksTab: (tab) => set({ myTasksTab: tab }),
      setViewsContentTab: (tab) => set({ viewsContentTab: tab }),
      setProjectListTab: (tab) => set({ projectListTab: tab }),
      setViewsSort: (key, desc) => set({ viewsSortKey: key, viewsSortDesc: desc }),
      toggleHiddenColumn: (columnId) =>
        set((s) => ({
          hiddenColumnIds: s.hiddenColumnIds.includes(columnId)
            ? s.hiddenColumnIds.filter((id) => id !== columnId)
            : [...s.hiddenColumnIds, columnId],
        })),
      resetViewOptions: () =>
        set({ viewOptions: defaultViewOptions, projectViewOptions: defaultProjectViewOptions }),
      saveViewDefaults: () => {
        const state = get();
        set({
          viewOptions: { ...state.viewOptions },
          projectViewOptions: { ...state.projectViewOptions },
        });
      },
    }),
    {
      name: 'planora-filters',
      partialize: (s) => ({
        boardFilters: s.boardFilters,
        projectFilters: s.projectFilters,
        viewOptions: s.viewOptions,
        projectViewOptions: s.projectViewOptions,
        hiddenColumnIds: s.hiddenColumnIds,
        taskViewTab: s.taskViewTab,
        myTasksTab: s.myTasksTab,
        viewsContentTab: s.viewsContentTab,
        projectListTab: s.projectListTab,
        viewsSortKey: s.viewsSortKey,
        viewsSortDesc: s.viewsSortDesc,
      }),
      merge: (persisted, current) =>
        migratePersisted({ ...current, ...(persisted as object) } as FilterState),
    }
  )
);
