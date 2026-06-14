import { PrismaClient } from '@prisma/client';

export class DashboardAkreditasiUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute() {
    const totalMahasiswa = await this.prisma.mahasiswa.count();
    const totalDosen = await this.prisma.dosen.count();
    
    const statusCounts = await this.prisma.mahasiswa.groupBy({
      by: ['statusSkripsi'],
      _count: {
        statusSkripsi: true,
      },
    });

    const lulusCount = statusCounts.find(s => s.statusSkripsi === 'LULUS')?._count.statusSkripsi || 0;
    const bimbinganCount = statusCounts.find(s => s.statusSkripsi === 'BIMBINGAN')?._count.statusSkripsi || 0;
    const seminarCount = statusCounts.find(s => s.statusSkripsi === 'SEMINAR_PROPOSAL')?._count.statusSkripsi || 0;
    const sidangCount = statusCounts.find(s => s.statusSkripsi === 'SIDANG_SKRIPSI')?._count.statusSkripsi || 0;

    // Rata-rata lama penyelesaian skripsi (dalam hari)
    const mahasiswaLulus = await this.prisma.mahasiswa.findMany({
      where: { statusSkripsi: 'LULUS' },
      select: { createdAt: true, updatedAt: true },
    });

    const avgCompletionDays = mahasiswaLulus.length > 0
      ? Math.round(
          mahasiswaLulus.reduce((acc, m) => {
            const days = Math.ceil((m.updatedAt.getTime() - m.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            return acc + days;
          }, 0) / mahasiswaLulus.length
        )
      : 0;

    return {
      totalMahasiswa,
      totalDosen,
      statusDistribution: {
        lulus: lulusCount,
        bimbingan: bimbinganCount,
        seminarProposal: seminarCount,
        sidangSkripsi: sidangCount,
        revisi: statusCounts.find(s => s.statusSkripsi === 'REVISI')?._count.statusSkripsi || 0,
        ditolak: statusCounts.find(s => s.statusSkripsi === 'DITOLAK')?._count.statusSkripsi || 0,
      },
      completionRate: totalMahasiswa > 0 ? Math.round((lulusCount / totalMahasiswa) * 100) : 0,
      averageCompletionDays: avgCompletionDays,
      activeStudents: totalMahasiswa - lulusCount,
    };
  }
}