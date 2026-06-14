import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface UploadBerkasSidangDTO {
  mahasiswaId: string;
  jadwalSidangId?: string;
  jenisBerkas: string;
  filePath: string;
}

export class UploadBerkasSidangUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: UploadBerkasSidangDTO) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    const berkas = await this.prisma.berkasSidang.create({
      data: {
        mahasiswaId: data.mahasiswaId,
        jadwalSidangId: data.jadwalSidangId,
        jenisBerkas: data.jenisBerkas,
        filePath: data.filePath,
        status: 'DIAJUKAN',
      },
    });

    return berkas;
  }
}