import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface PenugasanPembimbingDTO {
  mahasiswaId: string;
  pembimbing1Id: string;
  pembimbing2Id?: string;
}

export class PenugasanPembimbingUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: PenugasanPembimbingDTO) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    // Cek apakah dosen yang ditugaskan valid dan adalah pembimbing
    const pembimbing1 = await this.prisma.dosen.findUnique({
      where: { id: data.pembimbing1Id },
    });

    if (!pembimbing1 || !pembimbing1.isPembimbing) {
      throw new ApiError(400, 'Dosen pembimbing 1 tidak valid');
    }

    if (data.pembimbing2Id) {
      const pembimbing2 = await this.prisma.dosen.findUnique({
        where: { id: data.pembimbing2Id },
      });

      if (!pembimbing2 || !pembimbing2.isPembimbing) {
        throw new ApiError(400, 'Dosen pembimbing 2 tidak valid');
      }
    }

    const updated = await this.prisma.mahasiswa.update({
      where: { id: data.mahasiswaId },
      data: {
        pembimbing1Id: data.pembimbing1Id,
        pembimbing2Id: data.pembimbing2Id || null,
      },
      include: {
        pembimbing1: true,
        pembimbing2: true,
      },
    });

    return updated;
  }
}