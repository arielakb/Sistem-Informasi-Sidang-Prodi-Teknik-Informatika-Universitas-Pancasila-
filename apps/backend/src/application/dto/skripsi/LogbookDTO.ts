// Request DTOs
export interface BuatLogbookDTO {
  mahasiswaId: string;
  dosenId: string;
  tanggal: Date;
  topikBahasan: string;
  hasilBimbingan?: string;
  fileBukti?: string;
}

export interface ValidasiLogbookDTO {
  status: 'DIVALIDASI' | 'DITOLAK';
  catatanDosen?: string;
}

// Response DTOs
export interface LogbookResponseDTO {
  id: string;
  mahasiswaId: string;
  dosenId: string;
  tanggal: Date;
  topikBahasan: string;
  hasilBimbingan: string | null;
  status: string;
  catatanDosen: string | null;
  fileBukti: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogbookDetailDTO extends LogbookResponseDTO {
  mahasiswa?: {
    nim: string;
    nama: string;
  };
  dosen?: {
    nidn: string;
    nama: string;
  };
}
