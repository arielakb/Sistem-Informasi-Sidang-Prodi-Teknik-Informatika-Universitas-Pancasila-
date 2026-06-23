import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../infrastructure/utils/ApiError';

export class PeerReviewUseCases {
  constructor(private prisma: PrismaClient) {}

  async submit(review: { reviewerId: string; mahasiswaId: string; komentar?: string; skor?: number }) {
    const dosen = await this.prisma.dosen.findUnique({ where: { id: review.reviewerId } });
    if (!dosen) throw new ApiError(404, 'Dosen (reviewer) tidak ditemukan');

    const mahasiswa = await this.prisma.mahasiswa.findUnique({ where: { id: review.mahasiswaId } });
    if (!mahasiswa) throw new ApiError(404, 'Mahasiswa tidak ditemukan');

    return this.prisma.peerReview.create({
      data: {
        reviewerId: review.reviewerId,
        mahasiswaId: review.mahasiswaId,
        komentar: review.komentar,
        skor: review.skor,
      },
    });
  }

  async listForMahasiswa(mahasiswaId: string) {
    return this.prisma.peerReview.findMany({
      where: { mahasiswaId },
      include: { reviewer: { select: { id: true, nama: true, nidn: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
