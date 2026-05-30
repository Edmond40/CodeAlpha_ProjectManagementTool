import prisma from '../prisma/client';
import { ApiError } from '../utils/errors';

export async function createTask(payload: any, userId: string) {
  const team = await prisma.team.findUnique({ where: { id: payload.teamId } });
  if (!team) {
    throw new ApiError(404, 'Team not found');
  }

  return prisma.task.create({
    data: {
      teamId: payload.teamId,
      projectId: payload.projectId,
      title: payload.title,
      description: payload.description,
      status: payload.status || 'TODO',
      priority: payload.priority || 'MEDIUM',
      labels: payload.labels || [],
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      assigneeId: payload.assigneeId,
      attachments: payload.attachments || [],
      subtasks: payload.subtasks || [],
      comments: payload.comments || [],
      boardColumn: payload.boardColumn,
      createdById: userId
    }
  });
}

export async function getTasksByTeam(teamId: string) {
  return prisma.task.findMany({ where: { teamId }, orderBy: { createdAt: 'desc' } });
}

export async function updateTask(taskId: string, payload: any) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      labels: payload.labels,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      assigneeId: payload.assigneeId,
      attachments: payload.attachments,
      subtasks: payload.subtasks,
      comments: payload.comments,
      boardColumn: payload.boardColumn
    }
  });
}
