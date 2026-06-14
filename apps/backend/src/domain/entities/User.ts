export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  isAdmin(): boolean {
    return this.role === 'ADMIN' || this.role === 'ADMIN_AKADEMIK';
  }

  isMahasiswa(): boolean {
    return this.role === 'MAHASISWA';
  }

  isDosen(): boolean {
    return ['DOSEN_PEMBIMBING', 'DOSEN_PENGUJI', 'DOSEN_REGULER', 'KAPRODI'].includes(this.role);
  }

  canAccessAdmin(): boolean {
    return ['ADMIN', 'ADMIN_AKADEMIK', 'SEKRETARIAT'].includes(this.role);
  }
}
