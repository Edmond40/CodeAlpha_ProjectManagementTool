import type { Task } from '../store/useBoardStore';
import type { BoardFilters, ViewOptions, IssueViewTab } from '../store/useFilterStore';

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export function filterAndSortTasks(
  tasks: Task[],
  filters: BoardFilters,
  viewOptions: ViewOptions,
  issueTab?: IssueViewTab
): Task[] {
  let result = [...tasks];

  if (issueTab === 'active') {
    result = result.filter((t) => t.columnId === 'in-progress' || t.columnId === 'review');
  } else if (issueTab === 'backlog') {
    result = result.filter((t) => t.columnId === 'todo');
  } else if (issueTab === 'dashboard-done') {
    result = result.filter((t) => t.columnId === 'done');
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    );
  }
  if (filters.priorities.length) {
    result = result.filter((t) => filters.priorities.includes(t.priority));
  }
  if (filters.statuses.length) {
    result = result.filter((t) => filters.statuses.includes(t.columnId));
  }
  if (filters.assignees.length) {
    result = result.filter((t) =>
      t.assignees.some((a) => filters.assignees.includes(a))
    );
  }
  if (filters.noAssignee) {
    result = result.filter((t) => t.assignees.length === 0);
  }
  if (filters.labels.length) {
    result = result.filter((t) =>
      t.labels.some((l) => filters.labels.includes(l))
    );
  }

  if (viewOptions.completedIssues === 'none') {
    result = result.filter((t) => t.columnId !== 'done');
  }

  result.sort((a, b) => {
    let cmp = 0;
    switch (viewOptions.orderBy) {
      case 'priority':
        cmp =
          (PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] ?? 9) -
          (PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] ?? 9);
        break;
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'created':
        cmp = a.id.localeCompare(b.id);
        break;
      default:
        cmp = 0;
    }
    return viewOptions.sortDesc ? -cmp : cmp;
  });

  if (viewOptions.orderCompletedByRecency) {
    const done = result.filter((t) => t.columnId === 'done');
    const rest = result.filter((t) => t.columnId !== 'done');
    result = [...rest, ...done.reverse()];
  }

  return result;
}

export function countActiveFilters(filters: BoardFilters): number {
  return (
    filters.priorities.length +
    filters.assignees.length +
    filters.labels.length +
    filters.statuses.length +
    (filters.noAssignee ? 1 : 0) +
    (filters.search ? 1 : 0)
  );
}
