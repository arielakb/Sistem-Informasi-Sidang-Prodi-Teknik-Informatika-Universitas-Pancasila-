import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { PenugasanPembimbingUseCase } from '../../../application/use-cases/koordinator/PenugasanPembimbingUseCase';
import { DashboardAkreditasiUseCase } from '../../../application/use-cases/koordinator/DashboardAkreditasiUseCase';
import { LaporanKinerjaUseCase } from '../../../application/use-cases/koordinator/LaporanKinerjaUseCase';
import { ExportLaporanExcelUseCase } from '../../../application/use-cases/koordinator/ExportLaporanExcelUseCase';

export class KoordinatorController extends BaseController {
  constructor(
    private penugasanPembimbingUseCase: PenugasanPembimbingUseCase,
    private dashboardAkreditasiUseCase: DashboardAkreditasiUseCase,
    private laporanKinerjaUseCase: LaporanKinerjaUseCase,
    private exportLaporanExcelUseCase: ExportLaporanExcelUseCase
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

  exportLaporan = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const type = req.query.type as string;
      const filters = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        prodiId: req.query.prodiId as string,
        status: req.query.status as string,
      };

      const filepath = await this.exportLaporanExcelUseCase.execute({
        type: type as 'attendance' | 'grades' | 'progress' | 'schedule' | 'statistics',
        filters,
      });

      res.download(filepath);
    });
  };
}