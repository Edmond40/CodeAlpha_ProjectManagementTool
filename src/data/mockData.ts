export const mockStats = {
  totalProjects: 12,
  tasksCompleted: 148,
  teamMembers: 24,
  productivityScore: 92,
  activeSprints: 3,
  upcomingDeadlines: 7,
};

export const mockProductivityData = [
  { name: 'Mon', completed: 4, added: 6 },
  { name: 'Tue', completed: 7, added: 3 },
  { name: 'Wed', completed: 5, added: 5 },
  { name: 'Thu', completed: 9, added: 4 },
  { name: 'Fri', completed: 6, added: 8 },
  { name: 'Sat', completed: 2, added: 1 },
  { name: 'Sun', completed: 3, added: 2 },
];

export const mockWeeklyActivity = [
  { name: 'Week 1', tasks: 40 },
  { name: 'Week 2', tasks: 55 },
  { name: 'Week 3', tasks: 35 },
  { name: 'Week 4', tasks: 70 },
  { name: 'Week 5', tasks: 60 },
  { name: 'Week 6', tasks: 80 },
];

export const mockSprintData = [
  { name: 'Sprint 45', planned: 24, completed: 24 },
  { name: 'Sprint 46', planned: 22, completed: 22 },
  { name: 'Sprint 47', planned: 20, completed: 13 },
  { name: 'Sprint 48', planned: 18, completed: 0 },
];

export const mockTeamPerformance = [
  { name: 'Alex', tasks: 32, completed: 28 },
  { name: 'Sarah', tasks: 25, completed: 22 },
  { name: 'Michael', tasks: 18, completed: 15 },
  { name: 'Emma', tasks: 22, completed: 20 },
  { name: 'James', tasks: 15, completed: 12 },
  { name: 'Lisa', tasks: 20, completed: 18 },
];

export const mockNotifications = [
  { id: '1', type: 'mention', message: 'Alex mentioned you in "Dashboard Redesign"', time: '2m ago', read: false },
  { id: '2', type: 'assign', message: 'You were assigned to "Rate limiting middleware"', time: '1h ago', read: false },
  { id: '3', type: 'deadline', message: '"API Gateway Migration" is due tomorrow', time: '3h ago', read: false },
  { id: '4', type: 'invite', message: 'You were invited to "Marketing" workspace', time: '1d ago', read: true },
  { id: '5', type: 'comment', message: 'Sarah commented on "Design System v2"', time: '2d ago', read: true },
  { id: '6', type: 'update', message: 'Sprint 47 progress is at 65%', time: '3d ago', read: true },
];

export const mockActivityFeed = [
  { id: 'a1', user: 'Alex', action: 'completed task "Finalize breakpoints"', project: 'Dashboard Redesign', time: '3h ago', type: 'completed' },
  { id: 'a2', user: 'Sarah', action: 'updated progress to 72%', project: 'Dashboard Redesign', time: '5h ago', type: 'updated' },
  { id: 'a3', user: 'Michael', action: 'joined the workspace', project: 'Design System v2', time: '1d ago', type: 'joined' },
  { id: 'a4', user: 'Emma', action: 'created project "Mobile Prototype"', project: 'Mobile Prototype', time: '2d ago', type: 'created' },
  { id: 'a5', user: 'James', action: 'added a comment on DSN-123', project: 'Design System v2', time: '2d ago', type: 'comment' },
  { id: 'a6', user: 'Lisa', action: 'moved task to "In Review"', project: 'API Gateway', time: '3d ago', type: 'updated' },
];
