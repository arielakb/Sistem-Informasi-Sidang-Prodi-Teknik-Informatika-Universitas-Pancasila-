import { PrismaClient, JenisSidang, StatusJadwal } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface JadwalkanSidangDTO {
  jenisSidang: JenisSidang;
  mahasiswaId: string;
  tanggal: Date;
  waktuMulai: Date;
  waktuSelesai: Date;
  ruanganId: string;
  penguji1Id?: string;
  penguji2Id?: string;
  penguji3Id?: string;
  linkMeeting?: string;
}

export class JadwalkanSidangUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: JadwalkanSidangDTO) {
    // Cek mahasiswa
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id: data.mahasiswaId },
    });

    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    // Cek ruangan tersedia
    const ruanganTersedia = await this.prisma.jadwalSidang.findFirst({
      where: {
        ruanganId: data.ruanganId,
        tanggal: data.tanggal,
        OR: [
          {
            waktuMulai: { lte: data.waktuMulai },
            waktuSelesai: { gt: data.waktuMulai },
          },
          {
            waktuMulai: { lt: data.waktuSelesai },
            waktuSelesai: { gte: data.waktuSelesai },
          },
        ],
      },
    });

    if (ruanganTersedia) {
      throw new ApiError(409, 'Ruangan sudah dibooking pada waktu tersebut');
    }

    const jadwal = await this.prisma.jadwalSidang.create({
      data: {
        jenisSidang: data.jenisSidang,
        mahasiswaId: data.mahasiswaId,
        tanggal: data.tanggal,
        waktuMulai: data.waktuMulai,
        waktuSelesai: data.waktuSelesai,
        ruanganId: data.ruanganId,
        penguji1Id: data.penguji1Id,
        penguji2Id: data.penguji2Id,
        penguji3Id: data.penguji3Id,
        linkMeeting: data.linkMeeting,
        status: StatusJadwal.DIJADWALKAN,
      },
      include: {
        mahasiswa: true,
        ruangan: true,
        penguji1: true,
      },
    });

    return jadwal;
  }
}