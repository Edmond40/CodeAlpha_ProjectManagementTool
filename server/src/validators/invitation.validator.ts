import { z } from 'zod';

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['ADMIN', 'MANAGER', 'MEMBER']).optional()
  }),
  params: z.object({ id: z.string().uuid() })
});
