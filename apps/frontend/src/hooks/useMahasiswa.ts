import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Mahasiswa } from '../types';

export const useMahasiswaProfile = () => {
  return useQuery({
    queryKey: ['mahasiswa', 'profile'],
    queryFn: async () => {
      const res = await api.get('/mahasiswa/profil');
      return res.data.data as Mahasiswa;
    },
  });
};

export const usePengajuanTopik = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { topik: string; judul: string; deskripsi?: string }) => {
      const res = await api.post('/mahasiswa/topik', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa', 'profile'] });
    },
  });
};