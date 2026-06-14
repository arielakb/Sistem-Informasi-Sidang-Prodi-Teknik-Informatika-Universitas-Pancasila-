import jwt from 'jsonwebtoken';

export class JwtService {
  generateToken(payload: any, secret: string, expiresIn: string): string {
    return jwt.sign(
      payload,
      secret as jwt.Secret,
      { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    );
  }

  verifyToken(token: string, secret: string): any {
    return jwt.verify(token, secret as jwt.Secret);
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }
}