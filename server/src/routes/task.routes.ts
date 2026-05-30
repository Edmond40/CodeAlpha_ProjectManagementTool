import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createTask, getTeamTasks, updateTask } from '../controllers/task.controller';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';

export const taskRouter = Router();

taskRouter.use(authenticate);
taskRouter.post('/', validate(createTaskSchema), createTask);
taskRouter.get('/team/:teamId', getTeamTasks);
taskRouter.put('/:id', validate(updateTaskSchema), updateTask);
