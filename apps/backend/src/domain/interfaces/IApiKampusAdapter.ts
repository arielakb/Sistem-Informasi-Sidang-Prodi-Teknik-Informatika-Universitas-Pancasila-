export interface MahasiswaKampusData {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  email: string;
  status: string;
}

export interface DosenKampusData {
  nidn: string;
  nama: string;
  prodi: string;
  email: string;
  jabatan: string;
}

export interface IApiKampusAdapter {
  getMahasiswaByNim(nim: string): Promise<MahasiswaKampusData | null>;
  getAllMahasiswa(params?: { prodi?: string; angkatan?: number }): Promise<MahasiswaKampusData[]>;
  syncMahasiswa(): Promise<{ inserted: number; updated: number; failed: number }>;
  
  getDosenByNidn(nidn: string): Promise<DosenKampusData | null>;
  getAllDosen(params?: { prodi?: string }): Promise<DosenKampusData[]>;
  syncDosen(): Promise<{ inserted: number; updated: number; failed: number }>;
  
  isAvailable(): Promise<boolean>;
}