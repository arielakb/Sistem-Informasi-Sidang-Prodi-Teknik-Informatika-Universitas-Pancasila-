import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../../domain/interfaces/IAuthService';
import { env } from '../../infrastructure/config/env';

export class AuthService implements IAuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(user: any): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: env.JWT_ACCESS_EXPIRATION as jwt.SignOptions['expiresIn'] }
    );
  }

  generateRefreshToken(user: any): string {
    return jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET as jwt.Secret,
      { expiresIn: env.JWT_REFRESH_EXPIRATION as jwt.SignOptions['expiresIn'] }
    );
  }

  verifyAccessToken(token: string): any {
    return jwt.verify(token, env.JWT_SECRET as jwt.Secret);
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, env.JWT_REFRESH_SECRET as jwt.Secret);
  }
}