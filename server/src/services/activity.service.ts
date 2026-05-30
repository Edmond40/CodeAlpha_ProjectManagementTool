import prisma from '../prisma/client';

export async function getTeamActivity(teamId: string) {
  return prisma.teamActivity.findMany({
    where: { teamId },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
}

export async function logActivity(teamId: string, userId: string, action: string, category: string, details?: any) {
  return prisma.teamActivity.create({
    data: { teamId, userId, action, category, details }
  });
}
