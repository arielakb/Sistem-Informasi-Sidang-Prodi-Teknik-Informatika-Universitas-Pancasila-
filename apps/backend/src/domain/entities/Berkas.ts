export class Berkas {
  constructor(
    public readonly id: string,
    public readonly mahasiswaId: string,
    public readonly jadwalSidangId: string | null,
    public readonly jenisBerkas: string,
    public readonly filePath: string,
    public readonly status: string,
    public readonly catatanVerifikasi: string | null,
    public readonly uploadedAt: Date
  ) {}

  static createBerkasSidang(
    id: string,
    mahasiswaId: string,
    jenisBerkas: string,
    filePath: string
  ): Berkas {
    return new Berkas(id, mahasiswaId, null, jenisBerkas, filePath, 'DIAJUKAN', null, new Date());
  }

  static createBerkasFinal(id: string, mahasiswaId: string, filePath: string): Berkas {
    return new Berkas(id, mahasiswaId, null, 'BERKAS_FINAL', filePath, 'DIAJUKAN', null, new Date());
  }

  isVerified(): boolean {
    return this.status === 'DIVERIFIKASI';
  }

  isApproved(): boolean {
    return this.status === 'DISETUJUI';
  }

  isRejected(): boolean {
    return this.status === 'DITOLAK';
  }

  isPending(): boolean {
    return this.status === 'DIAJUKAN';
  }

  canBeVerified(): boolean {
    return this.status === 'DIAJUKAN';
  }
}
