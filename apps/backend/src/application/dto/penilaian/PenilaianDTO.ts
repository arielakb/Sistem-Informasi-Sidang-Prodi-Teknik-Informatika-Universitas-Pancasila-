// Request DTOs
export interface IsiPenilaianDTO {
  jadwalSidangId: string;
  dosenId: string;
  mahasiswaId: string;
  nilaiPresentasi: number;
  nilaiMateri: number;
  nilaiTeknik: number;
  catatan?: string;
}

export interface UpdatePenilaianDTO {
  nilaiPresentasi?: number;
  nilaiMateri?: number;
  nilaiTeknik?: number;
  catatan?: string;
}

export interface SubmitPenilaianDTO {
  status: 'SUBMITTED';
}

// Response DTOs
export interface PenilaianResponseDTO {
  id: string;
  jadwalSidangId: string;
  dosenId: string;
  mahasiswaId: string;
  nilaiPresentasi: number | null;
  nilaiMateri: number | null;
  nilaiTeknik: number | null;
  catatan: string | null;
  totalNilai: number | null;
  isSubmitted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PenilaianDetailDTO extends PenilaianResponseDTO {
  mahasiswa?: {
    nim: string;
    nama: string;
  };
  dosen?: {
    nidn: string;
    nama: string;
  };
  jadwal?: {
    jenisSidang: string;
    tanggal: Date;
  };
}

export interface RekpaNilaiDTO {
  mahasiswaId: string;
  daftarPenilaian: PenilaianResponseDTO[];
  rataRataNilai?: number;
}
