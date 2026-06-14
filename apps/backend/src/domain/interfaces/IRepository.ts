export interface IRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T | null>;
  findAll(params?: { page?: number; limit?: number; filter?: Record<string, any> }): Promise<{ data: T[]; total: number }>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  findById(id: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
}

export interface IMahasiswaRepository extends IRepository<any, any, any> {
  findByNim(nim: string): Promise<any | null>;
  findByPembimbing(dosenId: string): Promise<any[]>;
  updateStatus(id: string, status: string): Promise<any>;
}

export interface IDosenRepository extends IRepository<any, any, any> {
  findByNidn(nidn: string): Promise<any | null>;
  findPembimbing(): Promise<any[]>;
  findPenguji(): Promise<any[]>;
}

export interface ISkripsiRepository extends IRepository<any, any, any> {
  findByMahasiswaId(mahasiswaId: string): Promise<any | null>;
  updateStatus(id: string, status: string): Promise<any>;
}

export interface ILogbookRepository extends IRepository<any, any, any> {
  findByMahasiswaId(mahasiswaId: string): Promise<any[]>;
  findByDosenId(dosenId: string): Promise<any[]>;
}

export interface IBerkasRepository extends IRepository<any, any, any> {
  findByMahasiswaId(mahasiswaId: string): Promise<any[]>;
  findByJenisBerkas(jenisBerkas: string): Promise<any[]>;
}

export interface IJadwalSidangRepository extends IRepository<any, any, any> {
  findByMahasiswaId(mahasiswaId: string): Promise<any[]>;
  findByStatus(status: string): Promise<any[]>;
  findByTanggal(tanggal: Date, endDate?: Date): Promise<any[]>;
}

export interface IPenilaianRepository extends IRepository<any, any, any> {
  findByJadwalId(jadwalSidangId: string): Promise<any[]>;
  findByMahasiswaId(mahasiswaId: string): Promise<any[]>;
  findByDosenId(dosenId: string): Promise<any[]>;
}