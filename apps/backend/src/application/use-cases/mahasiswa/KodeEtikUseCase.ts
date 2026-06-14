import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class KodeEtikUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(mahasiswaId: string) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    if (mahasiswa.kodeEtikSigned) {
      throw new ApiError(400, 'Kode etik sudah ditandatangani sebelumnya');
    }

    const updated = await this.prisma.mahasiswa.update({
      where: { id: mahasiswaId },
      data: { kodeEtikSigned: true },
    });

    return {
      mahasiswaId: updated.id,
      kodeEtikSigned: updated.kodeEtikSigned,
      signedAt: new Date().toISOString(),
    };
  }
}