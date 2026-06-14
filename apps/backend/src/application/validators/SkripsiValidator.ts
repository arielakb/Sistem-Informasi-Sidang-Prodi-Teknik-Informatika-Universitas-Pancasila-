import { z } from 'zod';

export const jadwalSidangSchema = z.object({
  jenisSidang: z.enum(['SEMINAR_PROPOSAL', 'SIDANG_KOMPREHENSIF', 'SIDANG_SKRIPSI']),
  mahasiswaId: z.string().uuid(),
  tanggal: z.string().datetime(),
  waktuMulai: z.string().datetime(),
  waktuSelesai: z.string().datetime(),
  ruanganId: z.string().uuid(),
  penguji1Id: z.string().uuid().optional(),
  penguji2Id: z.string().uuid().optional(),
  penguji3Id: z.string().uuid().optional(),
  linkMeeting: z.string().url().optional(),
});

export const penilaianSchema = z.object({
  mahasiswaId: z.string().uuid(),
  nilaiPresentasi: z.number().min(0).max(100).optional(),
  nilaiMateri: z.number().min(0).max(100).optional(),
  nilaiTeknik: z.number().min(0).max(100).optional(),
  catatan: z.string().optional(),
});

export const logbookSchema = z.object({
  mahasiswaId: z.string().uuid(),
  dosenId: z.string().uuid(),
  tanggal: z.string().datetime(),
  topikBahasan: z.string().min(5, 'Topik bahasan minimal 5 karakter'),
  hasilBimbingan: z.string().optional(),
});