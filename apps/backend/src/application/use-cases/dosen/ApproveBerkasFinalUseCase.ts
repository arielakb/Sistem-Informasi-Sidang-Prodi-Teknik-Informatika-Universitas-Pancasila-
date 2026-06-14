import { PrismaClient, StatusBerkas } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface ApproveBerkasFinalDTO {
  berkasFinalId: string;
  dosenId: string;
  status: StatusBerkas;
  catatan?: string;
}

export class ApproveBerkasFinalUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: ApproveBerkasFinalDTO) {
    const berkas = await this.prisma.berkasFinal.findUnique({
      where: { id: data.berkasFinalId },
      include: { mahasiswa: true },
    });

    if (!berkas) {
      throw new ApiError(404, 'Berkas final tidak ditemukan');
    }

    // Cek apakah dosen adalah pembimbing
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: berkas.mahasiswaId },
    });

    if (!mahasiswa || (mahasiswa.pembimbing1Id !== data.dosenId && mahasiswa.pembimbing2Id !== data.dosenId)) {
      throw new ApiError(403, 'Anda bukan pembimbing mahasiswa ini');
    }

    const updated = await this.prisma.berkasFinal.update({
      where: { id: data.berkasFinalId },
      data: {
        statusPembimbing: data.status,
      },
    });

    return updated;
  }
}