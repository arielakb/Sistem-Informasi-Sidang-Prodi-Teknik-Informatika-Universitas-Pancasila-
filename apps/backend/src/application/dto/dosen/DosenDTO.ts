// Request DTOs
export interface CreateDosenDTO {
  userId: string;
  nidn: string;
  nama: string;
  prodiId: string;
  jabatan?: string;
  bidangKeahlian?: string;
  isPembimbing?: boolean;
  isPenguji?: boolean;
  isKoordinator?: boolean;
}

export interface UpdateDosenDTO {
  nama?: string;
  jabatan?: string;
  bidangKeahlian?: string;
  isPembimbing?: boolean;
  isPenguji?: boolean;
  isKoordinator?: boolean;
}

// Response DTOs
export interface DosenResponseDTO {
  id: string;
  userId: string;
  nidn: string;
  nama: string;
  prodiId: string;
  jabatan: string | null;
  bidangKeahlian: string | null;
  isPembimbing: boolean;
  isPenguji: boolean;
  isKoordinator: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DosenDetailDTO extends DosenResponseDTO {
  user?: {
    email: string;
    role: string;
  };
  prodi?: {
    id: string;
    nama: string;
    kode: string;
  };
}
