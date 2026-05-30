import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    teamId: z.string().uuid(),
    name: z.string().min(2),
    description: z.string().optional(),
    color: z.string().optional(),
    dueDate: z.string().datetime().optional()
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    archived: z.boolean().optional()
  })
});
