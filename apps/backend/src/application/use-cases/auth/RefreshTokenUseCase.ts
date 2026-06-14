import { IUserRepository } from '../../../domain/interfaces/IRepository';
import { IAuthService } from '../../../domain/interfaces/IAuthService';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(data: RefreshTokenDTO): Promise<RefreshTokenResponse> {
    try {
      const decoded = this.authService.verifyRefreshToken(data.refreshToken);
      
      const user = await this.userRepository.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new ApiError(401, 'Token tidak valid');
      }

      const accessToken = this.authService.generateAccessToken(user);

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch {
      throw new ApiError(401, 'Token tidak valid atau sudah expired');
    }
  }
}