import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface SetDeadlineDTO {
  jenisDeadline: string;
  tanggalDeadline: Date;
  prodiId?: string;
  keterangan?: string;
}

export class SetDeadlineUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: SetDeadlineDTO) {
    // Nonaktifkan deadline lama dengan jenis yang sama
    await this.prisma.deadline.updateMany({
      where: {
        jenisDeadline: data.jenisDeadline,
        prodiId: data.prodiId || null,
        isActive: true,
      },
      data: { isActive: false },
    });

    const deadline = await this.prisma.deadline.create({
      data: {
        jenisDeadline: data.jenisDeadline,
        tanggalDeadline: data.tanggalDeadline,
        prodiId: data.prodiId,
        keterangan: data.keterangan,
        isActive: true,
      },
    });

    return deadline;
  }
}