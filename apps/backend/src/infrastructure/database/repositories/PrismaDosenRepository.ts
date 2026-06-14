import { PrismaClient } from '@prisma/client';
import { IDosenRepository } from '../../../domain/interfaces/IRepository';

export class PrismaDosenRepository implements IDosenRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.dosen.findUnique({
      where: { id },
      include: {
        user: true,
        prodi: true,
      },
    });
  }

  async findByNidn(nidn: string) {
    return this.prisma.dosen.findUnique({
      where: { nidn },
      include: {
        user: true,
        prodi: true,
      },
    });
  }

  async findAll(params?: { page?: number; limit?: number; filter?: Record<string, any> }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.dosen.findMany({
        skip,
        take: limit,
        where: params?.filter,
        include: {
          user: true,
          prodi: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dosen.count({ where: params?.filter }),
    ]);

    return { data, total };
  }

  async findPembimbing() {
    return this.prisma.dosen.findMany({
      where: { isPembimbing: true },
      include: {
        user: true,
        prodi: true,
      },
    });
  }

  async findPenguji() {
    return this.prisma.dosen.findMany({
      where: { isPenguji: true },
      include: {
        user: true,
        prodi: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.dosen.create({
      data,
      include: {
        user: true,
        prodi: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.dosen.update({
      where: { id },
      data,
      include: {
        user: true,
        prodi: true,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.dosen.delete({ where: { id } });
  }
}