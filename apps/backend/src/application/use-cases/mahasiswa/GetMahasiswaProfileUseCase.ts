import { IMahasiswaRepository } from '../../../domain/interfaces/IRepository';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class GetMahasiswaProfileUseCase {
  constructor(private mahasiswaRepository: IMahasiswaRepository) {}

  async execute(userId: string) {
    const mahasiswa = await this.mahasiswaRepository.findAll({
      filter: { userId },
      limit: 1,
    });

    if (!mahasiswa.data.length) {
      throw new ApiError(404, 'Profil mahasiswa tidak ditemukan');
    }

    return mahasiswa.data[0];
  }
}