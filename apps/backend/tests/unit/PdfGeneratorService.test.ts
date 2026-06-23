import { PdfGeneratorService, JadwalSidangData, PdfGenerateResult } from '../../src/infrastructure/external-services/PdfGeneratorService';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');

describe('PdfGeneratorService', () => {
  let service: PdfGeneratorService;
  const mockMkdirSync = jest.mocked(fs.mkdirSync);
  const mockExistsSync = jest.mocked(fs.existsSync);
  const mockWriteFileSync = jest.mocked(fs.writeFileSync);

  const mockJadwal: JadwalSidangData = {
    id: 'jadwal-001',
    jenisSidang: 'SEMINAR_PROPOSAL',
    tanggal: new Date('2026-06-20'),
    waktuMulai: new Date('2026-06-20 09:00:00'),
    waktuSelesai: new Date('2026-06-20 11:00:00'),
    mahasiswa: {
      nim: '2024001',
      nama: 'Budi Santoso',
      judulSkripsi: 'Sistem Informasi Administrasi Skripsi Universitas Pancasila',
    },
    ruangan: {
      nama: 'Lab Komputer A',
    },
    pembimbing1: {
      nama: 'Dr. Ahmad Hidayat',
    },
    pembimbing2: {
      nama: 'Dr. Siti Nurhaliza',
    },
    penguji1: {
      nama: 'Prof. Romi Satria Wahono',
    },
    penguji2: {
      nama: 'Dr. Bambang Irawan',
    },
    penguji3: {
      nama: 'Dr. Kuswanto',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
  });

  describe('constructor', () => {
    it('should create uploads/dokumen directory if it does not exist', () => {
      mockExistsSync.mockReturnValueOnce(false);
      service = new PdfGeneratorService();
      expect(mockMkdirSync).toHaveBeenCalledWith(expect.stringContaining('uploads'), {
        recursive: true,
      });
    });
  });

  describe('generateSKPenguji', () => {
    it('should generate SK Penguji HTML file', async () => {
      service = new PdfGeneratorService();
      const result = await service.generateSKPenguji(mockJadwal, 'admin@univ.ac.id');

      expect(result).toBeDefined();
      expect(result.fileName).toContain('SK_PENGUJI');
      expect(result.fileName).toContain(mockJadwal.mahasiswa.nim);
      expect(result.fileName).toContain('.html');
      expect(result.url).toContain('/uploads/dokumen/');
      expect(mockWriteFileSync).toHaveBeenCalled();
    });

    it('should include correct data in HTML output', async () => {
      service = new PdfGeneratorService();
      await service.generateSKPenguji(mockJadwal, 'admin@univ.ac.id');

      const callArgs = mockWriteFileSync.mock.calls[0];
      const htmlContent = callArgs[1] as string;

      expect(htmlContent).toContain(mockJadwal.mahasiswa.nama);
      expect(htmlContent).toContain(mockJadwal.mahasiswa.nim);
      expect(htmlContent).toContain(mockJadwal.mahasiswa.judulSkripsi);
      expect(htmlContent).toContain('UNIVERSITAS PANCASILA');
      expect(htmlContent).toContain('SURAT KEPUTUSAN');
    });
  });

  describe('generateBeritaAcara', () => {
    it('should generate Berita Acara HTML file', async () => {
      service = new PdfGeneratorService();
      const result = await service.generateBeritaAcara(mockJadwal, 'admin@univ.ac.id');

      expect(result).toBeDefined();
      expect(result.fileName).toContain('BERITA_ACARA');
      expect(result.fileName).toContain(mockJadwal.mahasiswa.nim);
      expect(result.fileName).toContain('.html');
      expect(mockWriteFileSync).toHaveBeenCalled();
    });

    it('should include correct data in Berita Acara HTML', async () => {
      service = new PdfGeneratorService();
      await service.generateBeritaAcara(mockJadwal, 'admin@univ.ac.id');

      const callArgs = mockWriteFileSync.mock.calls[0];
      const htmlContent = callArgs[1] as string;

      expect(htmlContent).toContain(mockJadwal.mahasiswa.nama);
      expect(htmlContent).toContain('BERITA ACARA');
      expect(htmlContent).toContain('Hasil sidang');
    });
  });

  describe('generateBeritaAcaraPdf', () => {
    it('should fallback to HTML when Puppeteer is not available', async () => {
      service = new PdfGeneratorService();
      const result = await service.generateBeritaAcaraPdf(mockJadwal, 'admin@univ.ac.id');

      // Should still return a result (HTML fallback)
      expect(result).toBeDefined();
      expect(result.fileName).toContain('BERITA_ACARA');
      expect(result.fileName).toContain(mockJadwal.mahasiswa.nim);
      expect(mockWriteFileSync).toHaveBeenCalled();
    });
  });

  describe('generateSKPengujiPdf', () => {
    it('should fallback to HTML when Puppeteer is not available', async () => {
      service = new PdfGeneratorService();
      const result = await service.generateSKPengujiPdf(mockJadwal, 'admin@univ.ac.id');

      // Should still return a result (HTML fallback)
      expect(result).toBeDefined();
      expect(result.fileName).toContain('SK_PENGUJI');
      expect(result.fileName).toContain(mockJadwal.mahasiswa.nim);
      expect(mockWriteFileSync).toHaveBeenCalled();
    });
  });
});
