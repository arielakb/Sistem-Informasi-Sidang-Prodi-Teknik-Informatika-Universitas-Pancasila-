import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
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
import * as bcrypt from 'bcryptjs';
import CSVParserService from '../../external-services/CSVParserService';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class AdminController extends BaseController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
    private createPengumumanUseCase: CreatePengumumanUseCase,
    private getAllPengumumanUseCase: GetAllPengumumanUseCase,
    private getPengumumanByIdUseCase: GetPengumumanByIdUseCase,
    private updatePengumumanUseCase: UpdatePengumumanUseCase,
    private deletePengumumanUseCase: DeletePengumumanUseCase,
    private publishPengumumanUseCase: PublishPengumumanUseCase,
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
      return this.getAllPengumumanUseCase.execute({
        status: req.query.status as any,
        targetRole: req.query.targetRole as string,
        prodiId: req.query.prodiId as string,
        limit: Number(req.query.limit) || 10,
        offset: Number(req.query.offset) || 0,
      });
    });
  };

  getPengumumanById = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.getPengumumanByIdUseCase.execute(req.params.id);
    });
  };

  updatePengumuman = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.updatePengumumanUseCase.execute(req.params.id, req.body);
    });
  };

  deletePengumuman = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.deletePengumumanUseCase.execute(req.params.id);
    });
  };

  publishPengumuman = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      return this.publishPengumumanUseCase.execute(req.params.id);
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

  importCsv = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      if (!req.file) throw new ApiError(400, 'File CSV wajib diupload');

      const rows = await CSVParserService.parse(req.file.buffer);
      let created = 0;

      for (const row of rows) {
        // Expecting CSV with headers: type,email,password,nim,nama,role,prodi,angkatan,nidn,jabatan
        const type = (row.type || '').toLowerCase();
        const email = row.email;
        const password = row.password || 'changeme123';

        if (!email) continue;

        const hashed = await bcrypt.hash(password, 10);

        if (type === 'mahasiswa' || row.role === 'MAHASISWA') {
          const prodi = row.prodi || 'TI';
          const prodiRec = await prisma.prodi.findFirst({ where: { kode: { contains: prodi } } })
            || (await prisma.prodi.findFirst());

          await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              passwordHash: hashed,
              role: 'MAHASISWA',
              mahasiswa: {
                create: {
                  nim: row.nim || `NIM-${Date.now()}`,
                  nama: row.nama || email.split('@')[0],
                  prodiId: prodiRec!.id,
                  angkatan: Number(row.angkatan) || 2021,
                  statusSkripsi: 'PENGAJUAN_TOPIK',
                },
              },
            },
          });
          created++;
        } else if (type === 'dosen' || row.role === 'DOSEN_PEMBIMBING' || row.role === 'DOSEN_PENGUJI') {
          const prodi = row.prodi || 'TI';
          const prodiRec = await prisma.prodi.findFirst({ where: { kode: { contains: prodi } } })
            || (await prisma.prodi.findFirst());

          await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              passwordHash: hashed,
              role: row.role || 'DOSEN_PEMBIMBING',
              dosen: {
                create: {
                  nidn: row.nidn || `NIDN-${Date.now()}`,
                  nama: row.nama || email.split('@')[0],
                  prodiId: prodiRec!.id,
                  jabatan: row.jabatan || 'Dosen',
                },
              },
            },
          });
          created++;
        } else {
          // generic user
          await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              passwordHash: hashed,
              role: row.role || 'PUBLIC',
            },
          });
          created++;
        }
      }

      return { message: `Imported ${created} records` };
    });
  };
}