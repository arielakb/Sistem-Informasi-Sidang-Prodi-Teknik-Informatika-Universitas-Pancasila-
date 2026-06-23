import { useState, useEffect } from 'react';
import { useSekretariat } from '../../hooks/useApi';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import StatCard from '../../components/charts/StatCard';
import { Users, GraduationCap, BookOpen, Search } from 'lucide-react';

export default function SekretariatDashboardPage() {
  const { getAllMahasiswa, getAllDosen, getPesertaMKSpesial, loading } = useSekretariat();
  const [activeTab, setActiveTab] = useState('mahasiswa');
  const [mahasiswaList, setMahasiswaList] = useState<any[]>([]);
  const [dosenList, setDosenList] = useState<any[]>([]);
  const [mkSpesialList, setMkSpesialList] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mhs, dsn, mk] = await Promise.all([
        getAllMahasiswa(),
        getAllDosen(),
        getPesertaMKSpesial(),
      ]);
      if (mhs) setMahasiswaList(mhs);
      if (dsn) setDosenList(dsn);
      if (mk) setMkSpesialList(mk);
    } catch { /* handled */ }
  };

  const mahasiswaColumns = [
    { key: 'nim', header: 'NIM' },
    { key: 'nama', header: 'Nama', render: (item: any) => <span className="font-medium">{item.nama}</span> },
    { key: 'prodi', header: 'Prodi', render: (item: any) => item.prodi?.nama || item.prodi || '-' },
    { key: 'angkatan', header: 'Angkatan' },
    {
      key: 'statusSkripsi',
      header: 'Status',
      render: (item: any) => {
        const status = item.statusSkripsi || 'PENGAJUAN_TOPIK';
        const variant = status === 'LULUS' ? 'success' : status === 'DITOLAK' ? 'danger' : 'warning';
        return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>;
      },
    },
    {
      key: 'pembimbing',
      header: 'Pembimbing',
      render: (item: any) => item.pembimbing1?.nama || <span className="text-gray-400 text-sm">Belum ditugaskan</span>,
    },
  ];

  const dosenColumns = [
    { key: 'nidn', header: 'NIDN' },
    { key: 'nama', header: 'Nama', render: (item: any) => <span className="font-medium">{item.nama}</span> },
    { key: 'prodi', header: 'Prodi', render: (item: any) => item.prodi?.nama || item.prodi || '-' },
    { key: 'jabatan', header: 'Jabatan', render: (item: any) => item.jabatan || '-' },
    {
      key: 'role',
      header: 'Peran',
      render: (item: any) => (
        <div className="flex gap-1 flex-wrap">
          {item.isPembimbing && <Badge variant="info">Pembimbing</Badge>}
          {item.isPenguji && <Badge variant="warning">Penguji</Badge>}
          {item.isKoordinator && <Badge variant="success">Koordinator</Badge>}
        </div>
      ),
    },
  ];

  const mkSpesialColumns = [
    { key: 'mahasiswa', header: 'Mahasiswa', render: (item: any) => <span className="font-medium">{item.mahasiswa?.nama || '-'}</span> },
    { key: 'nim', header: 'NIM', render: (item: any) => item.mahasiswa?.nim || '-' },
    { key: 'alasan', header: 'Alasan' },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => {
        const v = item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'danger' : 'warning';
        return <Badge variant={v}>{item.status}</Badge>;
      },
    },
    { key: 'createdAt', header: 'Tanggal', render: (item: any) => new Date(item.createdAt).toLocaleDateString('id-ID') },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'mahasiswa': return mahasiswaList;
      case 'dosen': return dosenList;
      case 'mk-spesial': return mkSpesialList;
      default: return [];
    }
  };

  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'mahasiswa': return mahasiswaColumns;
      case 'dosen': return dosenColumns;
      case 'mk-spesial': return mkSpesialColumns;
      default: return [];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Sekretariat</h1>
        <p className="text-gray-500">Kelola data mahasiswa, dosen, dan MK Spesial</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Mahasiswa" value={mahasiswaList.length} icon={<GraduationCap size={20} />} color="blue" />
        <StatCard title="Total Dosen" value={dosenList.length} icon={<Users size={20} />} color="green" />
        <StatCard title="Peserta MK Spesial" value={mkSpesialList.length} icon={<BookOpen size={20} />} color="yellow" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'mahasiswa', label: 'Mahasiswa', count: mahasiswaList.length },
            { key: 'dosen', label: 'Dosen', count: dosenList.length },
            { key: 'mk-spesial', label: 'MK Spesial', count: mkSpesialList.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-pancasila-blue text-pancasila-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Cari ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pancasila-blue outline-none"
            />
          </div>
        </div>

        <DataTable
          columns={getCurrentColumns()}
          data={getCurrentData()}
          loading={loading}
          emptyText={`Tidak ada data ${activeTab}`}
        />
      </div>
    </div>
  );
}
