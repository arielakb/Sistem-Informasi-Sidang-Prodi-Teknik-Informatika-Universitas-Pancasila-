// Request DTOs
export interface UploadBerkasDTO {
  mahasiswaId: string;
  jenisBerkas: string;
  filePath: string;
  jadwalSidangId?: string;
}

export interface VerifikasiBerkasDTO {
  status: 'DIVERIFIKASI' | 'DITOLAK';
  catatanVerifikasi?: string;
}

export interface UploadBerkasFinalDTO {
  mahasiswaId: string;
  fileNaskah: string;
  filePengesahan: string;
  fileBerkasLain?: string;
}

export interface ApproveBerkasFinalDTO {
  status: 'DISETUJUI' | 'DITOLAK';
  catatan?: string;
}

// Response DTOs
export interface BerkasResponseDTO {
  id: string;
  mahasiswaId: string;
  jadwalSidangId: string | null;
  jenisBerkas: string;
  filePath: string;
  status: string;
  catatanVerifikasi: string | null;
  uploadedAt: Date;
}

export interface BerkasDetailDTO extends BerkasResponseDTO {
  mahasiswa?: {
    nim: string;
    nama: string;
  };
}

export interface BerkasFinalResponseDTO {
  id: string;
  mahasiswaId: string;
  fileNaskah: string;
  filePengesahan: string;
  fileBerkasLain: string | null;
  statusPembimbing: string;
  statusKoordinator: string;
  uploadedAt: Date;
}

export interface BerkasFinalDetailDTO extends BerkasFinalResponseDTO {
  mahasiswa?: {
    nim: string;
    nama: string;
  };
}
