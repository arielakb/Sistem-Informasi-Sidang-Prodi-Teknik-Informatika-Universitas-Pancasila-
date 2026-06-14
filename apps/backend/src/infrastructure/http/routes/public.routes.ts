import { Router, IRouter } from 'express';
import { prisma } from '../../config/database';
import { ApiResponse } from '../../utils/ApiResponse';

const router: IRouter = Router();

// Jadwal sidang publik - tanpa login
router.get('/jadwal', async (req, res) => {
  const { status, search, prodi } = req.query;
  
  const where: any = {};
  
  if (status) {
    where.status = status;
  }
  
  if (prodi) {
    where.mahasiswa = {
      prodi: {
        kode: prodi,
      },
    };
  }

  const jadwal = await prisma.jadwalSidang.findMany({
    where,
    include: {
      mahasiswa: {
        include: {
          prodi: true,
          pembimbing1: true,
        },
      },
      ruangan: true,
    },
    orderBy: { tanggal: 'desc' },
  });

  // Filter by search if provided
  let result = jadwal;
  if (search) {
    const searchLower = (search as string).toLowerCase();
    result = jadwal.filter(j => 
      j.mahasiswa.nama.toLowerCase().includes(searchLower) ||
      j.mahasiswa.pembimbing1?.nama.toLowerCase().includes(searchLower)
    );
  }

  return ApiResponse.success(res, result);
});

export default router;