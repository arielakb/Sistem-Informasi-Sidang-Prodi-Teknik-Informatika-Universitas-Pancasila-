/**
 * Interface untuk API Kampus Adapter
 * Mendefinisikan kontrak yang harus diimplementasikan oleh adapter apapun
 */
export interface IApiKampusAdapter {
  /**
   * Get all mahasiswa (students) from API Kampus
   */
  getMahasiswa(): Promise<MahasiswaApiData[]>;

  /**
   * Get mahasiswa (student) by NIM
   */
  getMahasiswaByNim(nim: string): Promise<MahasiswaApiData | null>;

  /**
   * Get all dosen (lecturers) from API Kampus
   */
  getDosen(): Promise<DosenApiData[]>;

  /**
   * Get dosen (lecturer) by NIDN
   */
  getDosenByNidn(nidn: string): Promise<DosenApiData | null>;

  /**
   * Validate mahasiswa credentials
   */
  validateMahasiswa(nim: string, password: string): Promise<boolean>;

  /**
   * Validate dosen credentials
   */
  validateDosen(nidn: string, password: string): Promise<boolean>;

  /**
   * Sync mahasiswa data (optional)
   */
  syncMahasiswa?(mahasiswa: MahasiswaApiData): Promise<void>;

  /**
   * Sync dosen data (optional)
   */
  syncDosen?(dosen: DosenApiData): Promise<void>;
}

/**
 * Data structure from API Kampus for Mahasiswa
 */
export interface MahasiswaApiData {
  nim: string;
  nama: string;
  email: string;
  prodi: string;
  tahunAngkatan: number;
  noHp?: string;
  alamat?: string;
  statusAktif: boolean;
}

/**
 * Data structure from API Kampus for Dosen
 */
export interface DosenApiData {
  nidn: string;
  nama: string;
  email: string;
  prodi: string;
  jabatanAkademik?: string;
  bidangKeahlian?: string;
  noHp?: string;
  statusAktif: boolean;
}
