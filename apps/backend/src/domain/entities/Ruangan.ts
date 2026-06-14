export class Ruangan {
  constructor(
    public readonly id: string,
    public readonly prodiId: string,
    public readonly nama: string,
    public readonly kapasitas: number,
    public readonly fasilitas: string | null,
    public readonly createdAt: Date
  ) {}

  static create(id: string, prodiId: string, nama: string, kapasitas: number): Ruangan {
    return new Ruangan(id, prodiId, nama, kapasitas, null, new Date());
  }

  canFit(jumlahOrang: number): boolean {
    return jumlahOrang <= this.kapasitas;
  }

  isValid(): boolean {
    return !!this.nama && this.kapasitas > 0;
  }
}
