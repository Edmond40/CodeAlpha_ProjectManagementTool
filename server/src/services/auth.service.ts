import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';
import { signToken } from '../utils/jwt';
import { ApiError } from '../utils/errors';

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(400, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });
  const token = signToken({ userId: user.id });
  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signToken({ userId: user.id });
  return { user, token };
}
