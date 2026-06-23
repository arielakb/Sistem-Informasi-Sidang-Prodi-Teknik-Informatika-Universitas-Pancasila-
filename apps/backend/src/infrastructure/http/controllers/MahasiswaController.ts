import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { PengajuanTopikUseCase } from '../../../application/use-cases/mahasiswa/PengajuanTopikUseCase';
import { GetMahasiswaProfileUseCase } from '../../../application/use-cases/mahasiswa/GetMahasiswaProfileUseCase';
import { GetMahasiswaProgresUseCase } from '../../../application/use-cases/mahasiswa/GetMahasiswaProgresUseCase';
import { CreateLogbookUseCase } from '../../../application/use-cases/mahasiswa/CreateLogbookUseCase';
import { UploadBerkasSidangUseCase } from '../../../application/use-cases/mahasiswa/UploadBerkasSidangUseCase';
import { UploadBerkasFinalUseCase } from '../../../application/use-cases/mahasiswa/UploadBerkasFinalUseCase';
import { PeminjamanLabUseCase } from '../../../application/use-cases/mahasiswa/PeminjamanLabUseCase';
import { KodeEtikUseCase } from '../../../application/use-cases/mahasiswa/KodeEtikUseCase';
import { GetJadwalSidangUseCase } from '../../../application/use-cases/mahasiswa/GetJadwalSidangUseCase';
import { IMahasiswaRepository } from '../../../domain/interfaces/IRepository';
import { prisma } from '../../config/database';
import FileService from '../../external-services/FileService';
import * as fs from 'fs';

export class MahasiswaController extends BaseController {
  constructor(
    private pengajuanTopikUseCase: PengajuanTopikUseCase,
    private getProfileUseCase: GetMahasiswaProfileUseCase,
    private getProgresUseCase: GetMahasiswaProgresUseCase,
    private createLogbookUseCase: CreateLogbookUseCase,
    private uploadBerkasSidangUseCase: UploadBerkasSidangUseCase,
    private uploadBerkasFinalUseCase: UploadBerkasFinalUseCase,
    private peminjamanLabUseCase: PeminjamanLabUseCase,
    private kodeEtikUseCase: KodeEtikUseCase,
    private getJadwalSidangUseCase: GetJadwalSidangUseCase,
    private mahasiswaRepository: IMahasiswaRepository
  ) {
    super();
  }

  getProfil = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.getProfileUseCase.execute(this.getUserId(req));
    });
  };

  pengajuanTopik = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.pengajuanTopikUseCase.execute({
        mahasiswaId: req.body.mahasiswaId,
        topik: req.body.topik,
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
      });
    });
  };

  getProgres = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const mahasiswa = await this.mahasiswaRepository.findAll({
        filter: { userId: this.getUserId(req) },
        limit: 1,
      });
      
      if (!mahasiswa.data.length) {
        throw new Error('Mahasiswa tidak ditemukan');
      }
      
      return this.getProgresUseCase.execute(mahasiswa.data[0].id);
    });
  };

  createLogbook = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      let filePath = req.body.fileBukti;
      if (req.file) {
        // multer may have stored file on disk; read buffer then use FileService
        const file = req.file as Express.Multer.File & { path?: string };
        let buffer: Buffer | undefined = file.buffer;
        if (!buffer && file.path) buffer = fs.readFileSync(file.path);
        if (buffer) {
          filePath = await FileService.saveFile(buffer, file.originalname, 'logbook');
          // remove multer temp file if exists
          if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        }
      }

      return this.createLogbookUseCase.execute({
        mahasiswaId: req.body.mahasiswaId,
        dosenId: req.body.dosenId,
        tanggal: new Date(req.body.tanggal),
        topikBahasan: req.body.topikBahasan,
        hasilBimbingan: req.body.hasilBimbingan,
        fileBukti: filePath,
      });
    });
  };

  uploadBerkasSidang = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      let filePath = req.body.filePath;
      const file = req.file as Express.Multer.File & { path?: string } | undefined;
      if (file) {
        let buffer: Buffer | undefined = (file as any).buffer;
        if (!buffer && file.path) buffer = fs.readFileSync(file.path);
        if (buffer) {
          filePath = await FileService.saveFile(buffer, file.originalname, 'berkas_sidang');
          if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        } else if (file.path) {
          // fallback to disk path
          filePath = file.path;
        }
      }

      return this.uploadBerkasSidangUseCase.execute({
        mahasiswaId: req.body.mahasiswaId,
        jadwalSidangId: req.body.jadwalSidangId,
        jenisBerkas: req.body.jenisBerkas,
        filePath,
      });
    });
  };

uploadBerkasFinal = async (req: Request, res: Response, next: NextFunction) => {
  await this.handleRequest(req, res, next, async () => {
    const files = req.files as Record<string, Express.Multer.File[]>;

    const resolveFile = async (f?: Express.Multer.File) => {
      if (!f) return undefined;
      const file = f as Express.Multer.File & { path?: string };
      let buffer: Buffer | undefined = (file as any).buffer;
      if (!buffer && file.path) buffer = fs.readFileSync(file.path);
      if (buffer) {
        const saved = await FileService.saveFile(buffer, file.originalname, 'berkas_final');
        if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return saved;
      }
      return file.path || undefined;
    };

    const fileNaskah = await resolveFile(files?.naskah?.[0]);
    const filePengesahan = await resolveFile(files?.pengesahan?.[0]);
    const fileBerkasLain = await resolveFile(files?.berkasLain?.[0]);

    return this.uploadBerkasFinalUseCase.execute({
      mahasiswaId: req.body.mahasiswaId,
      fileNaskah: fileNaskah || req.body.fileNaskah,
      filePengesahan: filePengesahan || req.body.filePengesahan,
      fileBerkasLain: fileBerkasLain || req.body.fileBerkasLain,
    });
  });
};

  peminjamanLab = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.peminjamanLabUseCase.execute({
        mahasiswaId: req.body.mahasiswaId,
        ruanganId: req.body.ruanganId,
        tanggalPinjam: new Date(req.body.tanggalPinjam),
        waktuMulai: new Date(req.body.waktuMulai),
        waktuSelesai: new Date(req.body.waktuSelesai),
        keperluan: req.body.keperluan,
      });
    });
  };

  kodeEtik = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const mahasiswa = await this.mahasiswaRepository.findAll({
        filter: { userId: this.getUserId(req) },
        limit: 1,
      });
      
      if (!mahasiswa.data.length) {
        throw new Error('Mahasiswa tidak ditemukan');
      }
      
      return this.kodeEtikUseCase.execute(mahasiswa.data[0].id);
    });
  };

  getJadwal = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const mahasiswa = await this.mahasiswaRepository.findAll({
        filter: { userId: this.getUserId(req) },
        limit: 1,
      });
      
      if (!mahasiswa.data.length) {
        throw new Error('Mahasiswa tidak ditemukan');
      }
      
      return this.getJadwalSidangUseCase.execute(mahasiswa.data[0].id);
    });
  };

  getMahasiswaBimbingan = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const { dosenId } = req.query;
      return this.mahasiswaRepository.findByPembimbing(dosenId as string);
    });
  };
}