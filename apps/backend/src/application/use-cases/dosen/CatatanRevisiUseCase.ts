import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface CatatanRevisiDTO {
  mahasiswaId: string;
  dosenId: string;
  jadwalSidangId: string;
  catatan: string;
  fileRevisi?: string;
}

export class CatatanRevisiUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: CatatanRevisiDTO) {
    const jadwal = await this.prisma.jadwalSidang.findUnique({
      where: { id: data.jadwalSidangId },
      include: { mahasiswa: true },
    });

    if (!jadwal) {
      throw new ApiError(404, 'Jadwal sidang tidak ditemukan');
    }

    // Update status mahasiswa ke REVISI
    await this.prisma.mahasiswa.update({
      where: { id: data.mahasiswaId },
      data: { statusSkripsi: 'REVISI' as any },
    });

    // Cek apakah penilaian sudah ada
    const existingPenilaian = await this.prisma.penilaian.findFirst({
      where: {
        jadwalSidangId: data.jadwalSidangId,
        dosenId: data.dosenId,
      },
    });

    let penilaian;
    if (existingPenilaian) {
      // Update existing
      penilaian = await this.prisma.penilaian.update({
        where: { id: existingPenilaian.id },
        data: {
          catatan: data.catatan,
        },
      });
    } else {
      // Create new
      penilaian = await this.prisma.penilaian.create({
        data: {
          jadwalSidangId: data.jadwalSidangId,
          dosenId: data.dosenId,
          mahasiswaId: data.mahasiswaId,
          catatan: data.catatan,
        },
      });
    }

    return penilaian;
  }
}