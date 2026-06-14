import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class CreateJadwalSidangUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: {
    jenisSidang: string;
    mahasiswaId: string;
    tanggal: Date;
    waktuMulai: Date;
    waktuSelesai: Date;
    ruanganId: string;
    penguji1Id?: string;
    penguji2Id?: string;
    penguji3Id?: string;
    linkMeeting?: string;
  }) {
    // Validasi mahasiswa
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    // Validasi ruangan
    const ruangan = await this.prisma.ruangan.findUnique({
      where: { id: data.ruanganId },
    });

    if (!ruangan) {
      throw new ApiError(404, 'Ruangan tidak ditemukan');
    }

    // Validasi penguji jika ada
    const pengujiIds = [data.penguji1Id, data.penguji2Id, data.penguji3Id].filter(Boolean) as string[];
    if (pengujiIds.length > 0) {
      const penguji = await this.prisma.dosen.findMany({
        where: { id: { in: pengujiIds } },
      });

      if (penguji.length !== pengujiIds.length) {
        throw new ApiError(400, 'Beberapa penguji tidak ditemukan');
      }
    }

    // Create jadwal
    const jadwal = await this.prisma.jadwalSidang.create({
      data: {
        jenisSidang: data.jenisSidang as any,
        mahasiswaId: data.mahasiswaId,
        tanggal: data.tanggal,
        waktuMulai: data.waktuMulai,
        waktuSelesai: data.waktuSelesai,
        ruanganId: data.ruanganId,
        penguji1Id: data.penguji1Id,
        penguji2Id: data.penguji2Id,
        penguji3Id: data.penguji3Id,
        linkMeeting: data.linkMeeting,
      },
      include: {
        mahasiswa: { select: { nim: true, nama: true } },
        ruangan: true,
        penguji1: { select: { id: true, nama: true, nidn: true } },
        penguji2: { select: { id: true, nama: true, nidn: true } },
        penguji3: { select: { id: true, nama: true, nidn: true } },
      },
    });

    // Update status mahasiswa ke SEMINAR_PROPOSAL jika jenis sidang adalah SEMINAR_PROPOSAL
    if (data.jenisSidang === 'SEMINAR_PROPOSAL') {
      await this.prisma.mahasiswa.update({
        where: { id: data.mahasiswaId },
        data: { statusSkripsi: 'SEMINAR_PROPOSAL' as any },
      });
    }

    return jadwal;
  }
}
