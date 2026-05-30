import prisma from '../prisma/client';

export async function createNotification(userId: string, teamId: string, title: string, message: string, meta?: any) {
  return prisma.notification.create({
    data: {
      userId,
      teamId,
      title,
      message,
      meta,
      state: 'UNREAD'
    }
  });
}

export async function getNotifications(userId: string, teamId: string) {
  return prisma.notification.findMany({
    where: { userId, teamId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateNotificationState(notificationId: string, state: string) {
  return prisma.notification.update({ where: { id: notificationId }, data: { state: state as any } });
}
