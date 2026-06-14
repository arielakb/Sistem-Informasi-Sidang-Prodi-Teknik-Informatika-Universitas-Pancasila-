import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class GetDaftarMahasiswaBimbinganUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: { dosenId: string; params?: { page?: number; limit?: number } }) {
    const page = data.params?.page || 1;
    const limit = data.params?.limit || 10;
    const skip = (page - 1) * limit;

    // Cek dosen
    const dosen = await this.prisma.dosen.findUnique({
      where: { id: data.dosenId },
    });

    if (!dosen) {
      throw new ApiError(404, 'Dosen tidak ditemukan');
    }

    // Get mahasiswa bimbingan
    const mahasiswa = await this.prisma.mahasiswa.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          { pembimbing1Id: data.dosenId },
          { pembimbing2Id: data.dosenId },
        ],
      },
      include: {
        user: { select: { email: true } },
        prodi: true,
        logbooks: {
          orderBy: { tanggal: 'desc' },
          take: 3,
        },
      },
    });

    const total = await this.prisma.mahasiswa.count({
      where: {
        OR: [
          { pembimbing1Id: data.dosenId },
          { pembimbing2Id: data.dosenId },
        ],
      },
    });

    return {
      data: mahasiswa,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
