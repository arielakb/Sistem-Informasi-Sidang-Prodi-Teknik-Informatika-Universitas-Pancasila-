import { PrismaClient } from '@prisma/client';
import { IBerkasRepository } from '../../../domain/interfaces/IRepository';
import { UploadBerkasDTO, VerifikasiBerkasDTO, BerkasResponseDTO } from '../../../application/dto/berkas/BerkasDTO';

export class PrismaBerkasRepository implements IBerkasRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<BerkasResponseDTO | null> {
    return this.prisma.berkasSidang.findUnique({
      where: { id },
      include: {
        mahasiswa: true,
        jadwalSidang: true,
      },
    });
  }

  async findAll(params?: { page?: number; limit?: number; filter?: Record<string, any> }): Promise<{ data: BerkasResponseDTO[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const data = await this.prisma.berkasSidang.findMany({
      skip,
      take: limit,
      include: {
        mahasiswa: true,
        jadwalSidang: true,
      },
    });

    const total = await this.prisma.berkasSidang.count();

    return { data, total };
  }

  async create(data: UploadBerkasDTO): Promise<BerkasResponseDTO> {
    return this.prisma.berkasSidang.create({
      data: {
        mahasiswaId: data.mahasiswaId,
        jenisBerkas: data.jenisBerkas,
        filePath: data.filePath,
        jadwalSidangId: data.jadwalSidangId,
      },
      include: {
        mahasiswa: true,
        jadwalSidang: true,
      },
    });
  }

  async update(id: string, data: VerifikasiBerkasDTO): Promise<BerkasResponseDTO> {
    return this.prisma.berkasSidang.update({
      where: { id },
      data: {
        status: data.status as any,
        catatanVerifikasi: data.catatanVerifikasi,
      },
      include: {
        mahasiswa: true,
        jadwalSidang: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.berkasSidang.delete({
      where: { id },
    });
  }

  async findByMahasiswaId(mahasiswaId: string): Promise<BerkasResponseDTO[]> {
    return this.prisma.berkasSidang.findMany({
      where: { mahasiswaId },
      include: {
        mahasiswa: true,
        jadwalSidang: true,
      },
    });
  }

  async findByJenisBerkas(jenisBerkas: string): Promise<BerkasResponseDTO[]> {
    return this.prisma.berkasSidang.findMany({
      where: { jenisBerkas },
      include: {
        mahasiswa: true,
        jadwalSidang: true,
      },
    });
  }
}
