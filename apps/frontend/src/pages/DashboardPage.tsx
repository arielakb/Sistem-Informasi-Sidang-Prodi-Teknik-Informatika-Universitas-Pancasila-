import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { GraduationCap, BookOpen, CalendarDays, FileText, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const getRoleDashboard = () => {
    switch (user?.role) {
      case 'MAHASISWA':
        return 'Mahasiswa';
      case 'DOSEN_PEMBIMBING':
        return 'Dosen Pembimbing';
      case 'DOSEN_PENGUJI':
        return 'Dosen Penguji';
      case 'KAPRODI':
      case 'KOORDINATOR':
        return 'Koordinator';
      case 'ADMIN':
      case 'ADMIN_AKADEMIK':
        return 'Administrator';
      default:
        return 'Dashboard';
    }
  };

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'MAHASISWA':
        return [
          { label: 'Status Skripsi', value: 'Pengajuan Topik', color: 'warning' as const },
          { label: 'Sesi Bimbingan', value: '0/10', color: 'default' as const },
          { label: 'Jadwal Sidang', value: '-', color: 'default' as const },
        ];
      case 'DOSEN_PEMBIMBING':
        return [
          { label: 'Mahasiswa Bimbingan', value: '5', color: 'default' as const },
          { label: 'Logbook Pending', value: '3', color: 'warning' as const },
          { label: 'Persetujuan Pending', value: '2', color: 'warning' as const },
        ];
      case 'DOSEN_PENGUJI':
        return [
          { label: 'Jadwal Menguji', value: '4', color: 'default' as const },
          { label: 'Penilaian Pending', value: '2', color: 'warning' as const },
          { label: 'Selesai', value: '8', color: 'default' as const },
        ];
      case 'KAPRODI':
      case 'KOORDINATOR':
        return [
          { label: 'Total Mahasiswa', value: '156', color: 'default' as const },
          { label: 'Sedang Bimbingan', value: '67', color: 'warning' as const },
          { label: 'Lulus', value: '48', color: 'default' as const },
        ];
      default:
        return [
          { label: 'User Aktif', value: '342', color: 'default' as const },
          { label: 'Jadwal Aktif', value: '24', color: 'default' as const },
          { label: 'System Status', value: 'Online', color: 'default' as const },
        ];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'MAHASISWA':
        return [
          { label: 'Ajukan Topik', icon: GraduationCap, path: '/skripsi/topik' },
          { label: 'Isi Logbook', icon: BookOpen, path: '/skripsi' },
          { label: 'Lihat Jadwal', icon: CalendarDays, path: '/jadwal' },
          { label: 'Upload Berkas', icon: FileText, path: '/berkas' },
        ];
      case 'DOSEN_PEMBIMBING':
        return [
          { label: 'Mahasiswa Bimbingan', icon: GraduationCap, path: '/bimbingan' },
          { label: 'Validasi Logbook', icon: BookOpen, path: '/bimbingan' },
          { label: 'Persetujuan', icon: FileText, path: '/bimbingan' },
        ];
      case 'DOSEN_PENGUJI':
        return [
          { label: 'Jadwal Menguji', icon: CalendarDays, path: '/penguji/jadwal' },
          { label: 'Isi Penilaian', icon: FileText, path: '/penguji/jadwal' },
        ];
      case 'KAPRODI':
      case 'KOORDINATOR':
        return [
          { label: 'Dashboard Akreditasi', icon: BarChart3, path: '/koordinator' },
          { label: 'Laporan Kinerja', icon: FileText, path: '/koordinator' },
        ];
      default:
        return [
          { label: 'Data Master', icon: GraduationCap, path: '/admin/data-master' },
          { label: 'Penjadwalan', icon: CalendarDays, path: '/admin/jadwal' },
        ];
    }
  };

  const stats = getStatsForRole();
  const actions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-pancasila-blue to-pancasila-blue-light rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold">Selamat datang, {user?.nama}!</h1>
        <p className="mt-1 text-blue-100">{getRoleDashboard()} • Dashboard Sistem Administrasi Skripsi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <Badge variant={stat.color}>Status</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-pancasila-blue hover:bg-blue-50 transition text-center"
              >
                <Icon className="w-6 h-6 text-pancasila-blue" />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}