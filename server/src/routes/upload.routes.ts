import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadLogo, uploadAttachmentFile } from '../controllers/upload.controller';

export const uploadRouter = Router();
uploadRouter.use(authenticate);
uploadRouter.post('/logo', uploadLogo);
uploadRouter.post('/attachment', uploadAttachmentFile);
