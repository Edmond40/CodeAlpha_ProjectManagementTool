import { Request, Response, NextFunction } from 'express';
import { uploadImage, uploadAttachment } from '../services/upload.service';

export async function uploadLogo(req: Request, res: Response, next: NextFunction) {
  try {
    const url = await uploadImage(req.body.image, 'team-logos');
    res.status(201).json({ success: true, url });
  } catch (error) {
    next(error);
  }
}

export async function uploadAttachmentFile(req: Request, res: Response, next: NextFunction) {
  try {
    const url = await uploadAttachment(req.body.file, 'attachments');
    res.status(201).json({ success: true, url });
  } catch (error) {
    next(error);
  }
}
