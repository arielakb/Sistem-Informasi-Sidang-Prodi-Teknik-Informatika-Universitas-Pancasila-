import { PrismaClient } from '@prisma/client';
import { ILogbookRepository } from '../../../domain/interfaces/IRepository';
import { BuatLogbookDTO, ValidasiLogbookDTO, LogbookResponseDTO } from '../../../application/dto/skripsi/LogbookDTO';

export class PrismaLogbookRepository implements ILogbookRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<LogbookResponseDTO | null> {
    return this.prisma.logbook.findUnique({
      where: { id },
      include: {
        mahasiswa: true,
        dosen: true,
      },
    });
  }

  async findAll(params?: { page?: number; limit?: number; filter?: Record<string, any> }): Promise<{ data: LogbookResponseDTO[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const data = await this.prisma.logbook.findMany({
      skip,
      take: limit,
      include: {
        mahasiswa: true,
        dosen: true,
      },
    });

    const total = await this.prisma.logbook.count();

    return { data, total };
  }

  async create(data: BuatLogbookDTO): Promise<LogbookResponseDTO> {
    return this.prisma.logbook.create({
      data: {
        mahasiswaId: data.mahasiswaId,
        dosenId: data.dosenId,
        tanggal: data.tanggal,
        topikBahasan: data.topikBahasan,
        hasilBimbingan: data.hasilBimbingan,
        fileBukti: data.fileBukti,
      },
      include: {
        mahasiswa: true,
        dosen: true,
      },
    });
  }

  async update(id: string, data: ValidasiLogbookDTO): Promise<LogbookResponseDTO> {
    return this.prisma.logbook.update({
      where: { id },
      data: {
        status: data.status as any,
        catatanDosen: data.catatanDosen,
      },
      include: {
        mahasiswa: true,
        dosen: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.logbook.delete({
      where: { id },
    });
  }

  async findByMahasiswaId(mahasiswaId: string): Promise<LogbookResponseDTO[]> {
    return this.prisma.logbook.findMany({
      where: { mahasiswaId },
      include: {
        mahasiswa: true,
        dosen: true,
      },
    });
  }

  async findByDosenId(dosenId: string): Promise<LogbookResponseDTO[]> {
    return this.prisma.logbook.findMany({
      where: { dosenId },
      include: {
        mahasiswa: true,
        dosen: true,
      },
    });
  }
}
