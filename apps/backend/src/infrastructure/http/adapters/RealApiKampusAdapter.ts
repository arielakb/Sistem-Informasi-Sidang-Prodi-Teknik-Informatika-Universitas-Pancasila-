import axios, { AxiosInstance } from 'axios';
import { IApiKampusAdapter, MahasiswaKampusData, DosenKampusData } from '../../../domain/interfaces/IApiKampusAdapter';
import { env } from '../../config/env';

export class RealApiKampusAdapter implements IApiKampusAdapter {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.API_KAMPUS_BASE_URL,
      timeout: env.API_KAMPUS_TIMEOUT,
      headers: {
        'X-API-Key': env.API_KAMPUS_API_KEY,
        'Content-Type': 'application/json',
      },
    });
  }

  async getMahasiswaByNim(nim: string): Promise<MahasiswaKampusData | null> {
    try {
      const response = await this.client.get(`/mahasiswa/${nim}`);
      return this.mapMahasiswaResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getAllMahasiswa(params?: { prodi?: string; angkatan?: number }): Promise<MahasiswaKampusData[]> {
    const response = await this.client.get('/mahasiswa', { params });
    return response.data.map(this.mapMahasiswaResponse);
  }

  async syncMahasiswa(): Promise<{ inserted: number; updated: number; failed: number }> {
    throw new Error('Sync not implemented yet - waiting for API Kampus');
  }

  async getDosenByNidn(nidn: string): Promise<DosenKampusData | null> {
    try {
      const response = await this.client.get(`/dosen/${nidn}`);
      return this.mapDosenResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getAllDosen(params?: { prodi?: string }): Promise<DosenKampusData[]> {
    const response = await this.client.get('/dosen', { params });
    return response.data.map(this.mapDosenResponse);
  }

  async syncDosen(): Promise<{ inserted: number; updated: number; failed: number }> {
    throw new Error('Sync not implemented yet - waiting for API Kampus');
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  private mapMahasiswaResponse(data: any): MahasiswaKampusData {
    return {
      nim: data.nim,
      nama: data.nama,
      prodi: data.prodi,
      angkatan: data.angkatan,
      email: data.email,
      status: data.status,
    };
  }

  private mapDosenResponse(data: any): DosenKampusData {
    return {
      nidn: data.nidn,
      nama: data.nama,
      prodi: data.prodi,
      email: data.email,
      jabatan: data.jabatan,
    };
  }
}