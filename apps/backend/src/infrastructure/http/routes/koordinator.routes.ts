import { Router, IRouter } from 'express';
import { KoordinatorController } from '../controllers/KoordinatorController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';
import { PenugasanPembimbingUseCase } from '../../../application/use-cases/koordinator/PenugasanPembimbingUseCase';
import { DashboardAkreditasiUseCase } from '../../../application/use-cases/koordinator/DashboardAkreditasiUseCase';
import { LaporanKinerjaUseCase } from '../../../application/use-cases/koordinator/LaporanKinerjaUseCase';
import { ExportLaporanExcelUseCase } from '../../../application/use-cases/koordinator/ExportLaporanExcelUseCase';
import { ExcelExportService } from '../../external-services/ExcelExportService';
import { prisma } from '../../config/database';

const router: IRouter = Router();

const penugasanPembimbingUseCase = new PenugasanPembimbingUseCase(prisma);
const dashboardAkreditasiUseCase = new DashboardAkreditasiUseCase(prisma);
const laporanKinerjaUseCase = new LaporanKinerjaUseCase(prisma);
const excelExportService = new ExcelExportService();
const exportLaporanExcelUseCase = new ExportLaporanExcelUseCase(excelExportService, prisma);

const koordinatorController = new KoordinatorController(
  penugasanPembimbingUseCase,
  dashboardAkreditasiUseCase,
  laporanKinerjaUseCase,
  exportLaporanExcelUseCase
);

router.use(AuthMiddleware, RoleMiddleware(['KAPRODI', 'ADMIN', 'ADMIN_AKADEMIK']));

router.post('/penugasan-pembimbing/:mahasiswaId', koordinatorController.penugasanPembimbing);
router.get('/dashboard-akreditasi', koordinatorController.dashboardAkreditasi);
router.get('/laporan-kinerja', koordinatorController.laporanKinerja);
router.get('/export', koordinatorController.exportLaporan);

export default router;
