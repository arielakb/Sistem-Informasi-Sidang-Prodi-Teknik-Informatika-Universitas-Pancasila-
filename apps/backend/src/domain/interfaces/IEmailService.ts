export interface IEmailService {
  sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<{ success: boolean; message: string; messageId?: string }>;

  sendWelcomeEmail(to: string, nama: string): Promise<{ success: boolean; message: string }>;

  sendLogbookValidasiEmail(
    to: string,
    namaMahasiswa: string,
    status: string,
    catatan?: string
  ): Promise<{ success: boolean; message: string }>;

  sendJadwalSidangEmail(
    to: string,
    namaMahasiswa: string,
    jenisSidang: string,
    tanggal: Date,
    ruangan: string
  ): Promise<{ success: boolean; message: string }>;
}
