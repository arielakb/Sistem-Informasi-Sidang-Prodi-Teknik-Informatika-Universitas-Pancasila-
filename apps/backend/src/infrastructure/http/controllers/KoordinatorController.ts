import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { PenugasanPembimbingUseCase } from '../../../application/use-cases/koordinator/PenugasanPembimbingUseCase';
import { DashboardAkreditasiUseCase } from '../../../application/use-cases/koordinator/DashboardAkreditasiUseCase';
import { LaporanKinerjaUseCase } from '../../../application/use-cases/koordinator/LaporanKinerjaUseCase';

export class KoordinatorController extends BaseController {
  constructor(
    private penugasanPembimbingUseCase: PenugasanPembimbingUseCase,
    private dashboardAkreditasiUseCase: DashboardAkreditasiUseCase,
    private laporanKinerjaUseCase: LaporanKinerjaUseCase
  ) {
    super();
  }

  penugasanPembimbing = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.penugasanPembimbingUseCase.execute({
        mahasiswaId: req.params.mahasiswaId,
        pembimbing1Id: req.body.pembimbing1Id,
        pembimbing2Id: req.body.pembimbing2Id,
      });
    });
  };

  dashboardAkreditasi = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.dashboardAkreditasiUseCase.execute();
    });
  };

  laporanKinerja = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.laporanKinerjaUseCase.execute(req.query.prodiId as string);
    });
  };
}