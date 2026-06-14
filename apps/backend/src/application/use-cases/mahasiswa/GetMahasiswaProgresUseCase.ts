import { IMahasiswaRepository } from '../../../domain/interfaces/IRepository';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class GetMahasiswaProgresUseCase {
  constructor(private mahasiswaRepository: IMahasiswaRepository) {}

  async execute(mahasiswaId: string) {
    const mahasiswa = await this.mahasiswaRepository.findById(mahasiswaId);
    if (!mahasiswa) {
      throw new ApiError(404, 'Mahasiswa tidak ditemukan');
    }

    const statusFlow = [
      'PENGAJUAN_TOPIK',
      'BIMBINGAN',
      'SEMINAR_PROPOSAL',
      'SIDANG_KOMPREHENSIF',
      'SIDANG_SKRIPSI',
      'REVISI',
      'LULUS',
    ];

    const currentIndex = statusFlow.indexOf(mahasiswa.statusSkripsi);
    const progress = {
      currentStatus: mahasiswa.statusSkripsi,
      currentStep: currentIndex + 1,
      totalSteps: statusFlow.length,
      percentage: Math.round(((currentIndex + 1) / statusFlow.length) * 100),
      history: statusFlow.map((status, index) => ({
        status,
        completed: index <= currentIndex,
        active: index === currentIndex,
      })),
    };

    return progress;
  }
}