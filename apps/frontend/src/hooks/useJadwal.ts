import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { JadwalSidang } from '../types';

export const usePublicJadwal = (params?: { status?: string; search?: string }) => {
  return useQuery({
    queryKey: ['jadwal', 'public', params],
    queryFn: async () => {
      const res = await api.get('/public/jadwal', { params });
      return res.data.data as JadwalSidang[];
    },
  });
};