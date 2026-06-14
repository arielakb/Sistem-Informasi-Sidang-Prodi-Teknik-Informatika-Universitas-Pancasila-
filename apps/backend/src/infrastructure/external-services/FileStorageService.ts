import * as fs from 'fs';
import * as path from 'path';
import { env } from '../config/env';

export interface StoredFile {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

export class FileStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = env.UPLOAD_DIR || './uploads';
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    const dirs = [
      this.uploadDir,
      path.join(this.uploadDir, 'logbook'),
      path.join(this.uploadDir, 'berkas-sidang'),
      path.join(this.uploadDir, 'berkas-final'),
      path.join(this.uploadDir, 'dokumen'),
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Simpan file dari multer upload ke folder tujuan
   */
  saveFile(tempPath: string, category: string, originalName: string): StoredFile {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const safeName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${safeName}_${timestamp}${ext}`;
    const destDir = path.join(this.uploadDir, category);
    const destPath = path.join(destDir, fileName);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.renameSync(tempPath, destPath);
    const stats = fs.statSync(destPath);

    return {
      fileName,
      filePath: destPath,
      fileSize: stats.size,
      mimeType: this.getMimeType(ext),
      url: `/uploads/${category}/${fileName}`,
    };
  }

  /**
   * Hapus file
   */
  deleteFile(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Cek apakah file ada
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Get ukuran file dalam bytes
   */
  getFileSize(filePath: string): number {
    try {
      return fs.statSync(filePath).size;
    } catch {
      return 0;
    }
  }

  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  }
}

export const fileStorageService = new FileStorageService();
