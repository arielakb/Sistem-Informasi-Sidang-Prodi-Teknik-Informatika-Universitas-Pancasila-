import { PrismaClient } from '@prisma/client';
import { IJadwalSidangRepository } from '../../../domain/interfaces/IRepository';
import { CreateJadwalSidangDTO, UpdateJadwalSidangDTO, JadwalSidangResponseDTO } from '../../../application/dto/jadwal/JadwalDTO';

export class PrismaJadwalSidangRepository implements IJadwalSidangRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<JadwalSidangResponseDTO | null> {
    return this.prisma.jadwalSidang.findUnique({
      where: { id },
      include: {
        mahasiswa: true,
        ruangan: true,
        penguji1: true,
        penguji2: true,
        penguji3: true,
      },
    });
  }

  async findAll(params?: { page?: number; limit?: number; filter?: Record<string, any> }): Promise<{ data: JadwalSidangResponseDTO[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const data = await this.prisma.jadwalSidang.findMany({
      skip,
      take: limit,
      include: {
        mahasiswa: true,
        ruangan: true,
        penguji1: true,
        penguji2: true,
        penguji3: true,
      },
    });

    const total = await this.prisma.jadwalSidang.count();

    return { data, total };
  }

  async create(data: CreateJadwalSidangDTO): Promise<JadwalSidangResponseDTO> {
    return this.prisma.jadwalSidang.create({
      data: {
        jenisSidang: data.jenisSidang as any,
        mahasiswaId: data.mahasiswaId,
        tanggal: data.tanggal,
        waktuMulai: data.waktuMulai,
        waktuSelesai: data.waktuSelesai,
        ruanganId: data.ruanganId,
        penguji1Id: data.penguji1Id,
        penguji2Id: data.penguji2Id,
        penguji3Id: data.penguji3Id,
        linkMeeting: data.linkMeeting,
      },
      include: {
        mahasiswa: true,
        ruangan: true,
        penguji1: true,
        penguji2: true,
        penguji3: true,
      },
    });
  }

  async update(id: string, data: UpdateJadwalSidangDTO): Promise<JadwalSidangResponseDTO> {
    const updateData: any = {};
    if (data.tanggal !== undefined) updateData.tanggal = data.tanggal;
    if (data.waktuMulai !== undefined) updateData.waktuMulai = data.waktuMulai;
    if (data.waktuSelesai !== undefined) updateData.waktuSelesai = data.waktuSelesai;
    if (data.ruanganId !== undefined) updateData.ruanganId = data.ruanganId;
    if (data.penguji1Id !== undefined) updateData.penguji1Id = data.penguji1Id;
    if (data.penguji2Id !== undefined) updateData.penguji2Id = data.penguji2Id;
    if (data.penguji3Id !== undefined) updateData.penguji3Id = data.penguji3Id;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.linkMeeting !== undefined) updateData.linkMeeting = data.linkMeeting;

    return this.prisma.jadwalSidang.update({
      where: { id },
      data: updateData,
      include: {
        mahasiswa: true,
        ruangan: true,
        penguji1: true,
        penguji2: true,
        penguji3: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.jadwalSidang.delete({
      where: { id },
    });
  }

  async findByMahasiswaId(mahasiswaId: string): Promise<JadwalSidangResponseDTO[]> {
    return this.prisma.jadwalSidang.findMany({
      where: { mahasiswaId },
      include: {
        mahasiswa: true,
        ruangan: true,
        penguji1: true,
        penguji2: true,
        penguji3: true,
      },
    });
  }

  async findByStatus(status: string): Promise<JadwalSidangResponseDTO[]> {
    return this.prisma.jadwalSidang.findMany({
      where: { status: status as any },
      include: {
        mahasiswa: true,
        ruangan: true,
        penguji1: true,
        penguji2: true,
        penguji3: true,
      },
    });
  }

  async findByTanggal(tanggal: Date, endDate?: Date): Promise<JadwalSidangResponseDTO[]> {
    const whereClause: any = {
      tanggal: {
        gte: tanggal,
      },
    };

    if (endDate) {
      whereClause.tanggal.lte = endDate;
    }

    return this.prisma.jadwalSidang.findMany({
      where: whereClause,
      include: {
        mahasiswa: true,
        ruangan: true,
        penguji1: true,
        penguji2: true,
        penguji3: true,
      },
    });
  }
}
