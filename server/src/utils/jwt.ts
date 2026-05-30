import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  teamId?: string;
}

const jwtSecret: jwt.Secret = config.jwtSecret;

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, jwtSecret) as JwtPayload;
}
