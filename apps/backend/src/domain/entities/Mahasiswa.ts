export class Mahasiswa {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly nim: string,
    public readonly nama: string,
    public readonly prodiId: string,
    public readonly angkatan: number,
    public readonly statusSkripsi: string,
    public readonly pembimbing1Id: string | null,
    public readonly pembimbing2Id: string | null,
    public readonly judulSkripsi: string | null,
    public readonly topikDiajukan: string | null,
    public readonly kodeEtikSigned: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  hasPembimbing(): boolean {
    return !!this.pembimbing1Id;
  }

  hasJudul(): boolean {
    return !!this.judulSkripsi;
  }

  isReadyForSidang(jenisSidang: string): boolean {
    const statusMap: Record<string, string> = {
      SEMINAR_PROPOSAL: 'BIMBINGAN',
      SIDANG_KOMPREHENSIF: 'SEMINAR_PROPOSAL',
      SIDANG_SKRIPSI: 'SIDANG_KOMPREHENSIF',
    };
    return this.statusSkripsi === statusMap[jenisSidang];
  }

  isLulus(): boolean {
    return this.statusSkripsi === 'LULUS';
  }
}
