import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class GetJadwalSidangUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(mahasiswaId: string) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    const jadwal = await this.prisma.jadwalSidang.findMany({
      where: { mahasiswaId },
      include: {
        ruangan: true,
        penguji1: true,
        penilaian: true,
      },
      orderBy: { tanggal: 'desc' },
    });

    return jadwal;
  }
}