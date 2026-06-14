export class Dosen {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly nidn: string,
    public readonly nama: string,
    public readonly prodiId: string,
    public readonly jabatan: string | null,
    public readonly bidangKeahlian: string | null,
    public readonly isPembimbing: boolean,
    public readonly isPenguji: boolean,
    public readonly isKoordinator: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  canBePembimbing(): boolean {
    return this.isPembimbing;
  }

  canBePenguji(): boolean {
    return this.isPenguji;
  }

  canBeKoordinator(): boolean {
    return this.isKoordinator;
  }
}
