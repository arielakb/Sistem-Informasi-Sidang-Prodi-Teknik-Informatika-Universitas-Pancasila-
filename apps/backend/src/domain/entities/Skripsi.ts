export class Skripsi {
  constructor(
    public readonly id: string,
    public readonly mahasiswaId: string,
    public readonly judul: string,
    public readonly outline: string,
    public readonly status: string,
    public readonly topikDiajukan: string | null,
    public readonly statusSkripsi: string,
    public readonly kodeEtikSigned: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    id: string,
    mahasiswaId: string,
    judul: string,
    outline: string
  ): Skripsi {
    return new Skripsi(
      id,
      mahasiswaId,
      judul,
      outline,
      'PENGAJUAN_TOPIK',
      null,
      'PENGAJUAN_TOPIK',
      false,
      new Date(),
      new Date()
    );
  }

  isApproved(): boolean {
    return this.status === 'DISETUJUI';
  }

  isPending(): boolean {
    return this.status === 'MENUNGGU';
  }

  canProgress(): boolean {
    return ['PENGAJUAN_TOPIK', 'BIMBINGAN', 'SEMINAR_PROPOSAL', 'SIDANG_KOMPREHENSIF'].includes(
      this.statusSkripsi
    );
  }
}
