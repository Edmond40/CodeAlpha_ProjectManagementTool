import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const password = await bcrypt.hash('Password123!', 10);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@planora.app' },
    update: {},
    create: {
      email: 'admin@planora.app',
      name: 'Planora Admin',
      password,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    }
  });

  const users = [
    {
      email: 'alex@planora.app',
      name: 'Alex Johnson',
      seed: 'Alex'
    },
    {
      email: 'sarah@planora.app',
      name: 'Sarah Wilson',
      seed: 'Sarah'
    },
    {
      email: 'michael@planora.app',
      name: 'Michael Brown',
      seed: 'Michael'
    },
    {
      email: 'emma@planora.app',
      name: 'Emma Davis',
      seed: 'Emma'
    },
    {
      email: 'james@planora.app',
      name: 'James Miller',
      seed: 'James'
    },
    {
      email: 'lisa@planora.app',
      name: 'Lisa Anderson',
      seed: 'Lisa'
    }
  ];

  const createdUsers: any[] = [admin];

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.seed}`
      }
    });
    createdUsers.push(user);
  }

  // Create team
  const team = await prisma.team.upsert({
    where: { identifier: 'planora' },
    update: {},
    create: {
      name: 'Planora Team',
      identifier: 'planora',
      description: 'Example workspace for project management',
      visibility: 'PUBLIC',
      timezone: 'UTC',
      colorTheme: 'INDIGO',
      createdById: admin.id
    }
  });

  // Add team members
  for (const user of createdUsers) {
    await prisma.teamMember.upsert({
      where: { userId_teamId: { userId: user.id, teamId: team.id } },
      update: {},
      create: {
        userId: user.id,
        teamId: team.id,
        role: user.id === admin.id ? 'ADMIN' : 'MEMBER',
        userEmail: user.email
      }
    });
  }

  // Create team settings
  await prisma.teamSettings.upsert({
    where: { teamId: team.id },
    update: {},
    create: {
      teamId: team.id,
      workflowConfig: { defaultBoard: 'Kanban', allowAttachments: true },
      sprintConfig: { durationDays: 14, autoRollOver: false },
      notificationConfig: { email: true, inApp: true },
      permissionConfig: { managerCanInvite: true },
      productivityConfig: { showVelocity: true }
    }
  });

  // Create team analytics
  await prisma.teamAnalytics.upsert({
    where: { teamId: team.id },
    update: {},
    create: {
      teamId: team.id,
      completedTasks: 148,
      productivityPct: 92,
      sprintVelocity: 42.5,
      activeMembers: 6,
      weeklyPerformance: {
        Mon: 4,
        Tue: 7,
        Wed: 5,
        Thu: 9,
        Fri: 6,
        Sat: 2,
        Sun: 3
      },
      workloadSummary: {
        Alex: 32,
        Sarah: 25,
        Michael: 18,
        Emma: 22,
        James: 15,
        Lisa: 20
      }
    }
  });

  // Create projects
  const projects = [
    {
      name: 'Dashboard Redesign',
      description: 'Complete redesign of the admin dashboard',
      color: 'indigo'
    },
    {
      name: 'API Gateway Migration',
      description: 'Migrate to new API gateway infrastructure',
      color: 'blue'
    },
    {
      name: 'Design System v2',
      description: 'Build component library and design tokens',
      color: 'emerald'
    },
    {
      name: 'Mobile Prototype',
      description: 'Create mobile app prototype',
      color: 'rose'
    }
  ];

  const createdProjects: any[] = [];
  for (const p of projects) {
    const project = await prisma.project.create({
      data: {
        name: p.name,
        description: p.description,
        color: p.color,
        teamId: team.id,
        status: 'active'
      }
    });
    createdProjects.push(project);
  }

  // Create sprint cycles
  const sprints = [
    { name: 'Sprint 45', status: 'COMPLETED' as const, startDate: new Date('2026-05-01'), endDate: new Date('2026-05-14') },
    { name: 'Sprint 46', status: 'COMPLETED' as const, startDate: new Date('2026-05-15'), endDate: new Date('2026-05-28') },
    { name: 'Sprint 47', status: 'ACTIVE' as const, startDate: new Date('2026-05-29'), endDate: new Date('2026-06-11') }
  ];

  const createdSprints: any[] = [];
  for (const s of sprints) {
    const sprint = await prisma.sprintCycle.create({
      data: {
        name: s.name,
        status: s.status,
        teamId: team.id,
        startDate: s.startDate,
        endDate: s.endDate,
        goals: { velocity: 42, capacity: 100 }
      }
    });
    createdSprints.push(sprint);
  }

  // Create tasks
  const taskTitles = [
    'Finalize breakpoints',
    'Setup routing',
    'Create API endpoints',
    'Rate limiting middleware',
    'Database schema',
    'Authentication flow',
    'Component library setup',
    'Design tokens definition',
    'Mobile wireframes',
    'User testing sessions',
    'Performance optimization',
    'Security audit'
  ];

  const statuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  for (let i = 0; i < taskTitles.length; i++) {
    const project = createdProjects[i % createdProjects.length];
    const assignee = createdUsers[i % createdUsers.length];
    const status = statuses[i % statuses.length];
    const priority = priorities[i % priorities.length];
    const daysFromNow = Math.floor(Math.random() * 30);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysFromNow);

    await prisma.task.create({
      data: {
        title: taskTitles[i],
        description: `Task for ${project.name}. This needs to be completed as part of the sprint.`,
        status: status as any,
        priority: priority as any,
        teamId: team.id,
        projectId: project.id,
        assigneeId: assignee.id,
        createdById: admin.id,
        dueDate: status === 'DONE' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : dueDate,
        labels: [priority === 'CRITICAL' ? 'urgent' : 'backlog'],
        boardColumn: status === 'TODO' ? 'To Do' : status === 'IN_PROGRESS' ? 'In Progress' : status === 'REVIEW' ? 'In Review' : 'Done',
        subtasks: ['[ ] Subtask 1', '[ ] Subtask 2'],
        comments: [`Created by ${admin.name}`, 'Work in progress']
      }
    });
  }

  // Create team activities
  const activities = [
    { user: admin, action: 'created project', details: 'Dashboard Redesign' },
    { user: createdUsers[1], action: 'completed task', details: 'Finalize breakpoints' },
    { user: createdUsers[2], action: 'updated progress', details: '72%' },
    { user: createdUsers[3], action: 'joined the workspace', details: 'Design System v2' },
    { user: createdUsers[4], action: 'created task', details: 'Mobile Prototype' },
    { user: createdUsers[5], action: 'moved task', details: 'In Review' }
  ];

  for (const activity of activities) {
    await prisma.teamActivity.create({
      data: {
        teamId: team.id,
        userId: activity.user.id,
        action: activity.action,
        category: 'task',
        details: { description: activity.details }
      }
    });
  }

  // Create notifications
  for (let i = 0; i < 6; i++) {
    const user = createdUsers[i % createdUsers.length];
    await prisma.notification.create({
      data: {
        userId: user.id,
        teamId: team.id,
        title: ['Mention', 'Assignment', 'Deadline', 'Invitation', 'Comment', 'Update'][i],
        message: [
          'You were mentioned in Dashboard Redesign',
          'You were assigned to Rate limiting middleware',
          'API Gateway Migration is due tomorrow',
          'You were invited to Marketing workspace',
          'Sarah commented on Design System v2',
          'Sprint 47 progress is at 65%'
        ][i],
        state: i < 2 ? 'UNREAD' : 'READ',
        meta: { type: ['mention', 'assign', 'deadline', 'invite', 'comment', 'update'][i] }
      }
    });
  }

  console.log('✅ Seed data planted successfully!');
  console.log(`Created: ${createdUsers.length} users, ${createdProjects.length} projects, ${taskTitles.length} tasks, ${createdSprints.length} sprints`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
