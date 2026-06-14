import { PrismaClient } from '@prisma/client';
import { IPenilaianRepository } from '../../../domain/interfaces/IRepository';
import { IsiPenilaianDTO, UpdatePenilaianDTO, PenilaianResponseDTO } from '../../../application/dto/penilaian/PenilaianDTO';

export class PrismaPenilaianRepository implements IPenilaianRepository {
  constructor(private prisma: PrismaClient) {}

  private convertToNumber(value: any): number | null {
    if (value === null || value === undefined) return null;
    return typeof value === 'number' ? value : parseFloat(value.toString());
  }

  private formatPenilaian(data: any): PenilaianResponseDTO {
    return {
      ...data,
      nilaiPresentasi: this.convertToNumber(data.nilaiPresentasi),
      nilaiMateri: this.convertToNumber(data.nilaiMateri),
      nilaiTeknik: this.convertToNumber(data.nilaiTeknik),
      totalNilai: this.convertToNumber(data.totalNilai),
    };
  }

  async findById(id: string): Promise<PenilaianResponseDTO | null> {
    const result = await this.prisma.penilaian.findUnique({
      where: { id },
      include: {
        jadwalSidang: true,
        dosen: true,
        mahasiswa: true,
      },
    });
    return result ? this.formatPenilaian(result) : null;
  }

  async findAll(params?: { page?: number; limit?: number; filter?: Record<string, any> }): Promise<{ data: PenilaianResponseDTO[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const data = await this.prisma.penilaian.findMany({
      skip,
      take: limit,
      include: {
        jadwalSidang: true,
        dosen: true,
        mahasiswa: true,
      },
    });

    const total = await this.prisma.penilaian.count();

    return { data: data.map(d => this.formatPenilaian(d)), total };
  }

  async create(data: IsiPenilaianDTO): Promise<PenilaianResponseDTO> {
    const result = await this.prisma.penilaian.create({
      data: {
        jadwalSidangId: data.jadwalSidangId,
        dosenId: data.dosenId,
        mahasiswaId: data.mahasiswaId,
        nilaiPresentasi: data.nilaiPresentasi,
        nilaiMateri: data.nilaiMateri,
        nilaiTeknik: data.nilaiTeknik,
        catatan: data.catatan,
        totalNilai: (data.nilaiPresentasi + data.nilaiMateri + data.nilaiTeknik) / 3,
      },
      include: {
        jadwalSidang: true,
        dosen: true,
        mahasiswa: true,
      },
    });
    return this.formatPenilaian(result);
  }

  async update(id: string, data: UpdatePenilaianDTO): Promise<PenilaianResponseDTO> {
    const current = await this.prisma.penilaian.findUnique({ where: { id } });
    if (!current) throw new Error('Penilaian not found');

    const nilaiPresentasi = this.convertToNumber(data.nilaiPresentasi) || this.convertToNumber(current.nilaiPresentasi);
    const nilaiMateri = this.convertToNumber(data.nilaiMateri) || this.convertToNumber(current.nilaiMateri);
    const nilaiTeknik = this.convertToNumber(data.nilaiTeknik) || this.convertToNumber(current.nilaiTeknik);

    const totalNilai =
      nilaiPresentasi && nilaiMateri && nilaiTeknik
        ? (nilaiPresentasi + nilaiMateri + nilaiTeknik) / 3
        : null;

    const result = await this.prisma.penilaian.update({
      where: { id },
      data: {
        nilaiPresentasi: data.nilaiPresentasi,
        nilaiMateri: data.nilaiMateri,
        nilaiTeknik: data.nilaiTeknik,
        catatan: data.catatan,
        totalNilai,
      },
      include: {
        jadwalSidang: true,
        dosen: true,
        mahasiswa: true,
      },
    });
    return this.formatPenilaian(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.penilaian.delete({
      where: { id },
    });
  }

  async findByJadwalId(jadwalSidangId: string): Promise<PenilaianResponseDTO[]> {
    const data = await this.prisma.penilaian.findMany({
      where: { jadwalSidangId },
      include: {
        jadwalSidang: true,
        dosen: true,
        mahasiswa: true,
      },
    });
    return data.map(d => this.formatPenilaian(d));
  }

  async findByMahasiswaId(mahasiswaId: string): Promise<PenilaianResponseDTO[]> {
    const data = await this.prisma.penilaian.findMany({
      where: { mahasiswaId },
      include: {
        jadwalSidang: true,
        dosen: true,
        mahasiswa: true,
      },
    });
    return data.map(d => this.formatPenilaian(d));
  }

  async findByDosenId(dosenId: string): Promise<PenilaianResponseDTO[]> {
    const data = await this.prisma.penilaian.findMany({
      where: { dosenId },
      include: {
        jadwalSidang: true,
        dosen: true,
        mahasiswa: true,
      },
    });
    return data.map(d => this.formatPenilaian(d));
  }
}
