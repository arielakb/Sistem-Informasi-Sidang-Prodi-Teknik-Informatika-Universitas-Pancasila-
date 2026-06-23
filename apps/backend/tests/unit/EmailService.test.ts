import { EmailService } from '../../src/infrastructure/external-services/EmailService';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('EmailService', () => {
  let emailService: EmailService;
  let mockSendMail: jest.Mock;
  let mockVerify: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id@example.com' });
    mockVerify = jest.fn().mockResolvedValue(true);

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
      verify: mockVerify,
    });

    // Set up env variables
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'test-password';

    emailService = new EmailService();
  });

  describe('constructor', () => {
    it('should create transporter when SMTP is configured', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: 'test@example.com',
            pass: 'test-password',
          },
        })
      );
    });

    it('should handle SMTP not configured', () => {
      process.env.SMTP_HOST = '';
      const service = new EmailService();
      expect(service).toBeDefined();
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const result = await emailService.sendEmail({
        to: 'user@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id@example.com');
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@example.com',
          subject: 'Test Subject',
          html: '<p>Test content</p>',
        })
      );
    });

    it('should handle multiple recipients', async () => {
      await emailService.sendEmail({
        to: ['user1@example.com', 'user2@example.com'],
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user1@example.com,user2@example.com',
        })
      );
    });

    it('should fall back to stub mode on send error', async () => {
      mockSendMail.mockRejectedValueOnce(new Error('SMTP connection failed'));

      const result = await emailService.sendEmail({
        to: 'user@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Email send failed');
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct template', async () => {
      await emailService.sendWelcomeEmail('new@example.com', 'Ahmad Fauzi');

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'new@example.com',
          subject: expect.stringContaining('Selamat Datang'),
          html: expect.stringContaining('Ahmad Fauzi'),
        })
      );
    });
  });

  describe('sendLogbookValidasiEmail', () => {
    it('should send approval email', async () => {
      await emailService.sendLogbookValidasiEmail(
        'mahasiswa@example.com',
        'Budi Santoso',
        'DIVALIDASI',
        'Bagus, lanjutkan!'
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'mahasiswa@example.com',
          subject: expect.stringContaining('Disetujui'),
          html: expect.stringContaining('disetujui'),
        })
      );
    });

    it('should send rejection email', async () => {
      await emailService.sendLogbookValidasiEmail(
        'mahasiswa@example.com',
        'Budi Santoso',
        'DITOLAK',
        'Revisi data terlebih dahulu'
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Ditolak'),
          html: expect.stringContaining('ditolak'),
        })
      );
    });
  });

  describe('sendJadwalSidangEmail', () => {
    it('should send exam schedule email', async () => {
      const tanggal = new Date('2026-06-20');
      await emailService.sendJadwalSidangEmail(
        'mahasiswa@example.com',
        'Citra Lestari',
        'Seminar Proposal',
        tanggal,
        'Lab Komputer A'
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'mahasiswa@example.com',
          subject: expect.stringContaining('Jadwal'),
          html: expect.stringContaining('Lab Komputer A'),
        })
      );
    });
  });

  describe('sendDokumenApprovalEmail', () => {
    it('should send document approval email', async () => {
      await emailService.sendDokumenApprovalEmail(
        'mahasiswa@example.com',
        'Budi Santoso',
        'Naskah Skripsi',
        'DISETUJUI',
        'Siap untuk revisi'
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'mahasiswa@example.com',
          subject: expect.stringContaining('disetujui'),
          html: expect.stringContaining('disetujui'),
        })
      );
    });
  });

  describe('sendBulkEmail', () => {
    it('should send email to multiple recipients', async () => {
      const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com'];
      await emailService.sendBulkEmail(recipients, 'Announcement', '<p>Important news</p>');

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipients.join(','),
          subject: 'Announcement',
        })
      );
    });
  });

  describe('verifyConnection', () => {
    it('should verify SMTP connection', async () => {
      const isConnected = await emailService.verifyConnection();

      expect(isConnected).toBe(true);
      expect(mockVerify).toHaveBeenCalled();
    });

    it('should return false when verification fails', async () => {
      mockVerify.mockRejectedValueOnce(new Error('Connection refused'));

      const isConnected = await emailService.verifyConnection();

      expect(isConnected).toBe(false);
    });
  });

  describe('stub mode', () => {
    it('should log to console when SMTP not configured', async () => {
      process.env.SMTP_HOST = '';
      const stubService = new EmailService();

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await stubService.sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
