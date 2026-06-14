import { Router, IRouter } from 'express';
import { SekretariatController } from '../controllers/SekretariatController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';

const router: IRouter = Router();
const sekretariatController = new SekretariatController();

router.use(AuthMiddleware, RoleMiddleware(['SEKRETARIAT', 'ADMIN', 'ADMIN_AKADEMIK']));

router.get('/mahasiswa', sekretariatController.getAllMahasiswa);
router.get('/dosen', sekretariatController.getAllDosen);
router.get('/mk-spesial', sekretariatController.getPesertaMKSpesial);

export default router;