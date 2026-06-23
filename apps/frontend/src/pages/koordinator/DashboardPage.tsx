import { useState } from 'react';
import StatCard from '../../components/charts/StatCard';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import LineChartComponent, { AreaChartComponent } from '../../components/charts/LineChart';
import MetricCard from '../../components/charts/MetricCard';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  BookOpen,
  FileText,
  Download,
  BarChart3,
  Activity
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

// Additional data for enhanced charts
const enrollmentTrendData = [
  { tahun: '2021', total: 120, lulus: 45, aktif: 75 },
  { tahun: '2022', total: 150, lulus: 68, aktif: 82 },
  { tahun: '2023', total: 180, lulus: 92, aktif: 88 },
  { tahun: '2024', total: 210, lulus: 128, aktif: 82 },
  { tahun: '2025', total: 245, lulus: 145, aktif: 100 },
];

const gradeDistributionData = [
  { name: 'A (85-100)', value: 52, color: '#16A34A' },
  { name: 'A- (80-84)', value: 38, color: '#4ADE80' },
  { name: 'B+ (75-79)', value: 45, color: '#60A5FA' },
  { name: 'B (70-74)', value: 28, color: '#FBBF24' },
  { name: 'B- (65-69)', value: 12, color: '#F97316' },
];

const completionRateData = [
  { fase: 'Topik', persentase: 100, target: 100 },
  { fase: 'Logbook', persentase: 95, target: 100 },
  { fase: 'Seminar', persentase: 88, target: 95 },
  { fase: 'Berkas', persentase: 85, target: 90 },
  { fase: 'Sidang', persentase: 62, target: 80 },
  { fase: 'Final', persentase: 34, target: 70 },
];

const akreditasiMetrics = [
  {
    title: 'Kelulusan Tepat Waktu',
    value: '85%',
    subtitle: 'Dalam 4 semester',
    trend: { value: 5, isPositive: true, label: 'vs tahun lalu' },
    variant: 'green' as const,
  },
  {
    title: 'Dosen Berkualifikasi S2+',
    value: '92%',
    subtitle: '23 dari 25 dosen',
    trend: { value: 0, isPositive: true, label: 'Stabil' },
    variant: 'blue' as const,
  },
  {
    title: 'IPK Rata-rata Lulusan',
    value: '3.42',
    subtitle: 'Dari skala 4.00',
    trend: { value: 3, isPositive: true, label: 'Meningkat' },
    variant: 'purple' as const,
  },
  {
    title: 'Publikasi Jurnal',
    value: '18',
    subtitle: 'Artikel mahasiswa',
    trend: { value: 12, isPositive: true, label: 'Tahun ini' },
    variant: 'yellow' as const,
  },
  {
    title: 'Kepuasan Alumni',
    value: '4.6/5.0',
    subtitle: 'Dari survey 120 alumni',
    trend: { value: 2, isPositive: true, label: 'Puas/sangat puas' },
    variant: 'green' as const,
  },
  {
    title: 'Rata-rata Lama Studi',
    value: '2.3 sem',
    subtitle: 'Lebih cepat dari target',
    trend: { value: 8, isPositive: true, label: 'Peningkatan' },
    variant: 'blue' as const,
  },
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
              {/* Akreditasi Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {akreditasiMetrics.map((metric, idx) => (
                  <MetricCard key={idx} {...metric} />
                ))}
              </div>

              {/* Advanced Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChartComponent
                  title="Tren Enrollment & Kelulusan"
                  data={enrollmentTrendData}
                  xKey="tahun"
                  lines={[
                    { key: 'total', name: 'Total Mahasiswa', color: '#0033A0' },
                    { key: 'lulus', name: 'Lulus', color: '#16A34A' },
                    { key: 'aktif', name: 'Aktif', color: '#FFD700' },
                  ]}
                />
                <PieChart
                  title="Distribusi Nilai Akhir Lulusan"
                  data={gradeDistributionData}
                />
              </div>

              {/* Completion Rate Chart */}
              <AreaChartComponent
                title="Tingkat Penyelesaian per Fase (Target vs Aktual)"
                data={completionRateData}
                xKey="fase"
                areas={[
                  { key: 'persentase', name: 'Realisasi', color: '#0033A0' },
                  { key: 'target', name: 'Target', color: '#16A34A' },
                ]}
                height={250}
              />

              {/* Accreditation Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BarChart3 size={18} className="text-blue-600" />
                      Analisis & Rekomendasi Akreditasi
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <TrendingUp size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Kekuatan:</strong> Kelulusan tepat waktu melampaui standar (85% vs target 80%)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Activity size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Keunggulan:</strong> Rata-rata IPK lulusan 3.42 menunjukkan kualitas akademik baik</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Peningkatan Diperlukan:</strong> Publikasi jurnal nasional (target 25, realisasi 18)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span><strong>Target 2025:</strong> Tingkatkan publikasi ke 25, pertahankan kelulusan 85%+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}