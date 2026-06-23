import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface GetSkripsiProgressDTO {
  mahasiswaId: string;
}

export class GetSkripsiProgressUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(mahasiswaId: string) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: {
        logbooks: {
          where: { status: 'DIVALIDASI' },
        },
        jadwalSidang: {
          include: { penilaian: true },
        },
        berkasSidang: true,
        berkasFinal: true,
      },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    const progress = {
      statusSkripsi: mahasiswa.statusSkripsi,
      pengajuanTopik: {
        status: mahasiswa.judulSkripsi ? 'completed' : 'pending',
        date: mahasiswa.updatedAt,
      },
      bimbingan: {
        status: mahasiswa.logbooks.length > 0 ? 'in-progress' : 'pending',
        totalSesi: mahasiswa.logbooks.length,
        sesiDisetujui: mahasiswa.logbooks.filter(l => l.status === 'DIVALIDASI').length,
      },
      semiProp: this.getStatusByJenisSidang(mahasiswa.jadwalSidang, 'SEMINAR_PROPOSAL'),
      komprehensif: this.getStatusByJenisSidang(mahasiswa.jadwalSidang, 'SIDANG_KOMPREHENSIF'),
      skripsi: this.getStatusByJenisSidang(mahasiswa.jadwalSidang, 'SIDANG_SKRIPSI'),
      berkas: {
        sidang: mahasiswa.berkasSidang.length,
        final: mahasiswa.berkasFinal.length,
      },
    };

    return progress;
  }

  private getStatusByJenisSidang(jadwal: any[], jenis: string) {
    const jadwalItem = jadwal.find(j => j.jenisSidang === jenis);

    if (!jadwalItem) {
      return { status: 'pending' };
    }

    if (jadwalItem.status === 'SELESAI') {
      const nilai = jadwalItem.penilaian[0]?.totalNilai;
      return {
        status: 'completed',
        date: jadwalItem.tanggal,
        nilai,
      };
    }

    return {
      status: 'scheduled',
      date: jadwalItem.tanggal,
    };
  }
}
