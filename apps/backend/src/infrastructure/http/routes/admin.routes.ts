import { Router, IRouter } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';
import { CreateUserUseCase } from '../../../application/use-cases/admin/CreateUserUseCase';
import { GetAllUsersUseCase } from '../../../application/use-cases/admin/GetAllUsersUseCase';
import { CreatePengumumanUseCase } from '../../../application/use-cases/admin/CreatePengumumanUseCase';
import { SetDeadlineUseCase } from '../../../application/use-cases/admin/SetDeadlineUseCase';
import { SyncApiKampusUseCase } from '../../../application/use-cases/admin/SyncApiKampusUseCase';
import { prisma } from '../../config/database';

const router: IRouter = Router();

const createUserUseCase = new CreateUserUseCase(prisma);
const getAllUsersUseCase = new GetAllUsersUseCase(prisma);
const createPengumumanUseCase = new CreatePengumumanUseCase(prisma);
const setDeadlineUseCase = new SetDeadlineUseCase(prisma);
const syncApiKampusUseCase = new SyncApiKampusUseCase(prisma);

const adminController = new AdminController(
  createUserUseCase,
  getAllUsersUseCase,
  createPengumumanUseCase,
  setDeadlineUseCase,
  syncApiKampusUseCase
);

router.use(AuthMiddleware, RoleMiddleware(['ADMIN', 'ADMIN_AKADEMIK']));

// User management
router.post('/users', adminController.createUser);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// Pengumuman
router.post('/pengumuman', adminController.createPengumuman);
router.get('/pengumuman', adminController.getAllPengumuman);

// Deadline
router.post('/deadline', adminController.setDeadline);
router.get('/deadline', adminController.getAllDeadline);

// Sync API Kampus
router.post('/sync/:type', adminController.syncApiKampus);

export default router;