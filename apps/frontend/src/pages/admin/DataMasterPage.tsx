import { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

// Mock data
const mahasiswaData = [
  { id: '1', nim: '20210001', nama: 'Ahmad Fauzi', prodi: 'Teknik Informatika', angkatan: 2021, status: 'AKTIF' },
  { id: '2', nim: '20210002', nama: 'Budi Santoso', prodi: 'Teknik Informatika', angkatan: 2021, status: 'AKTIF' },
  { id: '3', nim: '20210003', nama: 'Citra Lestari', prodi: 'Sistem Informasi', angkatan: 2021, status: 'AKTIF' },
];

const dosenData = [
  { id: '1', nidn: '001002003', nama: 'Prof. Dr. Hadi Wijaya', prodi: 'Teknik Informatika', jabatan: 'Profesor' },
  { id: '2', nidn: '001002004', nama: 'Dr. Siti Aminah', prodi: 'Teknik Informatika', jabatan: 'Lektor Kepala' },
];

export default function DataMasterPage() {
  const [activeTab, setActiveTab] = useState('mahasiswa');
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const mahasiswaColumns = [
    { key: 'nim', header: 'NIM' },
    { key: 'nama', header: 'Nama' },
    { key: 'prodi', header: 'Prodi' },
    { key: 'angkatan', header: 'Angkatan' },
    { key: 'status', header: 'Status', render: (item: any) => (
      <Badge variant="success">{item.status}</Badge>
    )},
    { key: 'aksi', header: 'Aksi', render: (item: any) => (
      <div className="flex gap-2">
        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
          <Edit size={16} />
        </button>
        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  const dosenColumns = [
    { key: 'nidn', header: 'NIDN' },
    { key: 'nama', header: 'Nama' },
    { key: 'prodi', header: 'Prodi' },
    { key: 'jabatan', header: 'Jabatan' },
    { key: 'aksi', header: 'Aksi', render: (item: any) => (
      <div className="flex gap-2">
        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
          <Edit size={16} />
        </button>
        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  const filteredMahasiswa = mahasiswaData.filter(m => 
    m.nama.toLowerCase().includes(search.toLowerCase()) ||
    m.nim.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Master</h1>
          <p className="text-gray-500">Kelola data mahasiswa dan dosen</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Tambah {activeTab === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'mahasiswa', label: 'Mahasiswa', count: mahasiswaData.length },
          { key: 'dosen', label: 'Dosen', count: dosenData.length },
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
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
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

      {/* Table */}
      <DataTable
        columns={activeTab === 'mahasiswa' ? mahasiswaColumns : dosenColumns}
        data={activeTab === 'mahasiswa' ? filteredMahasiswa : dosenData}
        emptyText={`Tidak ada ${activeTab} ditemukan`}
      />

      {/* Add Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Tambah ${activeTab === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}`}
        size="md"
      >
        <div className="space-y-4">
          <Input label="Nama" required />
          {activeTab === 'mahasiswa' ? (
            <>
              <Input label="NIM" required />
              <Input label="Prodi" required />
              <Input label="Angkatan" type="number" required />
            </>
          ) : (
            <>
              <Input label="NIDN" required />
              <Input label="Prodi" required />
              <Input label="Jabatan" required />
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}