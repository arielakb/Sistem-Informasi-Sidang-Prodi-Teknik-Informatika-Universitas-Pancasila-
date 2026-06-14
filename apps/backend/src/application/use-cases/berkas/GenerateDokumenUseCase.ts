import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface GenerateDokumenDTO {
  jadwalSidangId: string;
  jenisDokumen: 'SK_PENGUJI' | 'BERITA_ACARA';
  generatedBy: string;
}

export class GenerateDokumenUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(data: GenerateDokumenDTO) {
    const jadwal = await this.prisma.jadwalSidang.findUnique({
      where: { id: data.jadwalSidangId },
      include: {
        mahasiswa: {
          include: {
            pembimbing1: true,
            pembimbing2: true,
          },
        },
        ruangan: true,
        penguji1: true,
        penilaian: {
          include: { dosen: true },
        },
      },
    });

    if (!jadwal) {
      throw new ApiError(404, 'Jadwal sidang tidak ditemukan');
    }

    // Generate nama file
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${data.jenisDokumen}_${jadwal.mahasiswa.nim}_${timestamp}.pdf`;
    const filePath = `./uploads/dokumen/${fileName}`;

    // Simpan ke database
    const dokumen = await this.prisma.dokumenAdmin.create({
      data: {
        jadwalSidangId: data.jadwalSidangId,
        jenisDokumen: data.jenisDokumen,
        filePath,
        generatedBy: data.generatedBy,
      },
    });

    return {
      dokumen,
      jadwal,
      downloadUrl: filePath,
    };
  }
}