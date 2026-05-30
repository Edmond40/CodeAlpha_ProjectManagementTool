import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { updateSettingsSchema } from '../validators/settings.validator';

export const settingsRouter = Router();
settingsRouter.use(authenticate);
settingsRouter.get('/:id/settings', getSettings);
settingsRouter.put('/:id/settings', validate(updateSettingsSchema), updateSettings);
