import { Router, IRouter } from 'express';
import { JadwalController } from '../controllers/JadwalController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';
import { JadwalkanSidangUseCase } from '../../../application/use-cases/jadwal/JadwalkanSidangUseCase';
import { prisma } from '../../config/database';

const router: IRouter = Router();

const jadwalkanSidangUseCase = new JadwalkanSidangUseCase(prisma);
const jadwalController = new JadwalController(jadwalkanSidangUseCase);

router.use(AuthMiddleware);

// Public jadwal (no role restriction for viewing)
router.get('/', jadwalController.getAllJadwal);
router.get('/mahasiswa/:mahasiswaId', jadwalController.getJadwalByMahasiswa);

// Admin/Staf only for creating
router.post('/', RoleMiddleware(['ADMIN', 'ADMIN_AKADEMIK', 'SEKRETARIAT']), jadwalController.jadwalkanSidang);

export default router;