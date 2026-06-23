import nodemailer from 'nodemailer';
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
  private transporter?: any;

  constructor() {
    this.isEnabled = !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

    if (this.isEnabled) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_SECURE === 'true',
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      console.log('📧 EmailService: SMTP not configured — running in stub/log mode');
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    if (!this.isEnabled || !this.transporter) {
      // Stub mode: log saja
      console.log('📧 [EMAIL STUB] Would send email:', {
        to: options.to,
        subject: options.subject,
        preview: options.text?.substring(0, 100) || options.html.substring(0, 100),
      });
      return { success: true, message: 'Email logged (stub mode)', messageId: `stub-${Date.now()}` };
    }

    try {
      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM || 'noreply@pancasila.ac.id',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, message: 'Email sent successfully', messageId: info.messageId };
    } catch (err) {
      console.error('❌ Email send failed:', err);
      return { success: false, message: `Email send failed: ${err instanceof Error ? err.message : String(err)}` };
    }
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

  async sendDokumenApprovalEmail(
    to: string,
    namaMahasiswa: string,
    dokumenTipe: string,
    status: string,
    catatan?: string
  ): Promise<EmailResult> {
    const statusText = status === 'DISETUJUI' ? 'disetujui' : 'ditolak';
    return this.sendEmail({
      to,
      subject: `Dokumen ${dokumenTipe} ${statusText}`,
      html: `
        <h2>Update Status Dokumen</h2>
        <p>Halo ${namaMahasiswa},</p>
        <p>Dokumen <strong>${dokumenTipe}</strong> Anda telah <strong>${statusText}</strong>.</p>
        ${catatan ? `<p><strong>Catatan:</strong><br>${catatan}</p>` : ''}
        <p>Silakan login ke sistem untuk informasi lebih lanjut.</p>
      `,
    });
  }

  async sendBulkEmail(recipients: string[], subject: string, html: string): Promise<EmailResult> {
    return this.sendEmail({
      to: recipients,
      subject,
      html,
    });
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
      return true;
    } catch (err) {
      console.error('❌ SMTP connection failed:', err);
      return false;
    }
  }
}

export const emailService = new EmailService();
