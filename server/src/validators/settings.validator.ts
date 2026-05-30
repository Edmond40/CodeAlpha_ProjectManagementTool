import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    workflowConfig: z.record(z.any()).optional(),
    sprintConfig: z.record(z.any()).optional(),
    notificationConfig: z.record(z.any()).optional(),
    permissionConfig: z.record(z.any()).optional(),
    productivityConfig: z.record(z.any()).optional()
  }),
  params: z.object({ id: z.string().uuid() })
});
