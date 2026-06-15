import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useMahasiswaBimbingan = () => {
  return useQuery({
    queryKey: ['mahasiswa', 'bimbingan'],
    queryFn: async () => {
      const res = await api.get('/mahasiswa/bimbingan');
      return res.data.data;
    },
  });
};

export const useValidasiLogbook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, catatan }: { id: string; status: string; catatan?: string }) => {
      const res = await api.patch(`/pembimbing/logbook/${id}/validasi`, { status, catatan });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa', 'bimbingan'] });
    },
  });
};

export const useJadwalMenguji = () => {
  return useQuery({
    queryKey: ['jadwal', 'menguji'],
    queryFn: async () => {
      const res = await api.get('/penguji/jadwal');
      return res.data.data;
    },
  });
};

export const useSubmitPenilaian = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { jadwalId: string; nilaiPresentasi: number; nilaiMateri: number; nilaiTeknik: number; catatan: string }) => {
      const res = await api.post(`/penguji/penilaian/${data.jadwalId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal', 'menguji'] });
    },
  });
};