import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface CreateSkripsiDTO {
  mahasiswaId: string;
  judul: string;
  deskripsi?: string;
  pembimbing1Id?: string;
  pembimbing2Id?: string;
}

export class CreateSkripsiUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: CreateSkripsiDTO) {
    // Check if mahasiswa exists
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    // Check if mahasiswa already has skripsi topic
    if (mahasiswa.judulSkripsi) {
      throw new ApiError(400, 'Mahasiswa sudah memiliki judul skripsi');
    }

    // Update mahasiswa with skripsi data
    const updated = await this.prisma.mahasiswa.update({
      where: { id: data.mahasiswaId },
      data: {
        judulSkripsi: data.judul,
        statusSkripsi: 'BIMBINGAN',
        pembimbing1Id: data.pembimbing1Id,
        pembimbing2Id: data.pembimbing2Id,
      },
      include: {
        prodi: true,
        pembimbing1: true,
        pembimbing2: true,
      },
    });

    return updated;
  }
}
