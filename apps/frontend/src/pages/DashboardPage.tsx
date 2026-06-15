import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Status Skripsi', value: 'Pengajuan Topik', color: 'warning' as const },
    { label: 'Bimbingan', value: '0x', color: 'default' as const },
    { label: 'Jadwal Sidang', value: '-', color: 'default' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-pancasila-blue to-pancasila-blue-light rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat datang, {user?.nama}!</h1>
        <p className="mt-1 text-blue-100">Kelola progres skripsi Anda dengan mudah</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="mt-2">
              <Badge variant={stat.color}>{stat.value}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Ajukan Topik</Button>
          <Button variant="outline">Isi Logbook</Button>
          <Button variant="outline">Upload Berkas</Button>
        </div>
      </div>
    </div>
  );
}