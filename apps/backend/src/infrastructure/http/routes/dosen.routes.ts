import { Router, IRouter } from 'express';
import { DosenController } from '../controllers/DosenController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';
import { ValidasiLogbookUseCase } from '../../../application/use-cases/dosen/ValidasiLogbookUseCase';
import { PersetujuanKelayakanUseCase } from '../../../application/use-cases/dosen/PersetujuanKelayakanUseCase';
import { CatatanRevisiUseCase } from '../../../application/use-cases/dosen/CatatanRevisiUseCase';
import { ApproveBerkasFinalUseCase } from '../../../application/use-cases/dosen/ApproveBerkasFinalUseCase';
import { ApproveNaskahRevisiUseCase } from '../../../application/use-cases/dosen/ApproveNaskahRevisiUseCase';
import { PrismaMahasiswaRepository } from '../../database/repositories/PrismaMahasiswaRepository';
import { prisma } from '../../config/database';

const router: IRouter = Router();

const mahasiswaRepository = new PrismaMahasiswaRepository(prisma);
const validasiLogbookUseCase = new ValidasiLogbookUseCase(prisma);
const persetujuanKelayakanUseCase = new PersetujuanKelayakanUseCase(prisma);
const catatanRevisiUseCase = new CatatanRevisiUseCase(prisma);
const approveBerkasFinalUseCase = new ApproveBerkasFinalUseCase(prisma);
const approveNaskahRevisiUseCase = new ApproveNaskahRevisiUseCase(prisma);

const dosenController = new DosenController(
  validasiLogbookUseCase,
  persetujuanKelayakanUseCase,
  catatanRevisiUseCase,
  approveBerkasFinalUseCase,
  approveNaskahRevisiUseCase,
  mahasiswaRepository
);

router.use(AuthMiddleware);

// Dosen Pembimbing routes
router.patch('/logbook/:id/validasi', RoleMiddleware(['DOSEN_PEMBIMBING']), dosenController.validasiLogbook);
router.post('/kelayakan/:mahasiswaId', RoleMiddleware(['DOSEN_PEMBIMBING']), dosenController.persetujuanKelayakan);
router.post('/revisi/:mahasiswaId', RoleMiddleware(['DOSEN_PEMBIMBING', 'DOSEN_PENGUJI']), dosenController.catatanRevisi);
router.patch('/berkas-final/:id/approve', RoleMiddleware(['DOSEN_PEMBIMBING']), dosenController.approveBerkasFinal);
router.post('/naskah-revisi/:mahasiswaId/approve', RoleMiddleware(['DOSEN_PEMBIMBING']), dosenController.approveNaskahRevisi);
router.get('/bimbingan', RoleMiddleware(['DOSEN_PEMBIMBING', 'KAPRODI']), dosenController.getMahasiswaBimbingan);

export default router;