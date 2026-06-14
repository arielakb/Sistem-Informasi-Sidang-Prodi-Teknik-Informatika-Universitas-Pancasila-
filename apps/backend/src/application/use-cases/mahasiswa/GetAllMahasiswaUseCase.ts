import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class GetAllMahasiswaUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(params?: { page?: number; limit?: number; statusSkripsi?: string; prodiId?: string }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (params?.statusSkripsi) {
      whereClause.statusSkripsi = params.statusSkripsi;
    }
    if (params?.prodiId) {
      whereClause.prodiId = params.prodiId;
    }

    const mahasiswa = await this.prisma.mahasiswa.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        user: {
          select: { email: true, isActive: true },
        },
        prodi: true,
        pembimbing1: {
          select: { id: true, nama: true, nidn: true },
        },
        pembimbing2: {
          select: { id: true, nama: true, nidn: true },
        },
      },
    });

    const total = await this.prisma.mahasiswa.count({ where: whereClause });

    return {
      data: mahasiswa,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
