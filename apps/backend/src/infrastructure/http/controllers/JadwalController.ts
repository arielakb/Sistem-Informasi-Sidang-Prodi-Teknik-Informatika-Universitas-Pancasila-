import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { JadwalkanSidangUseCase } from '../../../application/use-cases/jadwal/JadwalkanSidangUseCase';
import { prisma } from '../../config/database';

export class JadwalController extends BaseController {
  constructor(private jadwalkanSidangUseCase: JadwalkanSidangUseCase) {
    super();
  }

  jadwalkanSidang = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.jadwalkanSidangUseCase.execute({
        jenisSidang: req.body.jenisSidang,
        mahasiswaId: req.body.mahasiswaId,
        tanggal: new Date(req.body.tanggal),
        waktuMulai: new Date(req.body.waktuMulai),
        waktuSelesai: new Date(req.body.waktuSelesai),
        ruanganId: req.body.ruanganId,
        penguji1Id: req.body.penguji1Id,
        penguji2Id: req.body.penguji2Id,
        penguji3Id: req.body.penguji3Id,
        linkMeeting: req.body.linkMeeting,
      });
    });
  };

  getAllJadwal = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return prisma.jadwalSidang.findMany({
        include: {
          mahasiswa: true,
          ruangan: true,
          penguji1: true,
        },
        orderBy: { tanggal: 'desc' },
      });
    });
  };

  getJadwalByMahasiswa = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return prisma.jadwalSidang.findMany({
        where: { mahasiswaId: req.params.mahasiswaId },
        include: {
          mahasiswa: true,
          ruangan: true,
          penguji1: true,
        },
        orderBy: { tanggal: 'desc' },
      });
    });
  };
}