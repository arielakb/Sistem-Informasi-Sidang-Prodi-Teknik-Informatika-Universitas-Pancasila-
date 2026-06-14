import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '../../../application/use-cases/auth/RegisterUseCase';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/RefreshTokenUseCase';

export class AuthController extends BaseController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase
  ) {
    super();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const { email, password } = req.body;
      return this.loginUseCase.execute({ email, password });
    });
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.registerUseCase.execute(req.body);
    });
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const { refreshToken } = req.body;
      return this.refreshTokenUseCase.execute({ refreshToken });
    });
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return {
        id: this.getUserId(req),
        role: this.getUserRole(req),
      };
    });
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      // Stateless JWT: client hanya perlu hapus token di sisi client
      // Nanti bisa tambah blacklist/redis untuk invalidasi token
      return { message: 'Logout berhasil. Hapus token di sisi client.' };
    });
  };
}