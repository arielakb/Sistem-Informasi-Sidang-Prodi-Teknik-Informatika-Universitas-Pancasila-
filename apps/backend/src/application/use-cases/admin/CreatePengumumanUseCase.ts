import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface CreatePengumumanDTO {
  prodiId: string;
  judul: string;
  konten: string;
  targetRole?: string;
}

export class CreatePengumumanUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: CreatePengumumanDTO) {
    const pengumuman = await this.prisma.pengumuman.create({
      data: {
        prodiId: data.prodiId,
        judul: data.judul,
        konten: data.konten,
        targetRole: data.targetRole as any,
        isActive: true,
      },
    });

    return pengumuman;
  }
}