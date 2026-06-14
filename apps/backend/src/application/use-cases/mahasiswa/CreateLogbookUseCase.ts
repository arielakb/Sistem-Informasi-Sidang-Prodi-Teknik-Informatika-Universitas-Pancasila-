import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface CreateLogbookDTO {
  mahasiswaId: string;
  dosenId: string;
  tanggal: Date;
  topikBahasan: string;
  hasilBimbingan?: string;
  fileBukti?: string;
}

export class CreateLogbookUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: CreateLogbookDTO) {
    // Cek apakah dosen adalah pembimbing mahasiswa
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    if (mahasiswa.pembimbing1Id !== data.dosenId && mahasiswa.pembimbing2Id !== data.dosenId) {
      throw new ApiError(403, 'Dosen bukan pembimbing mahasiswa ini');
    }

    const logbook = await this.prisma.logbook.create({
      data: {
        mahasiswaId: data.mahasiswaId,
        dosenId: data.dosenId,
        tanggal: data.tanggal,
        topikBahasan: data.topikBahasan,
        hasilBimbingan: data.hasilBimbingan,
        fileBukti: data.fileBukti,
        status: 'MENUNGGU',
      },
    });

    return logbook;
  }
}