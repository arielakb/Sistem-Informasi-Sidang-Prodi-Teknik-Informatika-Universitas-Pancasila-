import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface ValidasiLogbookDTO {
  logbookId: string;
  dosenId: string;
  status: 'DIVALIDASI' | 'DITOLAK';
  catatan?: string;
}

export class ValidasiLogbookUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: ValidasiLogbookDTO) {
    const logbook = await this.prisma.logbook.findUnique({
      where: { id: data.logbookId },
      include: { mahasiswa: true, dosen: true },
    });

    if (!logbook) {
      throw new ApiError(404, 'Logbook tidak ditemukan');
    }

    if (logbook.dosenId !== data.dosenId) {
      throw new ApiError(403, 'Anda bukan pembimbing logbook ini');
    }

    const updated = await this.prisma.logbook.update({
      where: { id: data.logbookId },
      data: {
        status: data.status,
        catatanDosen: data.catatan || null,
      },
    });

    return updated;
  }
}