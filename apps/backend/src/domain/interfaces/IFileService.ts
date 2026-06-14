export interface StoredFileInfo {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

export interface IFileService {
  saveFile(tempPath: string, category: string, originalName: string): StoredFileInfo;
  deleteFile(filePath: string): boolean;
  fileExists(filePath: string): boolean;
  getFileSize(filePath: string): number;
}
