// Request DTOs
export interface CreateJadwalSidangDTO {
  jenisSidang: string;
  mahasiswaId: string;
  tanggal: Date;
  waktuMulai: Date;
  waktuSelesai: Date;
  ruanganId: string;
  penguji1Id?: string;
  penguji2Id?: string;
  penguji3Id?: string;
  linkMeeting?: string;
}

export interface UpdateJadwalSidangDTO {
  tanggal?: Date;
  waktuMulai?: Date;
  waktuSelesai?: Date;
  ruanganId?: string;
  penguji1Id?: string;
  penguji2Id?: string;
  penguji3Id?: string;
  status?: string;
  linkMeeting?: string;
}

export interface UpdateStatusJadwalDTO {
  status: string;
}

// Response DTOs
export interface JadwalSidangResponseDTO {
  id: string;
  jenisSidang: string;
  mahasiswaId: string;
  tanggal: Date;
  waktuMulai: Date;
  waktuSelesai: Date;
  ruanganId: string;
  penguji1Id: string | null;
  penguji2Id: string | null;
  penguji3Id: string | null;
  status: string;
  linkMeeting: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JadwalSidangDetailDTO extends JadwalSidangResponseDTO {
  mahasiswa?: {
    nim: string;
    nama: string;
  };
  ruangan?: {
    nama: string;
    kapasitas: number;
  };
  penguji1?: {
    id: string;
    nama: string;
    nidn: string;
  };
  penguji2?: {
    id: string;
    nama: string;
    nidn: string;
  };
  penguji3?: {
    id: string;
    nama: string;
    nidn: string;
  };
}
