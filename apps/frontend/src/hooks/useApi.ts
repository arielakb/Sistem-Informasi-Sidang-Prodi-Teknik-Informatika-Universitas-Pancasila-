import { useState, useCallback } from 'react';
import api from '../lib/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login gagal';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async (refreshToken: string) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return response.data.data;
    } catch (err: any) {
      throw err;
    }
  }, []);

  return { login, refreshToken, loading, error };
};

export const useMahasiswa = () => {
  const [loading, setLoading] = useState(false);

  const getProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/mahasiswa/profil');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProgress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/mahasiswa/progres');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const pengajuanTopik = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/mahasiswa/topik', data);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLogbook = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/mahasiswa/logbook', data);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadBerkasSidang = useCallback(async (data: FormData) => {
    setLoading(true);
    try {
      const response = await api.post('/mahasiswa/berkas-sidang', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadBerkasFinal = useCallback(async (data: FormData) => {
    setLoading(true);
    try {
      const response = await api.post('/mahasiswa/berkas-final', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getJadwal = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/mahasiswa/jadwal');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getProfile,
    getProgress,
    pengajuanTopik,
    createLogbook,
    uploadBerkasSidang,
    uploadBerkasFinal,
    getJadwal,
    loading,
  };
};

export const useDosen = () => {
  const [loading, setLoading] = useState(false);

  const validasiLogbook = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await api.patch(`/dosen/logbook/${id}/validasi`, data);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMahasiswaBimbingan = useCallback(async (dosenId?: string) => {
    setLoading(true);
    try {
      const response = await api.get('/dosen/bimbingan', {
        params: { dosenId },
      });
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { validasiLogbook, getMahasiswaBimbingan, loading };
};

export const useJadwal = () => {
  const [loading, setLoading] = useState(false);

  const getPublic = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await api.get('/public/jadwal', { params });
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAll = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/jadwal');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const jadwalkanSidang = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/jadwal', data);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getPublic, getAll, jadwalkanSidang, loading };
};

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/users', data);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllDeadline = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/deadline');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const setDeadline = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/deadline', data);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const syncApiKampus = useCallback(async (type: string) => {
    setLoading(true);
    try {
      const response = await api.post(`/admin/sync/${type}`);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const importCsv = useCallback(async (data: FormData) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/import-csv', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAllUsers, createUser, deleteUser, getAllDeadline, setDeadline, syncApiKampus, importCsv, loading };
};

export const useKoordinator = () => {
  const [loading, setLoading] = useState(false);

  const getDashboardAkreditasi = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/koordinator/dashboard-akreditasi');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLaporanKinerja = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/koordinator/laporan-kinerja');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const penugasanPembimbing = useCallback(async (mahasiswaId: string, data: any) => {
    setLoading(true);
    try {
      const response = await api.post(`/koordinator/penugasan-pembimbing/${mahasiswaId}`, data);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportLaporan = useCallback(async () => {
    const response = await api.get('/koordinator/export', { responseType: 'blob' });
    return response.data;
  }, []);

  return { getDashboardAkreditasi, getLaporanKinerja, penugasanPembimbing, exportLaporan, loading };
};

export const useSekretariat = () => {
  const [loading, setLoading] = useState(false);

  const getAllMahasiswa = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/sekretariat/mahasiswa');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllDosen = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/sekretariat/dosen');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPesertaMKSpesial = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/sekretariat/mk-spesial');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAllMahasiswa, getAllDosen, getPesertaMKSpesial, loading };
};

export const usePenilaian = () => {
  const [loading, setLoading] = useState(false);

  const isiPenilaian = useCallback(async (jadwalId: string, data: any) => {
    setLoading(true);
    try {
      const response = await api.post(`/penilaian/${jadwalId}`, data);
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHistori = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/penilaian/histori');
      return response.data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { isiPenilaian, getHistori, loading };
};
