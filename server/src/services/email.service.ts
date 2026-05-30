import { sendEmail } from '../utils/mailer';

export async function sendInviteEmail(email: string, teamName: string, inviteUrl: string) {
  const subject = `You're invited to join ${teamName} on Planora`;
  const html = `<p>Hello,</p><p>You have been invited to join <strong>${teamName}</strong> on Planora.</p><p><a href="${inviteUrl}">Accept invitation</a></p>`;
  await sendEmail({ to: email, subject, html, text: `Accept the invitation at ${inviteUrl}` });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const subject = 'Welcome to Planora';
  const html = `<p>Hi ${name},</p><p>Welcome to Planora. Your team workspace is ready.</p>`;
  await sendEmail({ to: email, subject, html, text: `Welcome to Planora, ${name}.` });
}
