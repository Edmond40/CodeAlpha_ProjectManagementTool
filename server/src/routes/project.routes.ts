import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createProject, getTeamProjects, updateProject } from '../controllers/project.controller';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

export const projectRouter = Router();
projectRouter.use(authenticate);
projectRouter.post('/', validate(createProjectSchema), createProject);
projectRouter.get('/team/:teamId', getTeamProjects);
projectRouter.put('/:id', validate(updateProjectSchema), updateProject);
