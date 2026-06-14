import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  role: z.enum(['ADMIN', 'ADMIN_AKADEMIK', 'SEKRETARIAT', 'KAPRODI', 'DOSEN_REGULER', 'DOSEN_PEMBIMBING', 'DOSEN_PENGUJI', 'STAF_PRODI', 'MAHASISWA']),
  nim: z.string().optional(),
  nidn: z.string().optional(),
  prodiId: z.string().optional(),
  jabatan: z.string().optional(),
});

export const pengajuanTopikSchema = z.object({
  mahasiswaId: z.string().uuid(),
  topik: z.string().min(5, 'Topik minimal 5 karakter'),
  judul: z.string().min(10, 'Judul minimal 10 karakter'),
  deskripsi: z.string().optional(),
});