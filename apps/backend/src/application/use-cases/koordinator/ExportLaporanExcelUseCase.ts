import { ExcelExportService } from '../../../infrastructure/external-services/ExcelExportService';

export interface ExportOption {
  type: 'attendance' | 'grades' | 'progress' | 'schedule' | 'statistics';
  filters?: {
    startDate?: string;
    endDate?: string;
    prodiId?: string;
    status?: string;
  };
}

export class ExportLaporanExcelUseCase {
  constructor(
    private excelExportService: ExcelExportService,
    private prisma: any // Prisma client
  ) {}

  async execute(option: ExportOption): Promise<string> {
    switch (option.type) {
      case 'attendance':
        return this.exportAttendanceReport();
      case 'grades':
        return this.exportGradesReport();
      case 'progress':
        return this.exportProgressReport();
      case 'schedule':
        return this.exportScheduleReport(option.filters);
      case 'statistics':
        return this.exportStatisticsReport();
      default:
        throw new Error('Invalid export type');
    }
  }

  private async exportAttendanceReport(): Promise<string> {
    // Fetch attendance data from database
    const logbooks = await this.prisma.logbookBimbingan.findMany({
      include: {
        mahasiswa: {
          include: {
            user: true,
          },
        },
      },
    });

    // Group by mahasiswa and count attendance
    const attendanceMap = new Map<string, any>();

    logbooks.forEach((logbook: any) => {
      const mahasiswaId = logbook.mahasiswa.id;
      if (!attendanceMap.has(mahasiswaId)) {
        attendanceMap.set(mahasiswaId, {
          mahasiswaId,
          nama: logbook.mahasiswa.user.nama_lengkap,
          nim: logbook.mahasiswa.nim,
          pertemuanKehadiran: 0,
          totalPertemuan: 0,
          persentase: 0,
        });
      }

      const current = attendanceMap.get(mahasiswaId);
      current.totalPertemuan++;
      if (logbook.status_validasi === 'DISETUJUI') {
        current.pertemuanKehadiran++;
      }
      current.persentase = (current.pertemuanKehadiran / current.totalPertemuan) * 100;
    });

    const attendanceData = Array.from(attendanceMap.values());
    return this.excelExportService.generateAttendanceReport(attendanceData);
  }

  private async exportGradesReport(): Promise<string> {
    // Fetch grading data
    const penilaian = await this.prisma.penilaianSidang.findMany({
      include: {
        jadwal_sidang: {
          include: {
            mahasiswa: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // Group by mahasiswa
    const gradesMap = new Map<string, any>();

    penilaian.forEach((grade: any) => {
      const mahasiswaId = grade.jadwal_sidang.mahasiswa.id;
      const jenisSidang = grade.jadwal_sidang.jenis_sidang;

      if (!gradesMap.has(mahasiswaId)) {
        gradesMap.set(mahasiswaId, {
          mahasiswaId,
          nama: grade.jadwal_sidang.mahasiswa.user.nama_lengkap,
          nim: grade.jadwal_sidang.mahasiswa.nim,
          jenisSidang,
          nilaiAkhir: 0,
          grade: 'N/A',
        });
      }

      const entry = gradesMap.get(mahasiswaId);

      // Calculate average grade based on components
      const komponenCount = 3; // Assumption: 3 components
      const totalNilai = grade.nilai_komponen || 0;
      entry.nilaiAkhir = totalNilai / komponenCount;
      entry.grade = this.calculateGrade(entry.nilaiAkhir);
    });

    const gradesData = Array.from(gradesMap.values());
    return this.excelExportService.generateGradesReport(gradesData);
  }

  private async exportProgressReport(): Promise<string> {
    // Fetch mahasiswa progress data
    const mahasiswa = await this.prisma.mahasiswa.findMany({
      include: {
        user: true,
        skripsi: true,
        logbook_bimbingan: true,
        berkas_sidang: true,
        jadwal_sidang: true,
        naskah_final: true,
      },
    });

    const progressData = mahasiswa.map((mhs: any) => ({
      mahasiswaId: mhs.id,
      nama: mhs.user.nama_lengkap,
      nim: mhs.nim,
      topikStatus: mhs.skripsi ? 'SELESAI' : 'BELUM',
      logbookStatus:
        mhs.logbook_bimbingan && mhs.logbook_bimbingan.length > 0 ? 'SELESAI' : 'BELUM',
      berkasStatus: mhs.berkas_sidang && mhs.berkas_sidang.length > 0 ? 'SELESAI' : 'BELUM',
      sidangStatus: mhs.jadwal_sidang ? 'SELESAI' : 'BELUM',
      naskahStatus: mhs.naskah_final ? 'SELESAI' : 'BELUM',
      finalStatus: mhs.naskah_final ? 'SELESAI' : 'BELUM',
      persentaseSelesai: this.calculateProgress(mhs),
    }));

    return this.excelExportService.generateProgressReport(progressData);
  }

  private async exportScheduleReport(filters?: any): Promise<string> {
    // Fetch jadwal sidang with filters
    const jadwalQuery: any = {
      include: {
        mahasiswa: {
          include: {
            user: true,
          },
        },
      },
    };

    if (filters?.startDate || filters?.endDate) {
      jadwalQuery.where = {
        tanggal: {
          gte: filters?.startDate ? new Date(filters.startDate) : undefined,
          lte: filters?.endDate ? new Date(filters.endDate) : undefined,
        },
      };
    }

    const jadwal = await this.prisma.jadwalSidang.findMany(jadwalQuery);

    const scheduleData = jadwal.map((j: any) => ({
      jadwalId: j.id,
      mahasiswaId: j.mahasiswa.id,
      nama: j.mahasiswa.user.nama_lengkap,
      jenisSidang: j.jenis_sidang,
      tanggal: j.tanggal.toISOString().split('T')[0],
      ruangan: j.ruangan,
      pembimbing: j.pembimbing_1 || 'N/A',
      penguji: j.penguji_ids?.[0] || 'N/A',
      status: j.status,
    }));

    return this.excelExportService.generateScheduleReport(scheduleData);
  }

  private async exportStatisticsReport(): Promise<string> {
    // Fetch statistics
    const totalMahasiswa = await this.prisma.mahasiswa.count();
    const totalDosen = await this.prisma.dosen.count();
    const totalJadwal = await this.prisma.jadwalSidang.count();

    const selesaiMahasiswa = await this.prisma.mahasiswa.count({
      where: {
        skripsi: {
          is: {
            NOT: null,
          },
        },
      },
    });

    const dosenPembimbing = await this.prisma.dosen.count({
      where: {
        roles: {
          has: 'DOSEN_PEMBIMBING',
        },
      },
    });

    const dosenPenguji = await this.prisma.dosen.count({
      where: {
        roles: {
          has: 'DOSEN_PENGUJI',
        },
      },
    });

    const jadwalBerlangsung = await this.prisma.jadwalSidang.count({
      where: {
        status: 'BERLANGSUNG',
      },
    });

    const jadwalAkanDatang = await this.prisma.jadwalSidang.count({
      where: {
        status: 'DIJADWALKAN',
      },
    });

    const mahasiswaStats = {
      totalMahasiswa,
      selesai: selesaiMahasiswa,
      sedangBerjalan: totalMahasiswa - selesaiMahasiswa,
      tertunda: 0, // Would need additional status field
    };

    const dosenStats = {
      totalDosen,
      pembimbing: dosenPembimbing,
      penguji: dosenPenguji,
      regular: totalDosen - dosenPembimbing - dosenPenguji,
    };

    const jadwalStats = {
      totalJadwal,
      sudahBerlangsung: jadwalBerlangsung,
      akanDatang: jadwalAkanDatang,
      ditunda: totalJadwal - jadwalBerlangsung - jadwalAkanDatang,
    };

    return this.excelExportService.generateStatisticsReport(
      mahasiswaStats,
      dosenStats,
      jadwalStats
    );
  }

  private calculateGrade(nilai: number): string {
    if (nilai >= 85) return 'A';
    if (nilai >= 80) return 'A-';
    if (nilai >= 75) return 'B+';
    if (nilai >= 70) return 'B';
    if (nilai >= 65) return 'B-';
    if (nilai >= 60) return 'C+';
    if (nilai >= 55) return 'C';
    return 'D';
  }

  private calculateProgress(mahasiswa: any): number {
    let completed = 0;
    const total = 6;

    if (mahasiswa.skripsi) completed++;
    if (mahasiswa.logbook_bimbingan && mahasiswa.logbook_bimbingan.length > 0) completed++;
    if (mahasiswa.berkas_sidang && mahasiswa.berkas_sidang.length > 0) completed++;
    if (mahasiswa.jadwal_sidang) completed++;
    if (mahasiswa.naskah_final) completed++;
    if (mahasiswa.naskah_final) completed++; // Final

    return (completed / total) * 100;
  }
}
