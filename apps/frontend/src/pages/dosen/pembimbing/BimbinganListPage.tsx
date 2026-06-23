import { useState } from 'react';

import DataTable from '../../../components/ui/DataTable';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface Bimbingan {
  id: string;
  nama: string;
  nim: string;
  judul: string;
  tahap: 'Proposal' | 'Penelitian' | 'Komprehensif' | 'Sidang Skripsi';
  lastLogbook: string;
  logbookCount: number;
  status: 'Active' | 'Completed' | 'Pending';
}

export default function BimbinganListPage() {
  const [bimbingan] = useState<Bimbingan[]>([
    {
      id: '1',
      nama: 'Ahmad Rizki',
      nim: '2021101001',
      judul: 'Sistem Rekomendasi Film Berbasis Kolaboratif',
      tahap: 'Penelitian',
      lastLogbook: '2 hari lalu',
      logbookCount: 5,
      status: 'Active',
    },
    {
      id: '2',
      nama: 'Siti Nurhaliza',
      nim: '2021101002',
      judul: 'Analisis Sentimen Media Sosial Menggunakan NLP',
      tahap: 'Proposal',
      lastLogbook: 'Belum ada',
      logbookCount: 0,
      status: 'Pending',
    },
    {
      id: '3',
      nama: 'Budi Santoso',
      nim: '2021101003',
      judul: 'Prediksi Harga Saham dengan LSTM',
      tahap: 'Komprehensif',
      lastLogbook: '1 hari lalu',
      logbookCount: 8,
      status: 'Active',
    },
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBimbingan, setSelectedBimbingan] = useState<Bimbingan | null>(null);
  const [note, setNote] = useState('');

  const handleViewDetail = (item: Bimbingan) => {
    setSelectedBimbingan(item);
    setShowDetailModal(true);
  };

  const handleApprove = (id: string) => {
    alert(`Approved logbook for ${id}`);
    setShowDetailModal(false);
  };

  const handleReject = (id: string) => {
    alert(`Rejected logbook for ${id}. Note: ${note}`);
    setNote('');
    setShowDetailModal(false);
  };

  const columns = [
    { key: 'nama', label: 'Nama Mahasiswa', header: 'Nama Mahasiswa', width: '18%', render: (item: Bimbingan) => <span>{item.nama}</span> },
    { key: 'nim', label: 'NIM', header: 'NIM', width: '12%', render: (item: Bimbingan) => <span>{item.nim}</span> },
    { key: 'judul', label: 'Judul Skripsi', header: 'Judul Skripsi', width: '30%', render: (item: Bimbingan) => <span>{item.judul}</span> },
    { key: 'tahap', label: 'Tahap', header: 'Tahap', width: '12%', render: (item: Bimbingan) => <span>{item.tahap}</span> },
    { key: 'logbookCount', label: 'Total Logbook', header: 'Total Logbook', width: '10%', render: (item: Bimbingan) => <span className="font-semibold">{item.logbookCount}</span> },
    {
      key: 'lastLogbook',
      label: 'Logbook Terakhir',
      header: 'Logbook Terakhir',
      width: '12%',
      render: (item: Bimbingan) => <span className="text-sm text-gray-600">{item.lastLogbook}</span>,
    },
    {
      key: 'actions',
      label: 'Aksi',
      width: '6%',
      header: 'Aksi',
      render: (row: Bimbingan) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleViewDetail(row)}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Lihat
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Bimbingan</h1>
          <p className="text-gray-600 mt-1">Kelola data bimbingan mahasiswa Anda</p>
        </div>

        {/* Bimbingan Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Daftar Mahasiswa Bimbingan</h2>
          </div>
          <DataTable
            columns={columns}
            data={bimbingan}
          />
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Detail Bimbingan - ${selectedBimbingan?.nama}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <p className="mt-1 text-gray-900">{selectedBimbingan?.nama}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NIM</label>
            <p className="mt-1 text-gray-900">{selectedBimbingan?.nim}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul</label>
            <p className="mt-1 text-gray-900 text-sm">{selectedBimbingan?.judul}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tahap</label>
              <p className="mt-1 text-gray-900">{selectedBimbingan?.tahap}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Logbook</label>
              <p className="mt-1 text-gray-900">{selectedBimbingan?.logbookCount}</p>
            </div>
          </div>
          <Textarea
            placeholder="Catatan atau feedback..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              onClick={() => handleApprove(selectedBimbingan?.id || '')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Setujui
            </Button>
            <Button
              variant="danger"
              onClick={() => handleReject(selectedBimbingan?.id || '')}
              className="flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Tolak
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
