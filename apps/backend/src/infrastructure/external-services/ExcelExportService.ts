import * as XLSX from 'xlsx';
import { join } from 'path';
import { mkdirSync } from 'fs';

export interface SheetData {
  sheetName: string;
  headers: string[];
  data: Array<Record<string, any>>;
}

export class ExcelExportService {
  private outputDir: string;

  constructor(outputDir: string = join(process.cwd(), 'exports')) {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    try {
      mkdirSync(this.outputDir, { recursive: true });
    } catch (error) {
      console.warn('Failed to create export directory:', error);
    }
  }

  /**
   * Generate Excel file with attendance report
   */
  async generateAttendanceReport(
    data: Array<{
      mahasiswaId: string;
      nama: string;
      nim: string;
      pertemuanKehadiran: number;
      totalPertemuan: number;
      persentase: number;
    }>
  ): Promise<string> {
    const filename = `Laporan_Kehadiran_${this.getTimestamp()}.xlsx`;
    const filepath = join(this.outputDir, filename);

    const sheetData: SheetData = {
      sheetName: 'Kehadiran',
      headers: [
        'No',
        'ID Mahasiswa',
        'Nama',
        'NIM',
        'Pertemuan Hadir',
        'Total Pertemuan',
        'Persentase (%)',
      ],
      data: data.map((row, index) => ({
        'No': index + 1,
        'ID Mahasiswa': row.mahasiswaId,
        'Nama': row.nama,
        'NIM': row.nim,
        'Pertemuan Hadir': row.pertemuanKehadiran,
        'Total Pertemuan': row.totalPertemuan,
        'Persentase (%)': row.persentase.toFixed(2),
      })),
    };

    return await this.createExcelFile([sheetData], filepath);
  }

  /**
   * Generate Excel file with grades report
   */
  async generateGradesReport(
    data: Array<{
      mahasiswaId: string;
      nama: string;
      nim: string;
      jenisSidang: string;
      nilaiSeminar?: number;
      nilaiKomprehensif?: number;
      nilaiSkripsi?: number;
      nilaiAkhir: number;
      grade: string;
    }>
  ): Promise<string> {
    const filename = `Laporan_Nilai_${this.getTimestamp()}.xlsx`;
    const filepath = join(this.outputDir, filename);

    const sheetData: SheetData = {
      sheetName: 'Nilai',
      headers: [
        'No',
        'ID Mahasiswa',
        'Nama',
        'NIM',
        'Jenis Sidang',
        'Nilai Seminar',
        'Nilai Komprehensif',
        'Nilai Skripsi',
        'Nilai Akhir',
        'Grade',
      ],
      data: data.map((row, index) => ({
        'No': index + 1,
        'ID Mahasiswa': row.mahasiswaId,
        'Nama': row.nama,
        'NIM': row.nim,
        'Jenis Sidang': row.jenisSidang,
        'Nilai Seminar': row.nilaiSeminar || '-',
        'Nilai Komprehensif': row.nilaiKomprehensif || '-',
        'Nilai Skripsi': row.nilaiSkripsi || '-',
        'Nilai Akhir': row.nilaiAkhir.toFixed(2),
        'Grade': row.grade,
      })),
    };

    return await this.createExcelFile([sheetData], filepath);
  }

  /**
   * Generate Excel file with progress report
   */
  async generateProgressReport(
    data: Array<{
      mahasiswaId: string;
      nama: string;
      nim: string;
      topikStatus: string;
      logbookStatus: string;
      berkasStatus: string;
      sidangStatus: string;
      naskahStatus: string;
      finalStatus: string;
      persentaseSelesai: number;
    }>
  ): Promise<string> {
    const filename = `Laporan_Progres_${this.getTimestamp()}.xlsx`;
    const filepath = join(this.outputDir, filename);

    const sheetData: SheetData = {
      sheetName: 'Progress',
      headers: [
        'No',
        'ID Mahasiswa',
        'Nama',
        'NIM',
        'Topik',
        'Logbook',
        'Berkas',
        'Sidang',
        'Naskah',
        'Final',
        'Persentase Selesai (%)',
      ],
      data: data.map((row, index) => ({
        'No': index + 1,
        'ID Mahasiswa': row.mahasiswaId,
        'Nama': row.nama,
        'NIM': row.nim,
        'Topik': row.topikStatus,
        'Logbook': row.logbookStatus,
        'Berkas': row.berkasStatus,
        'Sidang': row.sidangStatus,
        'Naskah': row.naskahStatus,
        'Final': row.finalStatus,
        'Persentase Selesai (%)': row.persentaseSelesai.toFixed(2),
      })),
    };

    return await this.createExcelFile([sheetData], filepath);
  }

  /**
   * Generate Excel file with schedule report
   */
  async generateScheduleReport(
    data: Array<{
      jadwalId: string;
      mahasiswaId: string;
      nama: string;
      jenisSidang: string;
      tanggal: string;
      ruangan: string;
      pembimbing: string;
      penguji: string;
      status: string;
    }>
  ): Promise<string> {
    const filename = `Laporan_Jadwal_${this.getTimestamp()}.xlsx`;
    const filepath = join(this.outputDir, filename);

    const sheetData: SheetData = {
      sheetName: 'Jadwal',
      headers: [
        'No',
        'ID Jadwal',
        'ID Mahasiswa',
        'Nama Mahasiswa',
        'Jenis Sidang',
        'Tanggal',
        'Ruangan',
        'Dosen Pembimbing',
        'Dosen Penguji',
        'Status',
      ],
      data: data.map((row, index) => ({
        'No': index + 1,
        'ID Jadwal': row.jadwalId,
        'ID Mahasiswa': row.mahasiswaId,
        'Nama Mahasiswa': row.nama,
        'Jenis Sidang': row.jenisSidang,
        'Tanggal': row.tanggal,
        'Ruangan': row.ruangan,
        'Dosen Pembimbing': row.pembimbing,
        'Dosen Penguji': row.penguji,
        'Status': row.status,
      })),
    };

    return await this.createExcelFile([sheetData], filepath);
  }

  /**
   * Generate Excel file with student statistics
   */
  async generateStatisticsReport(
    mahasiswaStats: {
      totalMahasiswa: number;
      selesai: number;
      sedangBerjalan: number;
      tertunda: number;
    },
    dosenStats: {
      totalDosen: number;
      pembimbing: number;
      penguji: number;
      regular: number;
    },
    jadwalStats: {
      totalJadwal: number;
      sudahBerlangsung: number;
      akanDatang: number;
      ditunda: number;
    }
  ): Promise<string> {
    const filename = `Laporan_Statistik_${this.getTimestamp()}.xlsx`;
    const filepath = join(this.outputDir, filename);

    const mahasiswaData: SheetData = {
      sheetName: 'Statistik Mahasiswa',
      headers: ['Kategori', 'Jumlah'],
      data: [
        { 'Kategori': 'Total Mahasiswa', 'Jumlah': mahasiswaStats.totalMahasiswa },
        { 'Kategori': 'Selesai', 'Jumlah': mahasiswaStats.selesai },
        { 'Kategori': 'Sedang Berjalan', 'Jumlah': mahasiswaStats.sedangBerjalan },
        { 'Kategori': 'Tertunda', 'Jumlah': mahasiswaStats.tertunda },
      ],
    };

    const dosenData: SheetData = {
      sheetName: 'Statistik Dosen',
      headers: ['Kategori', 'Jumlah'],
      data: [
        { 'Kategori': 'Total Dosen', 'Jumlah': dosenStats.totalDosen },
        { 'Kategori': 'Dosen Pembimbing', 'Jumlah': dosenStats.pembimbing },
        { 'Kategori': 'Dosen Penguji', 'Jumlah': dosenStats.penguji },
        { 'Kategori': 'Dosen Regular', 'Jumlah': dosenStats.regular },
      ],
    };

    const jadwalData: SheetData = {
      sheetName: 'Statistik Jadwal',
      headers: ['Kategori', 'Jumlah'],
      data: [
        { 'Kategori': 'Total Jadwal', 'Jumlah': jadwalStats.totalJadwal },
        { 'Kategori': 'Sudah Berlangsung', 'Jumlah': jadwalStats.sudahBerlangsung },
        { 'Kategori': 'Akan Datang', 'Jumlah': jadwalStats.akanDatang },
        { 'Kategori': 'Ditunda', 'Jumlah': jadwalStats.ditunda },
      ],
    };

    return await this.createExcelFile([mahasiswaData, dosenData, jadwalData], filepath);
  }

  /**
   * Create Excel file with multiple sheets
   */
  private async createExcelFile(sheets: SheetData[], filepath: string): Promise<string> {
    try {
      const workbook = XLSX.utils.book_new();

      sheets.forEach((sheet) => {
        const worksheet = XLSX.utils.json_to_sheet(sheet.data, {
          header: sheet.headers,
        });

        // Auto-calculate column widths
        const columnWidths = sheet.headers.map((header) => ({
          wch: Math.max(header.length + 2, 12),
        }));
        worksheet['!cols'] = columnWidths;

        // Add header styling info (note: basic styling, advanced styling requires paid xlsx library)
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
      });

      XLSX.writeFile(workbook, filepath);
      console.log(`✅ Excel file created: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error('❌ Error creating Excel file:', error);
      throw new Error(
        `Failed to create Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate timestamp for filename
   */
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').substring(0, 19);
  }

  /**
   * Get export directory path
   */
  getExportDir(): string {
    return this.outputDir;
  }
}
