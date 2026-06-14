import { PrismaClient, StatusSkripsi } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface PersetujuanKelayakanDTO {
  mahasiswaId: string;
  dosenId: string;
  jenisSidang: 'SEMINAR_PROPOSAL' | 'SIDANG_KOMPREHENSIF' | 'SIDANG_SKRIPSI';
  disetujui: boolean;
  catatan?: string;
}

export class PersetujuanKelayakanUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: PersetujuanKelayakanDTO) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
      include: { pembimbing1: true, pembimbing2: true },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    // Cek apakah dosen adalah pembimbing mahasiswa ini
    const isPembimbing = mahasiswa.pembimbing1Id === data.dosenId || mahasiswa.pembimbing2Id === data.dosenId;
    if (!isPembimbing) {
      throw new ApiError(403, 'Anda bukan pembimbing mahasiswa ini');
    }

    // Map jenis sidang ke status skripsi
    const statusMap: Record<string, StatusSkripsi> = {
      'SEMINAR_PROPOSAL': StatusSkripsi.SEMINAR_PROPOSAL,
      'SIDANG_KOMPREHENSIF': StatusSkripsi.SIDANG_KOMPREHENSIF,
      'SIDANG_SKRIPSI': StatusSkripsi.SIDANG_SKRIPSI,
    };

    if (data.disetujui) {
      await this.prisma.mahasiswa.update({
        where: { id: data.mahasiswaId },
        data: { statusSkripsi: statusMap[data.jenisSidang] },
      });
    }

    return {
      mahasiswaId: data.mahasiswaId,
      jenisSidang: data.jenisSidang,
      disetujui: data.disetujui,
      status: data.disetujui ? 'DISETUJUI' : 'DITOLAK',
      catatan: data.catatan,
    };
  }
}