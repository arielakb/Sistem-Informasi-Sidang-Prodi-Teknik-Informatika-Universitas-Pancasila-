export class Penilaian {
  constructor(
    public readonly id: string,
    public readonly jadwalSidangId: string,
    public readonly dosenId: string,
    public readonly mahasiswaId: string,
    public readonly nilaiPresentasi: number | null,
    public readonly nilaiMateri: number | null,
    public readonly nilaiTeknik: number | null,
    public readonly catatan: string | null,
    public readonly totalNilai: number | null,
    public readonly isSubmitted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    id: string,
    jadwalSidangId: string,
    dosenId: string,
    mahasiswaId: string
  ): Penilaian {
    return new Penilaian(
      id,
      jadwalSidangId,
      dosenId,
      mahasiswaId,
      null,
      null,
      null,
      null,
      null,
      false,
      new Date(),
      new Date()
    );
  }

  submitNilai(
    nilaiPresentasi: number,
    nilaiMateri: number,
    nilaiTeknik: number,
    catatan?: string
  ): Penilaian {
    const totalNilai = (nilaiPresentasi + nilaiMateri + nilaiTeknik) / 3;
    return new Penilaian(
      this.id,
      this.jadwalSidangId,
      this.dosenId,
      this.mahasiswaId,
      nilaiPresentasi,
      nilaiMateri,
      nilaiTeknik,
      catatan || null,
      totalNilai,
      true,
      this.createdAt,
      new Date()
    );
  }

  getSubmittedStatus(): boolean {
    return this.isSubmitted;
  }

  isPending(): boolean {
    return !this.isSubmitted;
  }

  getTotalNilai(): number | null {
    if (this.nilaiPresentasi && this.nilaiMateri && this.nilaiTeknik) {
      return (this.nilaiPresentasi + this.nilaiMateri + this.nilaiTeknik) / 3;
    }
    return null;
  }

  canBeEdited(): boolean {
    return !this.isSubmitted;
  }
}
