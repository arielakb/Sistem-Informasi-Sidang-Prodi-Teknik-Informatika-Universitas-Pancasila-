import { IUserRepository } from '../../../domain/interfaces/IRepository';
import { IAuthService } from '../../../domain/interfaces/IAuthService';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    nama: string;
  };
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(data: LoginDTO): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ApiError(401, 'Email atau password salah');
    }

    const isValid = await this.authService.verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, 'Email atau password salah');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Akun tidak aktif');
    }

    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    let nama = 'User';
    if (user.mahasiswa) nama = user.mahasiswa.nama;
    else if (user.dosen) nama = user.dosen.nama;
    else if (user.adminProfile) nama = user.adminProfile.nama;

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nama,
      },
    };
  }
}