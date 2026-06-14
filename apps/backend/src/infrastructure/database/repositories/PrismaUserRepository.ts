import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../domain/interfaces/IRepository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        mahasiswa: true,
        dosen: true,
        adminProfile: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        mahasiswa: true,
        dosen: true,
        adminProfile: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.user.create({
      data,
      include: {
        mahasiswa: true,
        dosen: true,
        adminProfile: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        mahasiswa: true,
        dosen: true,
        adminProfile: true,
      },
    });
  }
}