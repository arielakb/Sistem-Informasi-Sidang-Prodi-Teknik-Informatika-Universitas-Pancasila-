import { Router, IRouter } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';
import { CreateUserUseCase } from '../../../application/use-cases/admin/CreateUserUseCase';
import { GetAllUsersUseCase } from '../../../application/use-cases/admin/GetAllUsersUseCase';
import { CreatePengumumanUseCase } from '../../../application/use-cases/admin/CreatePengumumanUseCase';
import { SetDeadlineUseCase } from '../../../application/use-cases/admin/SetDeadlineUseCase';
import { SyncApiKampusUseCase } from '../../../application/use-cases/admin/SyncApiKampusUseCase';
import {
  GetAllPengumumanUseCase,
  GetPengumumanByIdUseCase,
  UpdatePengumumanUseCase,
  DeletePengumumanUseCase,
  PublishPengumumanUseCase,
} from '../../../application/use-cases/admin/PengumumanUseCases';
import { prisma } from '../../config/database';
import multer from 'multer';

const upload = multer();

const router: IRouter = Router();

const createUserUseCase = new CreateUserUseCase(prisma);
const getAllUsersUseCase = new GetAllUsersUseCase(prisma);
const createPengumumanUseCase = new CreatePengumumanUseCase(prisma);
const getAllPengumumanUseCase = new GetAllPengumumanUseCase(prisma);
const getPengumumanByIdUseCase = new GetPengumumanByIdUseCase(prisma);
const updatePengumumanUseCase = new UpdatePengumumanUseCase(prisma);
const deletePengumumanUseCase = new DeletePengumumanUseCase(prisma);
const publishPengumumanUseCase = new PublishPengumumanUseCase(prisma);
const setDeadlineUseCase = new SetDeadlineUseCase(prisma);
const syncApiKampusUseCase = new SyncApiKampusUseCase(prisma);

const adminController = new AdminController(
  createUserUseCase,
  getAllUsersUseCase,
  createPengumumanUseCase,
  getAllPengumumanUseCase,
  getPengumumanByIdUseCase,
  updatePengumumanUseCase,
  deletePengumumanUseCase,
  publishPengumumanUseCase,
  setDeadlineUseCase,
  syncApiKampusUseCase
);

router.use(AuthMiddleware, RoleMiddleware(['ADMIN', 'ADMIN_AKADEMIK']));

// User management
router.post('/users', adminController.createUser);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// Pengumuman (Announcements) - Full CRUD
router.post('/pengumuman', adminController.createPengumuman);
router.get('/pengumuman', adminController.getAllPengumuman);
router.get('/pengumuman/:id', adminController.getPengumumanById);
router.patch('/pengumuman/:id', adminController.updatePengumuman);
router.delete('/pengumuman/:id', adminController.deletePengumuman);
router.post('/pengumuman/:id/publish', adminController.publishPengumuman);

// Deadline
router.post('/deadline', adminController.setDeadline);
router.get('/deadline', adminController.getAllDeadline);

// Sync API Kampus
router.post('/sync/:type', adminController.syncApiKampus);

// CSV import (upload file field name: file)
router.post('/import-csv', upload.single('file'), adminController.importCsv);

export default router;
