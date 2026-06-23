import { useState, useEffect } from 'react';
import { useKoordinator } from '../../hooks/useApi';
import { useToastStore } from '../../stores/toastStore';
import api from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { Users, UserPlus, Search } from 'lucide-react';

export default function PenugasanPembimbingPage() {
  const { penugasanPembimbing, loading } = useKoordinator();
  const addToast = useToastStore((s) => s.addToast);
  const [mahasiswaList, setMahasiswaList] = useState<any[]>([]);
  const [dosenList, setDosenList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<any>(null);
  const [pembimbing1Id, setPembimbing1Id] = useState('');
  const [pembimbing2Id, setPembimbing2Id] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mhsRes, dosenRes] = await Promise.all([
        api.get('/admin/users?role=MAHASISWA'),
        api.get('/admin/users?role=DOSEN_PEMBIMBING'),
      ]);
      if (mhsRes.data.data) setMahasiswaList(mhsRes.data.data);
      if (dosenRes.data.data) setDosenList(dosenRes.data.data);
    } catch { /* handled */ }
  };

  const handleAssign = async () => {
    if (!selectedMahasiswa || !pembimbing1Id) {
      addToast('Pilih mahasiswa dan minimal 1 pembimbing', 'warning');
      return;
    }
    try {
      await penugasanPembimbing(selectedMahasiswa.id, {
        pembimbing1Id,
        pembimbing2Id: pembimbing2Id || undefined,
      });
      addToast('Penugasan pembimbing berhasil', 'success');
      setShowModal(false);
      setSelectedMahasiswa(null);
      setPembimbing1Id('');
      setPembimbing2Id('');
      loadData();
    } catch {
      addToast('Gagal menugaskan pembimbing', 'error');
    }
  };

  const filteredMahasiswa = mahasiswaList.filter(m =>
    m.nama?.toLowerCase().includes(search.toLowerCase()) ||
    m.nim?.includes(search)
  );

  const columns = [
    { key: 'nim', header: 'NIM', render: (item: any) => item.mahasiswa?.nim || item.nim || '-' },
    { key: 'nama', header: 'Nama', render: (item: any) => <span className="font-medium">{item.mahasiswa?.nama || item.nama || '-'}</span> },
    {
      key: 'pembimbing1',
      header: 'Pembimbing 1',
      render: (item: any) => item.mahasiswa?.pembimbing1?.nama ? (
        <Badge variant="success">{item.mahasiswa.pembimbing1.nama}</Badge>
      ) : <Badge variant="warning">Belum ditugaskan</Badge>,
    },
    {
      key: 'pembimbing2',
      header: 'Pembimbing 2',
      render: (item: any) => item.mahasiswa?.pembimbing2?.nama ? (
        <Badge variant="success">{item.mahasiswa.pembimbing2.nama}</Badge>
      ) : <span className="text-gray-400 text-sm">-</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => item.mahasiswa?.statusSkripsi ? (
        <Badge variant="info">{item.mahasiswa.statusSkripsi.replace(/_/g, ' ')}</Badge>
      ) : <span className="text-gray-400 text-sm">-</span>,
    },
    {
      key: 'aksi',
      header: 'Aksi',
      render: (item: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedMahasiswa(item);
            setShowModal(true);
          }}
          className="flex items-center gap-1"
        >
          <UserPlus size={14} />
          Tugaskan
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penugasan Pembimbing</h1>
          <p className="text-gray-500">Tugaskan dosen pembimbing untuk mahasiswa</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Users size={20} className="text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Mahasiswa</p>
              <p className="text-2xl font-bold text-gray-900">{mahasiswaList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><UserPlus size={20} className="text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Sudah Ditugaskan</p>
              <p className="text-2xl font-bold text-green-600">{mahasiswaList.filter(m => m.mahasiswa?.pembimbing1).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><Users size={20} className="text-orange-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Dosen Pembimbing</p>
              <p className="text-2xl font-bold text-orange-600">{dosenList.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Cari mahasiswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pancasila-blue outline-none"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredMahasiswa} emptyText="Tidak ada data mahasiswa" />

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tugaskan Pembimbing" size="md">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Mahasiswa</p>
            <p className="font-semibold text-gray-900">{selectedMahasiswa?.mahasiswa?.nama || selectedMahasiswa?.nama || '-'}</p>
            <p className="text-sm text-gray-500">{selectedMahasiswa?.mahasiswa?.nim || selectedMahasiswa?.nim || ''}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pembimbing 1 *</label>
            <select
              value={pembimbing1Id}
              onChange={(e) => setPembimbing1Id(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Pembimbing 1 --</option>
              {dosenList.map((d: any) => (
                <option key={d.id} value={d.dosen?.id || d.id}>{d.dosen?.nama || d.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pembimbing 2 (opsional)</label>
            <select
              value={pembimbing2Id}
              onChange={(e) => setPembimbing2Id(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Pembimbing 2 --</option>
              {dosenList.filter(d => (d.dosen?.id || d.id) !== pembimbing1Id).map((d: any) => (
                <option key={d.id} value={d.dosen?.id || d.id}>{d.dosen?.nama || d.nama}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={handleAssign}>Tugaskan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
