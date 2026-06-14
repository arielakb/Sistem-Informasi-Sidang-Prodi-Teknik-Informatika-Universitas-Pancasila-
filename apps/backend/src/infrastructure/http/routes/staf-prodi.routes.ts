import { Router, IRouter } from 'express';
import { StafProdiController } from '../controllers/StafProdiController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';

const router: IRouter = Router();
const stafProdiController = new StafProdiController();

router.use(AuthMiddleware, RoleMiddleware(['STAF_PRODI', 'ADMIN']));

router.get('/agenda', stafProdiController.getAgenda);
router.get('/informasi', stafProdiController.getInformasiProdi);

export default router;