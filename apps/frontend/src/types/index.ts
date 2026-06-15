export interface Mahasiswa {
  topikDiajukan: string;
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  statusSkripsi: string;
  judulSkripsi: string | null;
  pembimbing1?: { nama: string } | null;
  pembimbing2?: { nama: string } | null;
}

export interface JadwalSidang {
  id: string;
  jenisSidang: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  ruangan: { nama: string };
  mahasiswa: { nama: string; nim: string };
  status: string;
}

export interface Logbook {
  id: string;
  tanggal: string;
  topikBahasan: string;
  status: string;
  catatanDosen?: string | null;
}