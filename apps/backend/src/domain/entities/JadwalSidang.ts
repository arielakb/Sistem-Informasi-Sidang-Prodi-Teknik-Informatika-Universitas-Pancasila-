export class JadwalSidang {
  constructor(
    public readonly id: string,
    public readonly jenisSidang: string,
    public readonly mahasiswaId: string,
    public readonly tanggal: Date,
    public readonly waktuMulai: Date,
    public readonly waktuSelesai: Date,
    public readonly ruanganId: string,
    public readonly penguji1Id: string | null,
    public readonly penguji2Id: string | null,
    public readonly penguji3Id: string | null,
    public readonly status: string,
    public readonly linkMeeting: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  isUpcoming(): boolean {
    return this.tanggal > new Date() && this.status === 'DIJADWALKAN';
  }

  isOngoing(): boolean {
    const now = new Date();
    return this.waktuMulai <= now && this.waktuSelesai >= now && this.status === 'BERLANGSUNG';
  }

  isCompleted(): boolean {
    return this.status === 'SELESAI';
  }

  isPengujiLengkap(): boolean {
    return !!this.penguji1Id;
  }
}
