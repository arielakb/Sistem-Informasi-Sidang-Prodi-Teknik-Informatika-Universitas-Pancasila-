import { Router, IRouter } from 'express';
import authRoutes from './auth.routes';
import mahasiswaRoutes from './mahasiswa.routes';
import dosenRoutes from './dosen.routes';
import penilaianRoutes from './penilaian.routes';
import koordinatorRoutes from './koordinator.routes';
import jadwalRoutes from './jadwal.routes';
import adminRoutes from './admin.routes';
import stafProdiRoutes from './staf-prodi.routes';
import sekretariatRoutes from './sekretariat.routes';

const router: IRouter = Router();

router.use('/auth', authRoutes);
router.use('/mahasiswa', mahasiswaRoutes);
router.use('/dosen', dosenRoutes);
router.use('/penilaian', penilaianRoutes);
router.use('/koordinator', koordinatorRoutes);
router.use('/jadwal', jadwalRoutes);
router.use('/admin', adminRoutes);
router.use('/staf-prodi', stafProdiRoutes);
router.use('/sekretariat', sekretariatRoutes);

export default router;