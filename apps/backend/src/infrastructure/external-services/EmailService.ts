import { env } from '../config/env';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  messageId?: string;
}

/**
 * Email Service — saat ini dalam mode stub (log ke console).
 * Untuk production, ganti dengan Nodemailer atau service email lainnya.
 */
export class EmailService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

    if (!this.isEnabled) {
      console.log('📧 EmailService: SMTP not configured — running in stub/log mode');
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    if (!this.isEnabled) {
      // Stub mode: log saja
      console.log('📧 [EMAIL STUB] Would send email:', {
        to: options.to,
        subject: options.subject,
        preview: options.text?.substring(0, 100) || options.html.substring(0, 100),
      });
      return { success: true, message: 'Email logged (stub mode)', messageId: `stub-${Date.now()}` };
    }

    // TODO: Implementasi nyata dengan nodemailer saat SMTP tersedia
    // const transporter = nodemailer.createTransporter({ ... })
    // const info = await transporter.sendMail({ ... })
    console.log('📧 EmailService: Real SMTP configured but nodemailer not yet installed');
    return { success: true, message: 'Email queued' };
  }

  async sendWelcomeEmail(to: string, nama: string): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: 'Selamat Datang — Sistem Administrasi Skripsi Universitas Pancasila',
      text: `Halo ${nama}, selamat datang di Sistem Administrasi Skripsi Universitas Pancasila.`,
      html: `
        <h2>Halo ${nama}!</h2>
        <p>Selamat datang di <strong>Sistem Administrasi Skripsi Universitas Pancasila</strong>.</p>
        <p>Akun Anda telah berhasil dibuat. Silakan login untuk memulai.</p>
        <br>
        <p>Salam,<br>Tim Administrasi Skripsi</p>
      `,
    });
  }

  async sendLogbookValidasiEmail(
    to: string,
    namaMahasiswa: string,
    status: string,
    catatan?: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: `Logbook Bimbingan ${status === 'DIVALIDASI' ? 'Disetujui' : 'Ditolak'}`,
      html: `
        <h2>Update Logbook Bimbingan</h2>
        <p>Halo ${namaMahasiswa},</p>
        <p>Logbook bimbingan Anda telah <strong>${status === 'DIVALIDASI' ? 'disetujui' : 'ditolak'}</strong> oleh dosen pembimbing.</p>
        ${catatan ? `<p><strong>Catatan:</strong> ${catatan}</p>` : ''}
        <p>Silakan login ke sistem untuk melihat detail.</p>
      `,
    });
  }

  async sendJadwalSidangEmail(
    to: string,
    namaMahasiswa: string,
    jenisSidang: string,
    tanggal: Date,
    ruangan: string
  ): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: `Jadwal ${jenisSidang} Telah Dijadwalkan`,
      html: `
        <h2>Jadwal Sidang</h2>
        <p>Halo ${namaMahasiswa},</p>
        <p>Jadwal <strong>${jenisSidang}</strong> Anda telah dijadwalkan:</p>
        <ul>
          <li><strong>Tanggal:</strong> ${tanggal.toLocaleDateString('id-ID')}</li>
          <li><strong>Ruangan:</strong> ${ruangan}</li>
        </ul>
        <p>Harap mempersiapkan diri dengan baik. Semangat!</p>
      `,
    });
  }
}

export const emailService = new EmailService();
