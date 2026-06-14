import { PrismaClient } from '@prisma/client';
import { IMahasiswaRepository } from '../../../domain/interfaces/IRepository';

export class PrismaMahasiswaRepository implements IMahasiswaRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.mahasiswa.findUnique({
      where: { id },
      include: {
        user: true,
        prodi: true,
        pembimbing1: { include: { user: true } },
        pembimbing2: { include: { user: true } },
      },
    });
  }

  async findByNim(nim: string) {
    return this.prisma.mahasiswa.findUnique({
      where: { nim },
      include: {
        user: true,
        prodi: true,
        pembimbing1: true,
        pembimbing2: true,
      },
    });
  }

  async findAll(params?: { page?: number; limit?: number; filter?: Record<string, any> }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.mahasiswa.findMany({
        skip,
        take: limit,
        where: params?.filter,
        include: {
          prodi: true,
          pembimbing1: { include: { user: true } },
          pembimbing2: { include: { user: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mahasiswa.count({ where: params?.filter }),
    ]);

    return { data, total };
  }

  async findByPembimbing(dosenId: string) {
    return this.prisma.mahasiswa.findMany({
      where: {
        OR: [
          { pembimbing1Id: dosenId },
          { pembimbing2Id: dosenId },
        ],
      },
      include: {
        prodi: true,
        logbooks: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  }

  async create(data: any) {
    return this.prisma.mahasiswa.create({
      data,
      include: {
        prodi: true,
        pembimbing1: true,
        pembimbing2: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.mahasiswa.update({
      where: { id },
      data,
      include: {
        prodi: true,
        pembimbing1: true,
        pembimbing2: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.mahasiswa.update({
      where: { id },
      data: { statusSkripsi: status as any },
    });
  }

  async delete(id: string) {
    await this.prisma.mahasiswa.delete({ where: { id } });
  }
}