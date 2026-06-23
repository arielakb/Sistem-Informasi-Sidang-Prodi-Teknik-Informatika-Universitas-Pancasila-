import { useState } from 'react';
import { usePublicJadwal } from '../hooks/useJadwal';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import { JadwalSidang } from '../types';
import { Search, Calendar } from 'lucide-react';

export default function PublicJadwalPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const { data: jadwal, isLoading } = usePublicJadwal({ status: filterStatus || undefined });

  const columns = [
    { key: 'mahasiswa.nama', header: 'Mahasiswa', render: (item: JadwalSidang) => (
      <div>
        <p className="font-medium">{item.mahasiswa.nama}</p>
        <p className="text-xs text-gray-500">{item.mahasiswa.nim}</p>
      </div>
    )},
    { key: 'jenisSidang', header: 'Jenis' },
    { key: 'tanggal', header: 'Tanggal', render: (item: JadwalSidang) => (
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-gray-400" />
        {new Date(item.tanggal).toLocaleDateString('id-ID')}
      </div>
    )},
    { key: 'ruangan.nama', header: 'Ruangan', render: (item: JadwalSidang) => item.ruangan.nama },
    { key: 'status', header: 'Status', render: (item: JadwalSidang) => {
      const variants: Record<string, any> = {
        DIJADWALKAN: 'warning',
        BERLANGSUNG: 'info',
        SELESAI: 'success',
        DIBATALKAN: 'danger',
      };
      return <Badge variant={variants[item.status] || 'default'}>{item.status}</Badge>;
    }},
  ];

  const filteredData = jadwal?.filter(j => 
    !search || j.mahasiswa.nama.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-pancasila-blue text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-pancasila-blue font-bold">UP</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">SIAS</h1>
              <p className="text-xs text-blue-200">Sistem Administrasi Skripsi</p>
            </div>
          </div>
          <a href="/login" className="px-4 py-2 bg-white text-pancasila-blue rounded-lg font-medium hover:bg-blue-50 transition">
            Login
          </a>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-pancasila-blue to-pancasila-blue-light rounded-xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold">Jadwal Sidang</h2>
          <p className="text-blue-100 mt-1">Universitas Pancasila</p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pancasila-blue outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pancasila-blue outline-none bg-white"
          >
            <option value="">Semua Status</option>
            <option value="DIJADWALKAN">Dijadwalkan</option>
            <option value="BERLANGSUNG">Berlangsung</option>
            <option value="SELESAI">Selesai</option>
          </select>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
          emptyText="Belum ada jadwal sidang"
        />
      </div>
    </div>
  );
}