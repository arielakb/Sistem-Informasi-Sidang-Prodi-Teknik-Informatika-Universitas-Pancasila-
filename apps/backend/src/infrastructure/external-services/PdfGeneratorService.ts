import * as fs from 'fs';
import * as path from 'path';

export interface JadwalSidangData {
  id: string;
  jenisSidang: string;
  tanggal: Date;
  waktuMulai: Date;
  waktuSelesai: Date;
  mahasiswa: {
    nim: string;
    nama: string;
    judulSkripsi?: string | null;
  };
  ruangan: {
    nama: string;
  };
  penguji1?: { nama: string } | null;
  penguji2?: { nama: string } | null;
  penguji3?: { nama: string } | null;
  pembimbing1?: { nama: string } | null;
  pembimbing2?: { nama: string } | null;
}

export interface PdfGenerateResult {
  filePath: string;
  fileName: string;
  url: string;
}

/**
 * PDF Generator Service — menggunakan HTML template yang disimpan sebagai file.
 * Untuk production, ganti dengan Puppeteer atau PDFKit untuk generate PDF sungguhan.
 * Saat ini menghasilkan file HTML yang bisa dibuka di browser.
 */
export class PdfGeneratorService {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join('./uploads', 'dokumen');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateSKPenguji(jadwal: JadwalSidangData, generatedBy: string): Promise<PdfGenerateResult> {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `SK_PENGUJI_${jadwal.mahasiswa.nim}_${timestamp}.html`;
    const filePath = path.join(this.outputDir, fileName);

    const html = this.buildSKPengujiHtml(jadwal, generatedBy);
    fs.writeFileSync(filePath, html, 'utf-8');

    console.log(`📄 [PDF] SK Penguji generated: ${fileName}`);

    return {
      filePath,
      fileName,
      url: `/uploads/dokumen/${fileName}`,
    };
  }

  async generateBeritaAcara(jadwal: JadwalSidangData, generatedBy: string): Promise<PdfGenerateResult> {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `BERITA_ACARA_${jadwal.mahasiswa.nim}_${timestamp}.html`;
    const filePath = path.join(this.outputDir, fileName);

    const html = this.buildBeritaAcaraHtml(jadwal, generatedBy);
    fs.writeFileSync(filePath, html, 'utf-8');

    console.log(`📄 [PDF] Berita Acara generated: ${fileName}`);

    return {
      filePath,
      fileName,
      url: `/uploads/dokumen/${fileName}`,
    };
  }

  /**
   * Try to generate a real PDF using Puppeteer. If Puppeteer isn't installed
   * or fails, falls back to writing the HTML file and returns its path.
   */
  async generateBeritaAcaraPdf(jadwal: JadwalSidangData, generatedBy: string): Promise<PdfGenerateResult> {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileNamePdf = `BERITA_ACARA_${jadwal.mahasiswa.nim}_${timestamp}.pdf`;
    const filePathPdf = path.join(this.outputDir, fileNamePdf);

    const html = this.buildBeritaAcaraHtml(jadwal, generatedBy);

    try {
      await this.renderHtmlToPdf(html, filePathPdf);
      console.log(`📄 [PDF] Berita Acara (PDF) generated: ${fileNamePdf}`);
      return { filePath: filePathPdf, fileName: fileNamePdf, url: `/uploads/dokumen/${fileNamePdf}` };
    } catch (err) {
      // fallback to HTML file
      const fallbackName = `BERITA_ACARA_${jadwal.mahasiswa.nim}_${timestamp}.html`;
      const fallbackPath = path.join(this.outputDir, fallbackName);
      fs.writeFileSync(fallbackPath, html, 'utf-8');
      console.warn('⚠️ Puppeteer not available or failed — falling back to HTML output', err);
      return { filePath: fallbackPath, fileName: fallbackName, url: `/uploads/dokumen/${fallbackName}` };
    }
  }

  async generateSKPengujiPdf(jadwal: JadwalSidangData, generatedBy: string): Promise<PdfGenerateResult> {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileNamePdf = `SK_PENGUJI_${jadwal.mahasiswa.nim}_${timestamp}.pdf`;
    const filePathPdf = path.join(this.outputDir, fileNamePdf);

    const html = this.buildSKPengujiHtml(jadwal, generatedBy);

    try {
      await this.renderHtmlToPdf(html, filePathPdf);
      console.log(`📄 [PDF] SK Penguji (PDF) generated: ${fileNamePdf}`);
      return { filePath: filePathPdf, fileName: fileNamePdf, url: `/uploads/dokumen/${fileNamePdf}` };
    } catch (err) {
      const fallbackName = `SK_PENGUJI_${jadwal.mahasiswa.nim}_${timestamp}.html`;
      const fallbackPath = path.join(this.outputDir, fallbackName);
      fs.writeFileSync(fallbackPath, html, 'utf-8');
      console.warn('⚠️ Puppeteer not available or failed — falling back to HTML output', err);
      return { filePath: fallbackPath, fileName: fallbackName, url: `/uploads/dokumen/${fallbackName}` };
    }
  }

  private async renderHtmlToPdf(html: string, outputPath: string): Promise<void> {
    try {
      // Dynamic import — safe fallback if puppeteer not available
      const puppeteer = await import('puppeteer');
      
      const browser = await puppeteer.default.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });

      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
        console.log(`✅ PDF generated successfully: ${outputPath}`);
      } finally {
        await browser.close();
      }
    } catch (err: any) {
      if (err.code === 'MODULE_NOT_FOUND' || err.message.includes('puppeteer')) {
        throw new Error('Puppeteer not installed or not available');
      }
      throw err;
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  private buildSKPengujiHtml(jadwal: JadwalSidangData, generatedBy: string): string {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>SK Penguji — ${jadwal.mahasiswa.nama}</title>
  <style>
    body { font-family: 'Times New Roman', serif; margin: 40px; font-size: 12pt; }
    .header { text-align: center; margin-bottom: 20px; }
    .header h2, .header h3 { margin: 4px 0; }
    hr { border: 2px solid black; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    td { padding: 4px 8px; }
    .label { width: 40%; }
    .footer { margin-top: 60px; }
    .sign-area { float: right; text-align: center; width: 250px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>UNIVERSITAS PANCASILA</h2>
    <h3>SURAT KEPUTUSAN DOSEN PENGUJI ${jadwal.jenisSidang.replace(/_/g, ' ')}</h3>
    <hr>
  </div>
  <p>Yang bertanda tangan di bawah ini, Koordinator Program Studi, menetapkan dosen penguji untuk ${jadwal.jenisSidang.replace(/_/g, ' ')} mahasiswa berikut:</p>
  <table>
    <tr><td class="label">Nama Mahasiswa</td><td>: ${jadwal.mahasiswa.nama}</td></tr>
    <tr><td class="label">NIM</td><td>: ${jadwal.mahasiswa.nim}</td></tr>
    <tr><td class="label">Judul Skripsi</td><td>: ${jadwal.mahasiswa.judulSkripsi || '-'}</td></tr>
    <tr><td class="label">Jenis Sidang</td><td>: ${jadwal.jenisSidang.replace(/_/g, ' ')}</td></tr>
    <tr><td class="label">Tanggal</td><td>: ${this.formatDate(jadwal.tanggal)}</td></tr>
    <tr><td class="label">Waktu</td><td>: ${this.formatTime(jadwal.waktuMulai)} — ${this.formatTime(jadwal.waktuSelesai)}</td></tr>
    <tr><td class="label">Ruangan</td><td>: ${jadwal.ruangan.nama}</td></tr>
  </table>
  <p><strong>Susunan Tim Penguji:</strong></p>
  <table border="1" style="border-collapse:collapse;">
    <tr><th style="padding:8px">No</th><th style="padding:8px">Nama Dosen</th><th style="padding:8px">Peran</th></tr>
    ${jadwal.pembimbing1 ? `<tr><td style="padding:8px;text-align:center">1</td><td style="padding:8px">${jadwal.pembimbing1.nama}</td><td style="padding:8px">Pembimbing 1</td></tr>` : ''}
    ${jadwal.pembimbing2 ? `<tr><td style="padding:8px;text-align:center">2</td><td style="padding:8px">${jadwal.pembimbing2.nama}</td><td style="padding:8px">Pembimbing 2</td></tr>` : ''}
    ${jadwal.penguji1 ? `<tr><td style="padding:8px;text-align:center">3</td><td style="padding:8px">${jadwal.penguji1.nama}</td><td style="padding:8px">Penguji 1</td></tr>` : ''}
    ${jadwal.penguji2 ? `<tr><td style="padding:8px;text-align:center">4</td><td style="padding:8px">${jadwal.penguji2.nama}</td><td style="padding:8px">Penguji 2</td></tr>` : ''}
    ${jadwal.penguji3 ? `<tr><td style="padding:8px;text-align:center">5</td><td style="padding:8px">${jadwal.penguji3.nama}</td><td style="padding:8px">Penguji 3</td></tr>` : ''}
  </table>
  <div class="footer">
    <p>Ditetapkan di: Jakarta</p>
    <p>Pada tanggal: ${this.formatDate(new Date())}</p>
    <div class="sign-area">
      <p>Koordinator Program Studi</p>
      <br><br><br>
      <p>(__________________________)</p>
      <p><small>Dibuat oleh: ${generatedBy}</small></p>
    </div>
  </div>
</body>
</html>`;
  }

  private buildBeritaAcaraHtml(jadwal: JadwalSidangData, generatedBy: string): string {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Berita Acara — ${jadwal.mahasiswa.nama}</title>
  <style>
    body { font-family: 'Times New Roman', serif; margin: 40px; font-size: 12pt; }
    .header { text-align: center; margin-bottom: 20px; }
    .header h2, .header h3 { margin: 4px 0; }
    hr { border: 2px solid black; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    td { padding: 4px 8px; }
    .label { width: 40%; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 60px; }
    .sign-box { text-align: center; width: 30%; }
  </style>
</head>
<body>
  <div class="header">
    <h2>UNIVERSITAS PANCASILA</h2>
    <h3>BERITA ACARA ${jadwal.jenisSidang.replace(/_/g, ' ')}</h3>
    <hr>
  </div>
  <p>Pada hari ini telah dilaksanakan ${jadwal.jenisSidang.replace(/_/g, ' ')} dengan data sebagai berikut:</p>
  <table>
    <tr><td class="label">Nama Mahasiswa</td><td>: ${jadwal.mahasiswa.nama}</td></tr>
    <tr><td class="label">NIM</td><td>: ${jadwal.mahasiswa.nim}</td></tr>
    <tr><td class="label">Judul Skripsi</td><td>: ${jadwal.mahasiswa.judulSkripsi || '-'}</td></tr>
    <tr><td class="label">Tanggal Pelaksanaan</td><td>: ${this.formatDate(jadwal.tanggal)}</td></tr>
    <tr><td class="label">Waktu</td><td>: ${this.formatTime(jadwal.waktuMulai)} — ${this.formatTime(jadwal.waktuSelesai)}</td></tr>
    <tr><td class="label">Tempat</td><td>: ${jadwal.ruangan.nama}</td></tr>
  </table>
  <p>Hasil sidang: <strong>[ ] Lulus &nbsp;&nbsp;&nbsp; [ ] Lulus dengan Perbaikan &nbsp;&nbsp;&nbsp; [ ] Tidak Lulus</strong></p>
  <p>Catatan:</p>
  <div style="border:1px solid black;height:100px;padding:10px;margin-bottom:20px;"></div>
  <div class="sign-row">
    ${jadwal.penguji1 ? `<div class="sign-box"><p>${jadwal.penguji1.nama}</p><br><br><br><p>(_________________)</p><p>Penguji 1</p></div>` : ''}
    ${jadwal.penguji2 ? `<div class="sign-box"><p>${jadwal.penguji2.nama}</p><br><br><br><p>(_________________)</p><p>Penguji 2</p></div>` : ''}
    ${jadwal.penguji3 ? `<div class="sign-box"><p>${jadwal.penguji3.nama}</p><br><br><br><p>(_________________)</p><p>Penguji 3</p></div>` : ''}
  </div>
  <p style="margin-top:20px;font-size:10pt;">Dokumen dibuat oleh: ${generatedBy} pada ${new Date().toLocaleString('id-ID')}</p>
</body>
</html>`;
  }
}

export const pdfGeneratorService = new PdfGeneratorService();
