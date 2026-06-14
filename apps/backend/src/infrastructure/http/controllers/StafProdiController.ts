import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { prisma } from '../../config/database';

export class StafProdiController extends BaseController {
  getAgenda = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return prisma.jadwalSidang.findMany({
        include: {
          mahasiswa: true,
          ruangan: true,
        },
        orderBy: { tanggal: 'asc' },
      });
    });
  };

  getInformasiProdi = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const prodiId = req.query.prodiId as string;
      
      const [totalMahasiswa, totalDosen, totalJadwal] = await Promise.all([
        prisma.mahasiswa.count({ where: prodiId ? { prodiId } : {} }),
        prisma.dosen.count({ where: prodiId ? { prodiId } : {} }),
        prisma.jadwalSidang.count({ where: prodiId ? { mahasiswa: { prodiId } } : {} }),
      ]);

      return {
        totalMahasiswa,
        totalDosen,
        totalJadwal,
        prodiId: prodiId || 'all',
      };
    });
  };
}