import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    teamId: z.string().uuid(),
    projectId: z.string().uuid().optional(),
    title: z.string().min(2),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    labels: z.array(z.string()).optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().uuid().optional(),
    boardColumn: z.string().optional(),
    attachments: z.array(z.any()).optional(),
    subtasks: z.array(z.any()).optional(),
    comments: z.array(z.any()).optional()
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    labels: z.array(z.string()).optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().uuid().optional(),
    boardColumn: z.string().optional(),
    attachments: z.array(z.any()).optional(),
    subtasks: z.array(z.any()).optional(),
    comments: z.array(z.any()).optional()
  }),
  params: z.object({ id: z.string().uuid() })
});
