import { PrismaClient } from '@prisma/client';

export class LaporanKinerjaUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(prodiId?: string) {
    const where = prodiId ? { prodiId } : {};

    const dosenList = await this.prisma.dosen.findMany({
      where,
      include: {
        prodi: true,
        mahasiswaBimbingan1: {
          select: { id: true, statusSkripsi: true, nim: true, nama: true },
        },
        mahasiswaBimbingan2: {
          select: { id: true, statusSkripsi: true, nim: true, nama: true },
        },
        penilaian: true,
      },
    });

    const laporan = dosenList.map(dosen => {
      const totalBimbingan = dosen.mahasiswaBimbingan1.length + dosen.mahasiswaBimbingan2.length;
      const mahasiswaLulus = [
        ...dosen.mahasiswaBimbingan1,
        ...dosen.mahasiswaBimbingan2,
      ].filter(m => m.statusSkripsi === 'LULUS').length;

      const totalPenilaian = dosen.penilaian.length;

      return {
        nidn: dosen.nidn,
        nama: dosen.nama,
        prodi: dosen.prodi.nama,
        jabatan: dosen.jabatan,
        totalBimbingan,
        mahasiswaLulus,
        mahasiswaAktif: totalBimbingan - mahasiswaLulus,
        completionRate: totalBimbingan > 0 ? Math.round((mahasiswaLulus / totalBimbingan) * 100) : 0,
        totalPenilaian,
        bidangKeahlian: dosen.bidangKeahlian,
      };
    });

    return {
      totalDosen: dosenList.length,
      data: laporan,
      generatedAt: new Date().toISOString(),
    };
  }
}