import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface ApproveNaskahRevisiDTO {
  mahasiswaId: string;
  dosenId: string;
  fileNaskahRevisi: string;
}

export class ApproveNaskahRevisiUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: ApproveNaskahRevisiDTO) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    // Cek apakah dosen adalah pembimbing
    if (mahasiswa.pembimbing1Id !== data.dosenId && mahasiswa.pembimbing2Id !== data.dosenId) {
      throw new ApiError(403, 'Anda bukan pembimbing mahasiswa ini');
    }

    // Update status mahasiswa dari REVISI ke status sebelumnya atau BIMBINGAN
    const updated = await this.prisma.mahasiswa.update({
      where: { id: data.mahasiswaId },
      data: {
        statusSkripsi: 'BIMBINGAN' as any,
      },
    });

    return {
      mahasiswaId: updated.id,
      statusSkripsi: updated.statusSkripsi,
      naskahRevisiApproved: true,
      approvedAt: new Date().toISOString(),
    };
  }
}