import prisma from '../prisma/client';
import { createNotification } from '../services/notification.service';
import { logActivity } from '../services/activity.service';

export function registerBackgroundJobs() {
  setInterval(async () => {
    try {
      const dueTasks = await prisma.task.findMany({
        where: { dueDate: { gte: new Date(), lte: new Date(Date.now() + 24 * 60 * 60 * 1000) } },
        include: { assignee: true, team: true }
      });

      for (const task of dueTasks) {
        if (task.assigneeId) {
          await createNotification(task.assigneeId, task.teamId, 'Task deadline approaching', `Task ${task.title} is due soon.`, { taskId: task.id });
        }
      }

      console.info(`Background reminder job executed. ${dueTasks.length} due tasks processed.`);
    } catch (error) {
      console.error('Background reminders failed', error);
    }
  }, 1000 * 60 * 30);

  setInterval(async () => {
    try {
      const oldNotifications = await prisma.notification.findMany({ where: { state: 'ARCHIVED' } });
      await prisma.notification.deleteMany({ where: { id: { in: oldNotifications.map((notification: { id: string }) => notification.id) } } });
    } catch (error) {
      console.error('Notification cleanup failed', error);
    }
  }, 1000 * 60 * 60 * 24);
}
