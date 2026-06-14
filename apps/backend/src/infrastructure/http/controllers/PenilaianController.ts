import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { IsiPenilaianUseCase } from '../../../application/use-cases/penilaian/IsiPenilaianUseCase';
import { prisma } from '../../config/database';

export class PenilaianController extends BaseController {
  constructor(private isiPenilaianUseCase: IsiPenilaianUseCase) {
    super();
  }

  isiPenilaian = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.isiPenilaianUseCase.execute({
        jadwalSidangId: req.params.jadwalId,
        dosenId: this.getUserId(req),
        mahasiswaId: req.body.mahasiswaId,
        nilaiPresentasi: req.body.nilaiPresentasi,
        nilaiMateri: req.body.nilaiMateri,
        nilaiTeknik: req.body.nilaiTeknik,
        catatan: req.body.catatan,
      });
    });
  };

  getHistoriPenilaian = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return prisma.penilaian.findMany({
        where: { dosenId: this.getUserId(req) },
        include: {
          mahasiswa: true,
          jadwalSidang: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  };
}