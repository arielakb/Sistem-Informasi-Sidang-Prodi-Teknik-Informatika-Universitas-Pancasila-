import { useState } from 'react';

import StatCard from '../../../components/charts/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Users, BookOpen, Clock, CheckCircle } from 'lucide-react';

interface MahasiswaBimbingan {
  id: string;
  nama: string;
  nim: string;
  judul: string;
  status: 'Menunggu' | 'Berjalan' | 'Selesai';
  logbookPending: number;
  lastUpdate: string;
}

export default function DosenPembimbingDashboard() {
  const [stats] = useState({
    totalMahasiswa: 5,
    logbookWaiting: 3,
    approvalNeeded: 2,
    completedThisMonth: 1,
  });

  const [mahasiswa] = useState<MahasiswaBimbingan[]>([
    {
      id: '1',
      nama: 'Ahmad Rizki',
      nim: '2021101001',
      judul: 'Sistem Rekomendasi Film Berbasis Kolaboratif',
      status: 'Berjalan',
      logbookPending: 2,
      lastUpdate: '2 jam lalu',
    },
    {
      id: '2',
      nama: 'Siti Nurhaliza',
      nim: '2021101002',
      judul: 'Analisis Sentimen Media Sosial Menggunakan NLP',
      status: 'Menunggu',
      logbookPending: 0,
      lastUpdate: '1 hari lalu',
    },
    {
      id: '3',
      nama: 'Budi Santoso',
      nim: '2021101003',
      judul: 'Prediksi Harga Saham dengan LSTM',
      status: 'Berjalan',
      logbookPending: 1,
      lastUpdate: 'Baru saja',
    },
  ]);

  const columns = [
    { 
      key: 'nama', 
      header: 'Nama Mahasiswa', 
      label: 'Nama Mahasiswa', 
      width: '20%',
      render: (row: MahasiswaBimbingan): React.ReactNode => <span>{row.nama}</span>
    },
    { 
      key: 'nim', 
      header: 'NIM', 
      label: 'NIM', 
      width: '12%',
      render: (row: MahasiswaBimbingan): React.ReactNode => <span>{row.nim}</span>
    },
    { 
      key: 'judul', 
      header: 'Judul Skripsi', 
      label: 'Judul Skripsi', 
      width: '35%',
      render: (row: MahasiswaBimbingan): React.ReactNode => <span>{row.judul}</span>
    },
    { 
      key: 'status', 
      header: 'Status', 
      label: 'Status', 
      width: '12%', 
      render: (row: MahasiswaBimbingan): React.ReactNode => {
        const variant = row.status === 'Selesai' ? 'success' : row.status === 'Berjalan' ? 'info' : 'warning';
        return <Badge variant={variant}>{row.status}</Badge>;
      } 
    },
    {
      key: 'logbookPending',
      header: 'Logbook Menunggu',
      label: 'Logbook Menunggu',
      width: '12%',
      render: (row: MahasiswaBimbingan): React.ReactNode => (
        <span className={row.logbookPending > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
          {row.logbookPending > 0 ? `${row.logbookPending} items` : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      label: 'Aksi',
      width: '9%',
      render: (row: MahasiswaBimbingan): React.ReactNode => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => alert(`View: ${row.nama}`)}>
            Lihat
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Pembimbing</h1>
          <p className="text-gray-600 mt-1">Kelola mahasiswa bimbingan Anda</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Mahasiswa"
            value={stats.totalMahasiswa}
            icon={<Users className="w-6 h-6" />}
            trend="0% minggu ini"
            color="blue" // Default aman atau warna biru
          />
          <StatCard
            title="Logbook Menunggu"
            value={stats.logbookWaiting}
            icon={<BookOpen className="w-6 h-6" />}
            trend="Perlu segera divalidasi"
            color="yellow" // Mengganti "warning" menjadi "yellow"
          />
          <StatCard
            title="Persetujuan Perlu"
            value={stats.approvalNeeded}
            icon={<Clock className="w-6 h-6" />}
            trend="Menunggu aksi Anda"
            color="red" // Mengganti "warning" menjadi "red" (atau "yellow" sesuai selera)
          />
          <StatCard
            title="Selesai Bulan Ini"
            value={stats.completedThisMonth}
            icon={<CheckCircle className="w-6 h-6" />}
            trend="+12% dari bulan lalu"
            color="green" // Mengganti "success" menjadi "green"
          />
        </div>

        {/* Mahasiswa List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Mahasiswa Bimbingan</h2>
          </div>
          <DataTable
            columns={columns}
            data={mahasiswa}
            searchable={true}
            // Menghapus searchPlaceholder karena tidak terdaftar di DataTableProps
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900">Logbook Menunggu Validasi</h3>
            <p className="text-blue-700 mt-1">3 entry dari 2 mahasiswa</p>
            <Button variant="primary" size="sm" className="mt-4">
              Validasi Logbook
            </Button>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900">Persetujuan Kelayakan</h3>
            <p className="text-purple-700 mt-1">2 mahasiswa perlu persetujuan</p>
            <Button variant="primary" size="sm" className="mt-4">
              Berikan Persetujuan
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}