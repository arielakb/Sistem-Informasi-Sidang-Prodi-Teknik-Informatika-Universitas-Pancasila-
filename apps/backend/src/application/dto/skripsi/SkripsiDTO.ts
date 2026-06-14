// Request DTOs
export interface AjukanTopikDTO {
  mahasiswaId: string;
  judul: string;
  outline: string;
}

export interface UpdateStatusSkripsiDTO {
  status: string;
  catatan?: string;
}

export interface ApproveMajuSidangDTO {
  mahasiswaId: string;
  jenisSidang: string;
  catatan?: string;
}

// Response DTOs
export interface TopikSkripsiResponseDTO {
  id: string;
  mahasiswaId: string;
  judul: string;
  outline: string;
  status: string;
  topikDiajukan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkripsiDetailDTO extends TopikSkripsiResponseDTO {
  mahasiswa?: {
    nim: string;
    nama: string;
  };
  statusSkripsi?: string;
  kodeEtikSigned?: boolean;
}
