import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface PeminjamanLabDTO {
  mahasiswaId: string;
  ruanganId: string;
  tanggalPinjam: Date;
  waktuMulai: Date;
  waktuSelesai: Date;
  keperluan: string;
}

export class PeminjamanLabUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: PeminjamanLabDTO) {
    // Cek apakah ruangan tersedia
    const existing = await this.prisma.peminjamanLab.findFirst({
      where: {
        ruanganId: data.ruanganId,
        tanggalPinjam: data.tanggalPinjam,
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

    if (existing) {
      throw new ApiError(409, 'Ruangan sudah dipinjam pada waktu tersebut');
    }

    const peminjaman = await this.prisma.peminjamanLab.create({
      data: {
        mahasiswaId: data.mahasiswaId,
        ruanganId: data.ruanganId,
        tanggalPinjam: data.tanggalPinjam,
        waktuMulai: data.waktuMulai,
        waktuSelesai: data.waktuSelesai,
        keperluan: data.keperluan,
        status: 'MENUNGGU',
      },
    });

    return peminjaman;
  }
}