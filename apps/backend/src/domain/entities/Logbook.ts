export class Logbook {
  constructor(
    public readonly id: string,
    public readonly mahasiswaId: string,
    public readonly dosenId: string,
    public readonly tanggal: Date,
    public readonly topikBahasan: string,
    public readonly hasilBimbingan: string | null,
    public readonly status: string,
    public readonly catatanDosen: string | null,
    public readonly fileBukti: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    id: string,
    mahasiswaId: string,
    dosenId: string,
    tanggal: Date,
    topikBahasan: string
  ): Logbook {
    return new Logbook(
      id,
      mahasiswaId,
      dosenId,
      tanggal,
      topikBahasan,
      null,
      'MENUNGGU',
      null,
      null,
      new Date(),
      new Date()
    );
  }

  isValidated(): boolean {
    return this.status === 'DIVALIDASI';
  }

  isRejected(): boolean {
    return this.status === 'DITOLAK';
  }

  isPending(): boolean {
    return this.status === 'MENUNGGU';
  }

  canBeValidated(): boolean {
    return this.status === 'MENUNGGU';
  }
}
