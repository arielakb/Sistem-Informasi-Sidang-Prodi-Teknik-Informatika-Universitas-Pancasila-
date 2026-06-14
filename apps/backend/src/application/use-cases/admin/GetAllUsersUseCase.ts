import { PrismaClient } from '@prisma/client';

export class GetAllUsersUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(params?: { page?: number; limit?: number; role?: string; search?: string }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (params?.role) {
      where.role = params.role;
    }
    
    if (params?.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { mahasiswa: { nama: { contains: params.search, mode: 'insensitive' } } },
        { dosen: { nama: { contains: params.search, mode: 'insensitive' } } },
        { adminProfile: { nama: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where,
        include: {
          mahasiswa: { include: { prodi: true } },
          dosen: { include: { prodi: true } },
          adminProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}