import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class GetJadwalSidangPublicUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(params?: {
    page?: number;
    limit?: number;
    jenisSidang?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (params?.jenisSidang) {
      whereClause.jenisSidang = params.jenisSidang;
    }

    if (params?.status) {
      whereClause.status = params.status;
    }

    if (params?.startDate || params?.endDate) {
      whereClause.tanggal = {};
      if (params?.startDate) {
        whereClause.tanggal.gte = params.startDate;
      }
      if (params?.endDate) {
        whereClause.tanggal.lte = params.endDate;
      }
    }

    const jadwal = await this.prisma.jadwalSidang.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        mahasiswa: {
          select: { id: true, nim: true, nama: true },
        },
        ruangan: {
          select: { id: true, nama: true, kapasitas: true },
        },
        penguji1: {
          select: { id: true, nama: true, nidn: true },
        },
        penguji2: {
          select: { id: true, nama: true, nidn: true },
        },
        penguji3: {
          select: { id: true, nama: true, nidn: true },
        },
      },
      orderBy: {
        tanggal: 'asc',
      },
    });

    const total = await this.prisma.jadwalSidang.count({ where: whereClause });

    return {
      data: jadwal,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
