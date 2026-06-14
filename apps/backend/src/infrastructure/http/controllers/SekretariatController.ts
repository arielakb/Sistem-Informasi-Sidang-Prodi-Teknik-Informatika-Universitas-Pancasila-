import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { prisma } from '../../config/database';

export class SekretariatController extends BaseController {
  getAllMahasiswa = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return prisma.mahasiswa.findMany({
        include: {
          user: true,
          prodi: true,
          pembimbing1: true,
          pembimbing2: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  };

  getAllDosen = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return prisma.dosen.findMany({
        include: {
          user: true,
          prodi: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  };

  getPesertaMKSpesial = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      // MK Spesial = mahasiswa yang sedang sidang (seminar, komprehensif, skripsi)
      return prisma.mahasiswa.findMany({
        where: {
          statusSkripsi: {
            in: ['SEMINAR_PROPOSAL', 'SIDANG_KOMPREHENSIF', 'SIDANG_SKRIPSI'],
          },
        },
        include: {
          prodi: true,
          pembimbing1: true,
          jadwalSidang: {
            include: { ruangan: true },
          },
        },
      });
    });
  };
}