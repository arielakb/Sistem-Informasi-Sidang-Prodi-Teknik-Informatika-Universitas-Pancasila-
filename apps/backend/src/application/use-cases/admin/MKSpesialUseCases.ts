import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class MKSpesialUseCases {
  constructor(private prisma: PrismaClient) {}

  async list(): Promise<any[]> {
    return this.prisma.mKSpesial.findMany({
      include: { mahasiswa: { select: { id: true, nama: true, nim: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { mahasiswaId: string; alasan: string }) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({ where: { id: data.mahasiswaId } });
    if (!mahasiswa) throw new ApiError(404, 'Mahasiswa tidak ditemukan');

    const record = await this.prisma.mKSpesial.create({
      data: {
        mahasiswaId: data.mahasiswaId,
        alasan: data.alasan,
        status: 'PENDING',
      },
    });

    return record;
  }
}
