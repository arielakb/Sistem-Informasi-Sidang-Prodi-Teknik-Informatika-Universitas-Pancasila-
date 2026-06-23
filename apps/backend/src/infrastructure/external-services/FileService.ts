import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ApiError } from '../utils/ApiError';

export class FileService {
  private uploadDir: string;
  private maxFileSize: number = 10 * 1024 * 1024; // 10MB

  constructor(uploadDir: string = './uploads') {
    this.uploadDir = uploadDir;
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Save uploaded file
   * @param fileBuffer - File buffer from multer
   * @param originalName - Original filename
   * @param category - Category folder (berkas_sidang, berkas_final, logbook, etc)
   * @returns Relative path to stored file
   */
  async saveFile(
    fileBuffer: Buffer,
    originalName: string,
    category: string = 'misc'
  ): Promise<string> {
    try {
      // Validate file size
      if (fileBuffer.length > this.maxFileSize) {
        throw new ApiError(413, `File size exceeds maximum limit of 10MB`);
      }

      // Validate file extension (allow common formats)
      const ext = path.extname(originalName).toLowerCase();
      const allowedExts = ['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.jpg', '.jpeg', '.png'];
      if (!allowedExts.includes(ext)) {
        throw new ApiError(400, `File type not allowed. Allowed types: ${allowedExts.join(', ')}`);
      }

      // Create category directory
      const categoryDir = path.join(this.uploadDir, category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const randomStr = crypto.randomBytes(4).toString('hex');
      const filename = `${timestamp}-${randomStr}${ext}`;
      const filePath = path.join(categoryDir, filename);

      // Save file
      fs.writeFileSync(filePath, fileBuffer);

      // Return relative path from project root for storage in DB
      return `uploads/${category}/${filename}`;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to save file');
    }
  }

  /**
   * Get file content for download
   * @param relativePath - Relative path stored in DB
   * @returns File buffer
   */
  async getFile(relativePath: string): Promise<Buffer> {
    try {
      const fullPath = path.join(this.uploadDir, relativePath.replace('uploads/', ''));

      if (!fs.existsSync(fullPath)) {
        throw new ApiError(404, 'File not found');
      }

      // Security: prevent directory traversal
      const resolvedPath = path.resolve(fullPath);
      const resolvedUploadDir = path.resolve(this.uploadDir);
      if (!resolvedPath.startsWith(resolvedUploadDir)) {
        throw new ApiError(403, 'Access denied');
      }

      return fs.readFileSync(fullPath);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to read file');
    }
  }

  /**
   * Delete file
   * @param relativePath - Relative path stored in DB
   */
  async deleteFile(relativePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.uploadDir, relativePath.replace('uploads/', ''));

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      throw new ApiError(500, 'Failed to delete file');
    }
  }

  /**
   * Get file info (size, type, etc)
   */
  async getFileInfo(relativePath: string): Promise<{ size: number; mimeType: string }> {
    try {
      const fullPath = path.join(this.uploadDir, relativePath.replace('uploads/', ''));

      if (!fs.existsSync(fullPath)) {
        throw new ApiError(404, 'File not found');
      }

      const stats = fs.statSync(fullPath);
      const ext = path.extname(fullPath);

      const mimeTypes: { [key: string]: string } = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xls': 'application/vnd.ms-excel',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
      };

      return {
        size: stats.size,
        mimeType: mimeTypes[ext] || 'application/octet-stream',
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Failed to get file info');
    }
  }
}

export default new FileService();
