// Request DTOs
export interface CreateMahasiswaDTO {
  userId: string;
  nim: string;
  nama: string;
  prodiId: string;
  angkatan: number;
}

export interface UpdateMahasiswaDTO {
  nama?: string;
  pembimbing1Id?: string;
  pembimbing2Id?: string;
  judulSkripsi?: string;
  statusSkripsi?: string;
}

export interface UpdateStatusSkripsiDTO {
  statusSkripsi: string;
}

// Response DTOs
export interface MahasiswaResponseDTO {
  id: string;
  userId: string;
  nim: string;
  nama: string;
  prodiId: string;
  angkatan: number;
  pembimbing1Id: string | null;
  pembimbing2Id: string | null;
  judulSkripsi: string | null;
  statusSkripsi: string;
  topikDiajukan: string | null;
  kodeEtikSigned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MahasiswaDetailDTO extends MahasiswaResponseDTO {
  user?: {
    email: string;
    role: string;
  };
  prodi?: {
    id: string;
    nama: string;
    kode: string;
  };
  pembimbing1?: {
    id: string;
    nama: string;
    nidn: string;
  };
  pembimbing2?: {
    id: string;
    nama: string;
    nidn: string;
  };
}
