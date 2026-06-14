import { Router, IRouter } from 'express';
import { MahasiswaController } from '../controllers/MahasiswaController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { RoleMiddleware } from '../middleware/RoleMiddleware';
import { PengajuanTopikUseCase } from '../../../application/use-cases/mahasiswa/PengajuanTopikUseCase';
import { GetMahasiswaProfileUseCase } from '../../../application/use-cases/mahasiswa/GetMahasiswaProfileUseCase';
import { GetMahasiswaProgresUseCase } from '../../../application/use-cases/mahasiswa/GetMahasiswaProgresUseCase';
import { CreateLogbookUseCase } from '../../../application/use-cases/mahasiswa/CreateLogbookUseCase';
import { UploadBerkasSidangUseCase } from '../../../application/use-cases/mahasiswa/UploadBerkasSidangUseCase';
import { UploadBerkasFinalUseCase } from '../../../application/use-cases/mahasiswa/UploadBerkasFinalUseCase';
import { PeminjamanLabUseCase } from '../../../application/use-cases/mahasiswa/PeminjamanLabUseCase';
import { KodeEtikUseCase } from '../../../application/use-cases/mahasiswa/KodeEtikUseCase';
import { GetJadwalSidangUseCase } from '../../../application/use-cases/mahasiswa/GetJadwalSidangUseCase';
import { PrismaMahasiswaRepository } from '../../database/repositories/PrismaMahasiswaRepository';
import { prisma } from '../../config/database';

const router: IRouter = Router();

const mahasiswaRepository = new PrismaMahasiswaRepository(prisma);
const pengajuanTopikUseCase = new PengajuanTopikUseCase(mahasiswaRepository);
const getProfileUseCase = new GetMahasiswaProfileUseCase(mahasiswaRepository);
const getProgresUseCase = new GetMahasiswaProgresUseCase(mahasiswaRepository);
const createLogbookUseCase = new CreateLogbookUseCase(prisma);
const uploadBerkasSidangUseCase = new UploadBerkasSidangUseCase(prisma);
const uploadBerkasFinalUseCase = new UploadBerkasFinalUseCase(prisma);
const peminjamanLabUseCase = new PeminjamanLabUseCase(prisma);
const kodeEtikUseCase = new KodeEtikUseCase(prisma);
const getJadwalSidangUseCase = new GetJadwalSidangUseCase(prisma);

const mahasiswaController = new MahasiswaController(
  pengajuanTopikUseCase,
  getProfileUseCase,
  getProgresUseCase,
  createLogbookUseCase,
  uploadBerkasSidangUseCase,
  uploadBerkasFinalUseCase,
  peminjamanLabUseCase,
  kodeEtikUseCase,
  getJadwalSidangUseCase,
  mahasiswaRepository
);

router.use(AuthMiddleware);

// Mahasiswa only routes
router.get('/profil', RoleMiddleware(['MAHASISWA']), mahasiswaController.getProfil);
router.post('/topik', RoleMiddleware(['MAHASISWA']), mahasiswaController.pengajuanTopik);
router.get('/progres', RoleMiddleware(['MAHASISWA']), mahasiswaController.getProgres);
router.post('/logbook', RoleMiddleware(['MAHASISWA']), mahasiswaController.createLogbook);
router.post('/berkas-sidang', RoleMiddleware(['MAHASISWA']), mahasiswaController.uploadBerkasSidang);
router.post('/berkas-final', RoleMiddleware(['MAHASISWA']), mahasiswaController.uploadBerkasFinal);
router.post('/peminjaman-lab', RoleMiddleware(['MAHASISWA']), mahasiswaController.peminjamanLab);
router.post('/kode-etik', RoleMiddleware(['MAHASISWA']), mahasiswaController.kodeEtik);
router.get('/jadwal', RoleMiddleware(['MAHASISWA']), mahasiswaController.getJadwal);

// Dosen Pembimbing can view their mahasiswa
router.get('/bimbingan', RoleMiddleware(['DOSEN_PEMBIMBING', 'KAPRODI']), mahasiswaController.getMahasiswaBimbingan);

export default router;