import { v4 as uuidv4 } from 'uuid';
import prisma from '../prisma/client';
import { ApiError } from '../utils/errors';

export async function createTeam(userId: string, payload: any) {
  const existing = await prisma.team.findUnique({ where: { identifier: payload.identifier } });
  if (existing) {
    throw new ApiError(400, 'Team identifier already in use');
  }

  const team = await prisma.team.create({
    data: {
      name: payload.name,
      identifier: payload.identifier,
      description: payload.description,
      visibility: payload.visibility || 'PRIVATE',
      timezone: payload.timezone || 'UTC',
      colorTheme: payload.colorTheme || 'INDIGO',
      logo: payload.logo,
      createdById: userId,
      members: {
        create: {
          userId,
          role: 'ADMIN',
          userEmail: payload.userEmail || ''
        }
      },
      settings: {
        create: {
          workflowConfig: {},
          sprintConfig: {},
          notificationConfig: {},
          permissionConfig: {},
          productivityConfig: {}
        }
      },
      analytics: {
        create: {
          completedTasks: 0,
          productivityPct: 0,
          sprintVelocity: 0,
          activeMembers: 1,
          weeklyPerformance: {},
          workloadSummary: {}
        }
      }
    }
  });

  await prisma.teamActivity.create({
    data: {
      teamId: team.id,
      userId,
      action: 'TEAM_CREATED',
      category: 'team',
      details: { name: team.name }
    }
  });

  return team;
}

export async function getUserTeams(userId: string) {
  return prisma.teamMember.findMany({
    where: { userId, isActive: true },
    include: { team: true }
  });
}

export async function getTeamById(teamId: string) {
  return prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true, settings: true, analytics: true }
  });
}

export async function updateTeam(teamId: string, payload: any) {
  return prisma.team.update({
    where: { id: teamId },
    data: {
      name: payload.name,
      identifier: payload.identifier,
      description: payload.description,
      visibility: payload.visibility,
      timezone: payload.timezone,
      colorTheme: payload.colorTheme,
      logo: payload.logo
    }
  });
}

export async function deleteTeam(teamId: string) {
  return prisma.team.update({ where: { id: teamId }, data: { visibility: 'PRIVATE' } });
}

export async function inviteMember(teamId: string, inviterId: string, email: string, role: string) {
  const token = uuidv4();
  const invitation = await prisma.teamInvitation.create({
    data: {
      teamId,
      invitedById: inviterId,
      email,
      token,
      role: (role || 'MEMBER') as any
    }
  });

  await prisma.teamActivity.create({
    data: {
      teamId,
      userId: inviterId,
      action: 'MEMBER_INVITED',
      category: 'member',
      details: { email, role }
    }
  });

  return invitation;
}

export async function listTeamMembers(teamId: string) {
  return prisma.teamMember.findMany({ where: { teamId }, include: { user: true } });
}

export async function updateTeamMemberRole(teamId: string, memberId: string, role: string) {
  return prisma.teamMember.update({ where: { id: memberId }, data: { role: role as any } });
}
