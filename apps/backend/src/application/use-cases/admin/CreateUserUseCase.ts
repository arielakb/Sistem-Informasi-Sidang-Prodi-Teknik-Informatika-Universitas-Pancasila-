import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';
import { AuthService } from '../../services/AuthService';

export interface CreateUserDTO {
  email: string;
  password: string;
  nama: string;
  role: string;
  nim?: string;
  nidn?: string;
  prodiId?: string;
  jabatan?: string;
}

export class CreateUserUseCase {
  private authService: AuthService;

  constructor(private prisma: PrismaClient) {
    this.authService = new AuthService();
  }

  async execute(data: CreateUserDTO) {
    // Cek email sudah ada
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ApiError(409, 'Email sudah terdaftar');
    }

    const passwordHash = await this.authService.hashPassword(data.password);

    const userData: any = {
      email: data.email,
      passwordHash,
      role: data.role as any,
    };

    // Tambahkan profile sesuai role
    if (data.role === 'MAHASISWA' && data.nim) {
      userData.mahasiswa = {
        create: {
          nim: data.nim,
          nama: data.nama,
          prodiId: data.prodiId || '',
          angkatan: new Date().getFullYear(),
        },
      };
    } else if (['DOSEN_PEMBIMBING', 'DOSEN_PENGUJI', 'DOSEN_REGULER', 'KAPRODI'].includes(data.role) && data.nidn) {
      userData.dosen = {
        create: {
          nidn: data.nidn,
          nama: data.nama,
          prodiId: data.prodiId || '',
          jabatan: data.jabatan,
          isPembimbing: data.role === 'DOSEN_PEMBIMBING' || data.role === 'KAPRODI',
          isPenguji: data.role === 'DOSEN_PENGUJI' || data.role === 'KAPRODI',
          isKoordinator: data.role === 'KAPRODI',
        },
      };
    } else {
      userData.adminProfile = {
        create: { nama: data.nama },
      };
    }

    const user = await this.prisma.user.create({
      data: userData,
      include: {
        mahasiswa: true,
        dosen: true,
        adminProfile: true,
      },
    });

    return user;
  }
}