import prisma from '../prisma/client';
import { ApiError } from '../utils/errors';

export async function createProject(payload: any) {
  const team = await prisma.team.findUnique({ where: { id: payload.teamId } });
  if (!team) {
    throw new ApiError(404, 'Team not found');
  }

  return prisma.project.create({
    data: {
      teamId: payload.teamId,
      name: payload.name,
      description: payload.description,
      color: payload.color,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null
    }
  });
}

export async function getProjectsByTeam(teamId: string) {
  return prisma.project.findMany({ where: { teamId, archived: false }, orderBy: { createdAt: 'desc' } });
}

export async function updateProject(projectId: string, payload: any) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      name: payload.name,
      description: payload.description,
      color: payload.color,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      archived: payload.archived
    }
  });
}
