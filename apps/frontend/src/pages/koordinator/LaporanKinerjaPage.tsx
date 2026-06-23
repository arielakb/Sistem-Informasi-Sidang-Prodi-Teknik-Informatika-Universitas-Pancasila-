import { useState, useEffect } from 'react';
import { useKoordinator } from '../../hooks/useApi';
import { useToastStore } from '../../stores/toastStore';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import BarChart from '../../components/charts/BarChart';
import StatCard from '../../components/charts/StatCard';
import { Download, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function LaporanKinerjaPage() {
  const { getLaporanKinerja, exportLaporan, loading } = useKoordinator();
  const addToast = useToastStore((s) => s.addToast);
  const [laporanData, setLaporanData] = useState<any>(null);

  useEffect(() => {
    loadLaporan();
  }, []);

  const loadLaporan = async () => {
    try {
      const data = await getLaporanKinerja();
      if (data) setLaporanData(data);
    } catch { /* handled */ }
  };

  const handleExport = async () => {
    try {
      const blob = await exportLaporan();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `laporan-kinerja-${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      addToast('Laporan berhasil diexport', 'success');
    } catch {
      addToast('Gagal mengexport laporan', 'error');
    }
  };

  // Mock data jika belum ada dari API
  const dosenKinerja = laporanData?.dosenKinerja || [
    { nama: 'Prof. Dr. Hadi Wijaya', totalMahasiswa: 12, aktif: 4, lulus: 8, rataLama: '2.1 sem' },
    { nama: 'Dr. Siti Aminah', totalMahasiswa: 10, aktif: 4, lulus: 6, rataLama: '2.3 sem' },
    { nama: 'Dr. Bambang Kusumo', totalMahasiswa: 8, aktif: 3, lulus: 5, rataLama: '2.5 sem' },
    { nama: 'Ir. Rina Susanti', totalMahasiswa: 15, aktif: 6, lulus: 9, rataLama: '2.0 sem' },
    { nama: 'Dr. Agus Salim', totalMahasiswa: 11, aktif: 4, lulus: 7, rataLama: '2.2 sem' },
  ];

  const chartData = dosenKinerja.map((d: any) => ({
    nama: d.nama.split(' ').slice(-1)[0],
    aktif: d.aktif,
    lulus: d.lulus,
  }));

  const dosenColumns = [
    { key: 'nama', header: 'Nama Dosen', render: (item: any) => <span className="font-medium">{item.nama}</span> },
    { key: 'totalMahasiswa', header: 'Total' },
    { key: 'aktif', header: 'Aktif', render: (item: any) => <Badge variant="warning">{item.aktif}</Badge> },
    { key: 'lulus', header: 'Lulus', render: (item: any) => <Badge variant="success">{item.lulus}</Badge> },
    { key: 'rataLama', header: 'Rata-rata Lama' },
    {
      key: 'rate',
      header: 'Tingkat Kelulusan',
      render: (item: any) => {
        const rate = Math.round((item.lulus / item.totalMahasiswa) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-pancasila-blue h-2 rounded-full transition-all" style={{ width: `${rate}%` }} />
            </div>
            <span className="text-sm font-medium text-gray-700">{rate}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Kinerja</h1>
          <p className="text-gray-500">Analisis kinerja dosen pembimbing</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
          <Download size={16} />
          Export Excel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Dosen" value={dosenKinerja.length} icon={<Users size={20} />} color="blue" />
        <StatCard title="Mahasiswa Aktif" value={dosenKinerja.reduce((a: number, d: any) => a + d.aktif, 0)} icon={<Clock size={20} />} color="yellow" />
        <StatCard title="Total Lulus" value={dosenKinerja.reduce((a: number, d: any) => a + d.lulus, 0)} icon={<CheckCircle size={20} />} color="green" />
        <StatCard title="Rata-rata Tingkat Lulus" value={`${Math.round(dosenKinerja.reduce((a: number, d: any) => a + (d.lulus / d.totalMahasiswa) * 100, 0) / dosenKinerja.length)}%`} icon={<TrendingUp size={20} />} color="blue" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <BarChart
          title="Distribusi Mahasiswa per Dosen"
          data={chartData}
          xKey="nama"
          bars={[
            { key: 'aktif', name: 'Aktif', color: '#F59E0B' },
            { key: 'lulus', name: 'Lulus', color: '#16A34A' },
          ]}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detail Kinerja Dosen</h2>
        </div>
        <DataTable columns={dosenColumns} data={dosenKinerja} loading={loading} />
      </div>
    </div>
  );
}
