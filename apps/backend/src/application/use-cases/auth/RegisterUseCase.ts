import { IUserRepository } from '../../../domain/interfaces/IRepository';
import { IAuthService } from '../../../domain/interfaces/IAuthService';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface RegisterDTO {
  email: string;
  password: string;
  nama: string;
  role: string;
  nim?: string;
  nidn?: string;
  prodiId?: string;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(data: RegisterDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(409, 'Email sudah terdaftar');
    }

    const passwordHash = await this.authService.hashPassword(data.password);

    const userData: any = {
      email: data.email,
      passwordHash,
      role: data.role,
    };

    if (data.role === 'MAHASISWA' && data.nim) {
      userData.mahasiswa = {
        create: {
          nim: data.nim,
          nama: data.nama,
          prodiId: data.prodiId || '',
          angkatan: new Date().getFullYear(),
        },
      };
    } else if (data.role === 'DOSEN_PEMBIMBING' && data.nidn) {
      userData.dosen = {
        create: {
          nidn: data.nidn,
          nama: data.nama,
          prodiId: data.prodiId || '',
          isPembimbing: true,
          isPenguji: true,
        },
      };
    } else {
      userData.adminProfile = {
        create: { nama: data.nama },
      };
    }

    return this.userRepository.create(userData);
  }
}