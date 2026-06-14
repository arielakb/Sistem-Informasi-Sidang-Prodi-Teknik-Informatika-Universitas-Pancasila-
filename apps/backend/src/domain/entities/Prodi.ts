export class Prodi {
  constructor(
    public readonly id: string,
    public readonly kode: string,
    public readonly nama: string,
    public readonly createdAt: Date
  ) {}

  static create(id: string, kode: string, nama: string): Prodi {
    return new Prodi(id, kode, nama, new Date());
  }

  isValid(): boolean {
    return !!this.kode && !!this.nama;
  }
}
