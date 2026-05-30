import prisma from '../prisma/client';

export async function getTeamAnalytics(teamId: string) {
  const analytics = await prisma.teamAnalytics.findUnique({ where: { teamId } });
  if (analytics) return analytics;

  const summary = await prisma.teamActivity.findMany({
    where: { teamId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return {
    teamId,
    completedTasks: 0,
    productivityPct: 0,
    sprintVelocity: 0,
    activeMembers: 0,
    weeklyPerformance: {},
    workloadSummary: {},
    recentActivity: summary
  } as any;
}
