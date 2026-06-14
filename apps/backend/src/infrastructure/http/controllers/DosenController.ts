import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { ValidasiLogbookUseCase } from '../../../application/use-cases/dosen/ValidasiLogbookUseCase';
import { PersetujuanKelayakanUseCase } from '../../../application/use-cases/dosen/PersetujuanKelayakanUseCase';
import { CatatanRevisiUseCase } from '../../../application/use-cases/dosen/CatatanRevisiUseCase';
import { ApproveBerkasFinalUseCase } from '../../../application/use-cases/dosen/ApproveBerkasFinalUseCase';
import { ApproveNaskahRevisiUseCase } from '../../../application/use-cases/dosen/ApproveNaskahRevisiUseCase';
import { PrismaMahasiswaRepository } from '../../database/repositories/PrismaMahasiswaRepository';
import { prisma } from '../../config/database';

export class DosenController extends BaseController {
  constructor(
    private validasiLogbookUseCase: ValidasiLogbookUseCase,
    private persetujuanKelayakanUseCase: PersetujuanKelayakanUseCase,
    private catatanRevisiUseCase: CatatanRevisiUseCase,
    private approveBerkasFinalUseCase: ApproveBerkasFinalUseCase,
    private approveNaskahRevisiUseCase: ApproveNaskahRevisiUseCase,
    private mahasiswaRepository: PrismaMahasiswaRepository
  ) {
    super();
  }

  validasiLogbook = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.validasiLogbookUseCase.execute({
        logbookId: req.params.id,
        dosenId: this.getUserId(req),
        status: req.body.status,
        catatan: req.body.catatan,
      });
    });
  };

  persetujuanKelayakan = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.persetujuanKelayakanUseCase.execute({
        mahasiswaId: req.params.mahasiswaId,
        dosenId: this.getUserId(req),
        jenisSidang: req.body.jenisSidang,
        disetujui: req.body.disetujui,
        catatan: req.body.catatan,
      });
    });
  };

  catatanRevisi = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.catatanRevisiUseCase.execute({
        mahasiswaId: req.params.mahasiswaId,
        dosenId: this.getUserId(req),
        jadwalSidangId: req.body.jadwalSidangId,
        catatan: req.body.catatan,
        fileRevisi: req.body.fileRevisi,
      });
    });
  };

  approveBerkasFinal = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.approveBerkasFinalUseCase.execute({
        berkasFinalId: req.params.id,
        dosenId: this.getUserId(req),
        status: req.body.status,
        catatan: req.body.catatan,
      });
    });
  };

  approveNaskahRevisi = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.approveNaskahRevisiUseCase.execute({
        mahasiswaId: req.params.mahasiswaId,
        dosenId: this.getUserId(req),
        fileNaskahRevisi: req.body.fileNaskahRevisi,
      });
    });
  };

  getMahasiswaBimbingan = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.mahasiswaRepository.findByPembimbing(this.getUserId(req));
    });
  };
}