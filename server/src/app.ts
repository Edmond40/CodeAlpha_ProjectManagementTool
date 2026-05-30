import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';
import { authRouter } from './routes/auth.routes';
import { teamRouter } from './routes/team.routes';
import { projectRouter } from './routes/project.routes';
import { taskRouter } from './routes/task.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { notificationRouter } from './routes/notification.routes';
import { activityRouter } from './routes/activity.routes';
import { settingsRouter } from './routes/settings.routes';
import { uploadRouter } from './routes/upload.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max }));
app.use(morgan('dev'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/activity', activityRouter);
app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/teams', settingsRouter);

app.use(errorHandler);

export default app;
