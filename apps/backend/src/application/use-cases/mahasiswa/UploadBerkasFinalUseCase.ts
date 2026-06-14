import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface UploadBerkasFinalDTO {
  mahasiswaId: string;
  fileNaskah: string;
  filePengesahan: string;
  fileBerkasLain?: string;
}

export class UploadBerkasFinalUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: UploadBerkasFinalDTO) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    // Cek apakah sudah ada berkas final sebelumnya
    const existing = await this.prisma.berkasFinal.findFirst({
      where: { mahasiswaId: data.mahasiswaId },
    });

    if (existing) {
      // Update existing
      const updated = await this.prisma.berkasFinal.update({
        where: { id: existing.id },
        data: {
          fileNaskah: data.fileNaskah,
          filePengesahan: data.filePengesahan,
          fileBerkasLain: data.fileBerkasLain,
          statusPembimbing: 'DIAJUKAN',
          statusKoordinator: 'DIAJUKAN',
        },
      });
      return updated;
    }

    const berkas = await this.prisma.berkasFinal.create({
      data: {
        mahasiswaId: data.mahasiswaId,
        fileNaskah: data.fileNaskah,
        filePengesahan: data.filePengesahan,
        fileBerkasLain: data.fileBerkasLain,
      },
    });

    return berkas;
  }
}