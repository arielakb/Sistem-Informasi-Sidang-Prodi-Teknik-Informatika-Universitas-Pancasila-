import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { CreateUserUseCase } from '../../../application/use-cases/admin/CreateUserUseCase';
import { GetAllUsersUseCase } from '../../../application/use-cases/admin/GetAllUsersUseCase';
import { CreatePengumumanUseCase } from '../../../application/use-cases/admin/CreatePengumumanUseCase';
import { SetDeadlineUseCase } from '../../../application/use-cases/admin/SetDeadlineUseCase';
import { SyncApiKampusUseCase } from '../../../application/use-cases/admin/SyncApiKampusUseCase';
import { prisma } from '../../config/database';

export class AdminController extends BaseController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private createPengumumanUseCase: CreatePengumumanUseCase,
    private setDeadlineUseCase: SetDeadlineUseCase,
    private syncApiKampusUseCase: SyncApiKampusUseCase
  ) {
    super();
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.createUserUseCase.execute(req.body);
    });
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.getAllUsersUseCase.execute({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        role: req.query.role as string,
        search: req.query.search as string,
      });
    });
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      await prisma.user.delete({ where: { id: req.params.id } });
      return { message: 'User berhasil dihapus' };
    });
  };

  createPengumuman = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.createPengumumanUseCase.execute(req.body);
    });
  };

  getAllPengumuman = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return prisma.pengumuman.findMany({
        where: { isActive: true },
        include: { prodi: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  };

  setDeadline = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.setDeadlineUseCase.execute({
        ...req.body,
        tanggalDeadline: new Date(req.body.tanggalDeadline),
      });
    });
  };

  getAllDeadline = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return prisma.deadline.findMany({
        where: { isActive: true },
        orderBy: { tanggalDeadline: 'asc' },
      });
    });
  };

  syncApiKampus = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.syncApiKampusUseCase.execute(req.params.type as 'mahasiswa' | 'dosen');
    });
  };
}