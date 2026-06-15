import { useState } from 'react';
import StatCard from '../../components/charts/StatCard';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
  Users, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  BookOpen,
  FileText,
  Download
} from 'lucide-react';

// Mock data - nanti dari API
const statData = [
  { title: 'Total Mahasiswa', value: 245, subtitle: 'Aktif skripsi', icon: <Users size={20} />, color: 'blue' as const, trend: '+12%', trendUp: true },
  { title: 'Sedang Bimbingan', value: 128, subtitle: 'Dengan dosen', icon: <BookOpen size={20} />, color: 'yellow' as const },
  { title: 'Lulus Skripsi', value: 67, subtitle: 'Tahun ini', icon: <CheckCircle size={20} />, color: 'green' as const, trend: '+8%', trendUp: true },
  { title: 'Menunggu Sidang', value: 34, subtitle: 'Perlu penjadwalan', icon: <Clock size={20} />, color: 'red' as const },
];

const monthlyData = [
  { bulan: 'Jan', lulus: 5, bimbingan: 12, seminar: 3 },
  { bulan: 'Feb', lulus: 8, bimbingan: 15, seminar: 5 },
  { bulan: 'Mar', lulus: 12, bimbingan: 18, seminar: 7 },
  { bulan: 'Apr', lulus: 10, bimbingan: 20, seminar: 6 },
  { bulan: 'Mei', lulus: 15, bimbingan: 22, seminar: 8 },
  { bulan: 'Jun', lulus: 17, bimbingan: 25, seminar: 10 },
];

const statusData = [
  { name: 'Pengajuan Topik', value: 45, color: '#FFD700' },
  { name: 'Bimbingan', value: 128, color: '#0033A0' },
  { name: 'Seminar Proposal', value: 32, color: '#4A90D9' },
  { name: 'Sidang Komprehensif', value: 28, color: '#16A34A' },
  { name: 'Sidang Skripsi', value: 15, color: '#DC2626' },
  { name: 'Revisi', value: 12, color: '#F59E0B' },
];

const dosenPerformance = [
  { nama: 'Prof. Dr. Hadi Wijaya', mahasiswa: 12, lulus: 8, aktif: 4 },
  { nama: 'Dr. Siti Aminah', mahasiswa: 10, lulus: 6, aktif: 4 },
  { nama: 'Dr. Bambang Kusumo', mahasiswa: 8, lulus: 5, aktif: 3 },
  { nama: 'Ir. Rina Susanti', mahasiswa: 15, lulus: 9, aktif: 6 },
  { nama: 'Dr. Agus Salim', mahasiswa: 11, lulus: 7, aktif: 4 },
];

export default function KoordinatorDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const dosenColumns = [
    { key: 'nama', header: 'Dosen Pembimbing' },
    { key: 'mahasiswa', header: 'Total' },
    { key: 'aktif', header: 'Aktif', render: (item: any) => (
      <Badge variant="warning">{item.aktif}</Badge>
    )},
    { key: 'lulus', header: 'Lulus', render: (item: any) => (
      <Badge variant="success">{item.lulus}</Badge>
    )},
    { key: 'rate', header: 'Kelulusan', render: (item: any) => (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-pancasila-blue h-2 rounded-full" 
          style={{ width: `${(item.lulus / item.mahasiswa) * 100}%` }}
        />
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Koordinator</h1>
          <p className="text-gray-500">Monitoring dan laporan prodi</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Export Laporan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statData.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'dosen', label: 'Kinerja Dosen' },
            { key: 'akreditasi', label: 'Indikator Akreditasi' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-pancasila-blue text-pancasila-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart
                  title="Progres Bulanan"
                  data={monthlyData}
                  xKey="bulan"
                  bars={[
                    { key: 'lulus', name: 'Lulus', color: '#16A34A' },
                    { key: 'bimbingan', name: 'Bimbingan', color: '#0033A0' },
                    { key: 'seminar', name: 'Seminar', color: '#FFD700' },
                  ]}
                />
                <PieChart
                  title="Distribusi Status Skripsi"
                  data={statusData}
                />
              </div>
            </div>
          )}

          {activeTab === 'dosen' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kinerja Dosen Pembimbing</h3>
              <DataTable
                columns={dosenColumns}
                data={dosenPerformance}
                emptyText="Tidak ada data dosen"
              />
            </div>
          )}

          {activeTab === 'akreditasi' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Indikator 1</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">85%</p>
                  <p className="text-xs text-blue-500">Kelulusan tepat waktu</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Indikator 2</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">92%</p>
                  <p className="text-xs text-green-500">Dosen berkualifikasi S2</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <p className="text-sm text-yellow-600 font-medium">Indikator 3</p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">78%</p>
                  <p className="text-xs text-yellow-500">Publikasi mahasiswa</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Catatan Akreditasi</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    Rata-rata waktu penyelesaian skripsi: 2.3 semester
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    Rasio dosen:mahasiswa = 1:8 (ideal 1:10)
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText size={14} className="text-yellow-500" />
                    Perlu perbaikan: publikasi di jurnal nasional
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}