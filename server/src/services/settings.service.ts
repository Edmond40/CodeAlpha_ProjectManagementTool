import prisma from '../prisma/client';
import { ApiError } from '../utils/errors';

export async function getTeamSettings(teamId: string) {
  const settings = await prisma.teamSettings.findUnique({ where: { teamId } });
  if (!settings) {
    throw new ApiError(404, 'Team settings not found');
  }
  return settings;
}

export async function updateTeamSettings(teamId: string, payload: any) {
  return prisma.teamSettings.upsert({
    where: { teamId },
    create: {
      teamId,
      workflowConfig: payload.workflowConfig || {},
      sprintConfig: payload.sprintConfig || {},
      notificationConfig: payload.notificationConfig || {},
      permissionConfig: payload.permissionConfig || {},
      productivityConfig: payload.productivityConfig || {}
    },
    update: {
      workflowConfig: payload.workflowConfig || undefined,
      sprintConfig: payload.sprintConfig || undefined,
      notificationConfig: payload.notificationConfig || undefined,
      permissionConfig: payload.permissionConfig || undefined,
      productivityConfig: payload.productivityConfig || undefined
    }
  });
}

export async function copyTeamSettings(sourceTeamId: string, targetTeamId: string) {
  const source = await prisma.teamSettings.findUnique({ where: { teamId: sourceTeamId } });
  if (!source) {
    throw new ApiError(404, 'Source team settings not found');
  }

  return prisma.teamSettings.upsert({
    where: { teamId: targetTeamId },
    create: {
      teamId: targetTeamId,
      workflowConfig: source.workflowConfig,
      sprintConfig: source.sprintConfig,
      notificationConfig: source.notificationConfig,
      permissionConfig: source.permissionConfig,
      productivityConfig: source.productivityConfig
    },
    update: {
      workflowConfig: source.workflowConfig,
      sprintConfig: source.sprintConfig,
      notificationConfig: source.notificationConfig,
      permissionConfig: source.permissionConfig,
      productivityConfig: source.productivityConfig
    }
  });
}
