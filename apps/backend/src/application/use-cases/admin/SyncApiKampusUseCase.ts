import { PrismaClient } from '@prisma/client';
import { diContainer } from '../../../infrastructure/config/di-container';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class SyncApiKampusUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(type: 'mahasiswa' | 'dosen') {
    const adapter = diContainer.getApiKampusAdapter();

    // Cek apakah mock atau real
    const isMock = await adapter.isAvailable() && 
                   (process.env.API_KAMPUS_API_KEY || '').includes('placeholder');

    if (isMock) {
      console.log('⚠️ Using mock data - real API not available');
      return {
        type,
        source: 'MOCK',
        message: 'Data dari mock/seed. Real API kampus belum tersedia.',
        inserted: 0,
        updated: 0,
        failed: 0,
      };
    }

    try {
      if (type === 'mahasiswa') {
        return await adapter.syncMahasiswa();
      } else {
        return await adapter.syncDosen();
      }
    } catch (error) {
      throw new ApiError(500, 'Gagal sync dengan API kampus: ' + (error as Error).message);
    }
  }
}