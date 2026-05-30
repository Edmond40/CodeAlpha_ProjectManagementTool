import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createTeam, getTeams, getTeam, updateTeam, deleteTeam, inviteMember, listMembers, updateMember } from '../controllers/team.controller';
import { createTeamSchema, updateTeamSchema } from '../validators/team.validator';
import { inviteMemberSchema } from '../validators/invitation.validator';

const updateMemberSchema = z.object({
  params: z.object({ id: z.string().uuid(), memberId: z.string().uuid() }),
  body: z.object({ role: z.enum(['ADMIN', 'MANAGER', 'MEMBER']) })
});

export const teamRouter = Router();

teamRouter.use(authenticate);
teamRouter.post('/', validate(createTeamSchema), createTeam);
teamRouter.get('/', getTeams);
teamRouter.get('/:id', getTeam);
teamRouter.put('/:id', validate(updateTeamSchema), updateTeam);
teamRouter.delete('/:id', deleteTeam);
teamRouter.post('/:id/invite', validate(inviteMemberSchema), inviteMember);
teamRouter.get('/:id/members', listMembers);
teamRouter.put('/:id/members/:memberId', validate(updateMemberSchema), updateMember);
