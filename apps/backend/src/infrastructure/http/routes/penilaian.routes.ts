import { Router, IRouter } from 'express';
import { PenilaianController } from '../controllers/PenilaianController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';
import { IsiPenilaianUseCase } from '../../../application/use-cases/penilaian/IsiPenilaianUseCase';
import { prisma } from '../../config/database';

const router: IRouter = Router();

const isiPenilaianUseCase = new IsiPenilaianUseCase(prisma);
const penilaianController = new PenilaianController(isiPenilaianUseCase);

router.use(AuthMiddleware);

router.post('/:jadwalId', RoleMiddleware(['DOSEN_PENGUJI']), penilaianController.isiPenilaian);
router.get('/histori', RoleMiddleware(['DOSEN_PENGUJI']), penilaianController.getHistoriPenilaian);

export default router;