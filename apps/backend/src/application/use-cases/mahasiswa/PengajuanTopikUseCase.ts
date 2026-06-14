import { IMahasiswaRepository } from '../../../domain/interfaces/IRepository';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export interface PengajuanTopikDTO {
  mahasiswaId: string;
  topik: string;
  judul: string;
  deskripsi?: string;
}

export class PengajuanTopikUseCase {
  constructor(private mahasiswaRepository: IMahasiswaRepository) {}

  async execute(data: PengajuanTopikDTO) {
    const mahasiswa = await this.mahasiswaRepository.findById(data.mahasiswaId);
    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    if (mahasiswa.judulSkripsi) {
      throw new ApiError(400, 'Mahasiswa sudah memiliki topik skripsi');
    }

    return this.mahasiswaRepository.update(data.mahasiswaId, {
      topikDiajukan: data.topik,
      judulSkripsi: data.judul,
    });
  }
}