export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  generateAccessToken(user: any): string;
  generateRefreshToken(user: any): string;
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
}