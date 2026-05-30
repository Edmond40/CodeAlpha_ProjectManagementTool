import { z } from 'zod';

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    identifier: z.string().min(2),
    description: z.string().optional(),
    visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
    timezone: z.string().optional(),
    colorTheme: z.enum(['INDIGO', 'VIOLET', 'BLUE', 'EMERALD', 'ROSE']).optional(),
    logo: z.string().optional()
  })
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    identifier: z.string().optional(),
    description: z.string().optional(),
    visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
    timezone: z.string().optional(),
    colorTheme: z.enum(['INDIGO', 'VIOLET', 'BLUE', 'EMERALD', 'ROSE']).optional(),
    logo: z.string().optional()
  }),
  params: z.object({ id: z.string().uuid() })
});
