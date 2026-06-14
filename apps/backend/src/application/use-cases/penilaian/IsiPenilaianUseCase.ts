import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface IsiPenilaianDTO {
  jadwalSidangId: string;
  dosenId: string;
  mahasiswaId: string;
  nilaiPresentasi?: number;
  nilaiMateri?: number;
  nilaiTeknik?: number;
  catatan?: string;
}

export class IsiPenilaianUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: IsiPenilaianDTO) {
    const jadwal = await this.prisma.jadwalSidang.findUnique({
      where: { id: data.jadwalSidangId },
    });

    if (!jadwal) {
      throw new ApiError(404, 'Jadwal sidang tidak ditemukan');
    }

    // Cek apakah dosen adalah penguji
    const isPenguji = jadwal.penguji1Id === data.dosenId || 
                      jadwal.penguji2Id === data.dosenId || 
                      jadwal.penguji3Id === data.dosenId;

    if (!isPenguji) {
      throw new ApiError(403, 'Anda bukan penguji sidang ini');
    }

    // Hitung total nilai
    const totalNilai = ((data.nilaiPresentasi || 0) + (data.nilaiMateri || 0) + (data.nilaiTeknik || 0)) / 3;

    // Cek existing penilaian
    const existing = await this.prisma.penilaian.findFirst({
      where: {
        jadwalSidangId: data.jadwalSidangId,
        dosenId: data.dosenId,
      },
    });

    let penilaian;
    if (existing) {
      penilaian = await this.prisma.penilaian.update({
        where: { id: existing.id },
        data: {
          nilaiPresentasi: data.nilaiPresentasi,
          nilaiMateri: data.nilaiMateri,
          nilaiTeknik: data.nilaiTeknik,
          catatan: data.catatan,
          totalNilai,
          isSubmitted: true,
        },
      });
    } else {
      penilaian = await this.prisma.penilaian.create({
        data: {
          jadwalSidangId: data.jadwalSidangId,
          dosenId: data.dosenId,
          mahasiswaId: data.mahasiswaId,
          nilaiPresentasi: data.nilaiPresentasi,
          nilaiMateri: data.nilaiMateri,
          nilaiTeknik: data.nilaiTeknik,
          catatan: data.catatan,
          totalNilai,
          isSubmitted: true,
        },
      });
    }

    return penilaian;
  }
}