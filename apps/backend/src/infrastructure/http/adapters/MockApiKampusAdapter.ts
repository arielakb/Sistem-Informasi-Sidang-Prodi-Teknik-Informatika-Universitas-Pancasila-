import { IApiKampusAdapter, MahasiswaKampusData, DosenKampusData } from '../../../domain/interfaces/IApiKampusAdapter';
import mockMahasiswaData from '../../../../prisma/seed-data/mahasiswa.json';
import mockDosenData from '../../../../prisma/seed-data/dosen.json';

export class MockApiKampusAdapter implements IApiKampusAdapter {
  async getMahasiswaByNim(nim: string): Promise<MahasiswaKampusData | null> {
    const mahasiswa = mockMahasiswaData.find(m => m.nim === nim);
    return mahasiswa || null;
  }

  async getAllMahasiswa(params?: { prodi?: string; angkatan?: number }): Promise<MahasiswaKampusData[]> {
    let result = [...mockMahasiswaData];
    
    if (params?.prodi) {
      result = result.filter(m => m.prodi === params.prodi);
    }
    if (params?.angkatan) {
      result = result.filter(m => m.angkatan === params.angkatan);
    }
    
    return result;
  }

  async syncMahasiswa(): Promise<{ inserted: number; updated: number; failed: number }> {
    console.log('[MOCK] Sync mahasiswa - menggunakan data dari seed');
    return { inserted: mockMahasiswaData.length, updated: 0, failed: 0 };
  }

  async getDosenByNidn(nidn: string): Promise<DosenKampusData | null> {
    const dosen = mockDosenData.find(d => d.nidn === nidn);
    return dosen || null;
  }

  async getAllDosen(params?: { prodi?: string }): Promise<DosenKampusData[]> {
    let result = [...mockDosenData];
    
    if (params?.prodi) {
      result = result.filter(d => d.prodi === params.prodi);
    }
    
    return result;
  }

  async syncDosen(): Promise<{ inserted: number; updated: number; failed: number }> {
    console.log('[MOCK] Sync dosen - menggunakan data dari seed');
    return { inserted: mockDosenData.length, updated: 0, failed: 0 };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}