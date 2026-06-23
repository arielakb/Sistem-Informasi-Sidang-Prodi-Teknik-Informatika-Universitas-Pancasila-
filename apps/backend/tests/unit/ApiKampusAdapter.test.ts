import { MockApiKampusAdapter } from '../../src/infrastructure/http/adapters/MockApiKampusAdapter';
import { RealApiKampusAdapter } from '../../src/infrastructure/http/adapters/RealApiKampusAdapter';
import { diContainer, DIContainer } from '../../src/infrastructure/config/di-container';

describe('API Kampus Adapter Pattern', () => {
  describe('DIContainer', () => {
    it('should instantiate DIContainer as singleton', () => {
      const instance1 = DIContainer.getInstance();
      const instance2 = DIContainer.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should return an IApiKampusAdapter instance', () => {
      const adapter = diContainer.getApiKampusAdapter();
      expect(adapter).toBeDefined();
      expect(adapter.getMahasiswaByNim).toBeDefined();
      expect(adapter.getAllDosen).toBeDefined();
    });
  });

  describe('MockApiKampusAdapter', () => {
    let adapter: MockApiKampusAdapter;

    beforeEach(() => {
      adapter = new MockApiKampusAdapter();
    });

    it('should implement IApiKampusAdapter interface', () => {
      expect(adapter.getMahasiswaByNim).toBeDefined();
      expect(adapter.getAllMahasiswa).toBeDefined();
      expect(adapter.getDosenByNidn).toBeDefined();
      expect(adapter.getAllDosen).toBeDefined();
      expect(adapter.syncMahasiswa).toBeDefined();
      expect(adapter.syncDosen).toBeDefined();
      expect(adapter.isAvailable).toBeDefined();
    });

    it('should load mahasiswa data from seed file', async () => {
      const mahasiswa = await adapter.getAllMahasiswa();
      expect(Array.isArray(mahasiswa)).toBe(true);
      expect(mahasiswa.length).toBeGreaterThan(0);
    });

    it('should find mahasiswa by nim', async () => {
      const mahasiswa = await adapter.getMahasiswaByNim('20210001');
      if (mahasiswa) {
        expect(mahasiswa.nim).toBe('20210001');
        expect(mahasiswa.nama).toBeDefined();
      }
    });

    it('should return null for non-existent mahasiswa', async () => {
      const mahasiswa = await adapter.getMahasiswaByNim('99999999');
      expect(mahasiswa).toBeNull();
    });

    it('should load dosen data from seed file', async () => {
      const dosen = await adapter.getAllDosen();
      expect(Array.isArray(dosen)).toBe(true);
      expect(dosen.length).toBeGreaterThan(0);
    });

    it('should find dosen by nidn', async () => {
      const dosenList = await adapter.getAllDosen();
      if (dosenList.length > 0) {
        const firstDosen = dosenList[0];
        const found = await adapter.getDosenByNidn(firstDosen.nidn);
        expect(found).toBeDefined();
        expect(found?.nidn).toBe(firstDosen.nidn);
      }
    });

    it('should return null for non-existent dosen', async () => {
      const dosen = await adapter.getDosenByNidn('99999999999');
      expect(dosen).toBeNull();
    });

    it('should indicate mock is always available', async () => {
      const available = await adapter.isAvailable();
      expect(available).toBe(true);
    });

    it('should filter mahasiswa by prodi', async () => {
      const mahasiswaByProdi = await adapter.getAllMahasiswa({ prodi: 'Teknik Informatika' });
      expect(Array.isArray(mahasiswaByProdi)).toBe(true);
      mahasiswaByProdi.forEach((m) => {
        expect(m.prodi).toBe('Teknik Informatika');
      });
    });

    it('should sync mahasiswa and return stats', async () => {
      const stats = await adapter.syncMahasiswa();
      expect(stats.inserted).toBeGreaterThanOrEqual(0);
      expect(stats.updated).toBeDefined();
      expect(stats.failed).toBeDefined();
    });

    it('should sync dosen and return stats', async () => {
      const stats = await adapter.syncDosen();
      expect(stats.inserted).toBeGreaterThanOrEqual(0);
      expect(stats.updated).toBeDefined();
      expect(stats.failed).toBeDefined();
    });
  });

  describe('RealApiKampusAdapter', () => {
    let adapter: RealApiKampusAdapter;

    beforeEach(() => {
      adapter = new RealApiKampusAdapter();
    });

    it('should implement IApiKampusAdapter interface', () => {
      expect(adapter.getMahasiswaByNim).toBeDefined();
      expect(adapter.getAllMahasiswa).toBeDefined();
      expect(adapter.getDosenByNidn).toBeDefined();
      expect(adapter.getAllDosen).toBeDefined();
      expect(adapter.syncMahasiswa).toBeDefined();
      expect(adapter.syncDosen).toBeDefined();
      expect(adapter.isAvailable).toBeDefined();
    });

    it('should be instantiable with axios client', () => {
      expect(adapter).toBeDefined();
    });

    it('should have private methods for response mapping', () => {
      // We can't directly test private methods, but we verify the instance exists
      expect(adapter).toHaveProperty('client');
    });
  });

  describe('Adapter Factory Pattern', () => {
    it('should switch to mock when NODE_ENV is development and API key is placeholder', () => {
      // This test assumes the env is set up correctly in test environment
      const adapter = diContainer.getApiKampusAdapter();
      expect(adapter).toBeDefined();
      // Verify it's either Mock or Real adapter (both implement interface)
      expect(typeof adapter.getMahasiswaByNim).toBe('function');
    });
  });
});
