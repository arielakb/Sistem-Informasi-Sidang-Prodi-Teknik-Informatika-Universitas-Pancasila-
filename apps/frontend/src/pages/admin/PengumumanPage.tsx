import { useState } from 'react';

import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { Plus, Edit2, Trash2, Send, } from 'lucide-react';

interface Pengumuman {
  id: string;
  judul: string;
  konten: string;
  target: string;
  tanggal: string;
  penulis: string;
  status: 'Published' | 'Draft';
  views?: number;
}

export default function PengumumanPage() {
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([
    {
      id: '1',
      judul: 'Jadwal Sidang Skripsi Juni 2026',
      konten: 'Pengumuman jadwal sidang skripsi untuk mahasiswa angkatan 2021...',
      target: 'Semua Mahasiswa',
      tanggal: '2026-06-14',
      penulis: 'Admin',
      status: 'Published',
      views: 142,
    },
    {
      id: '2',
      judul: 'Pembukaan Pendaftaran Bimbingan',
      konten: 'Pembukaan pendaftaran bimbingan skripsi untuk mahasiswa baru...',
      target: 'Mahasiswa',
      tanggal: '2026-06-12',
      penulis: 'Koordinator',
      status: 'Published',
      views: 98,
    },
    {
      id: '3',
      judul: 'Perubahan Jadwal Seminar (Draft)',
      konten: 'Akan ada perubahan jadwal seminar proposal untuk...',
      target: 'Dosen',
      tanggal: '2026-06-15',
      penulis: 'Admin',
      status: 'Draft',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    judul: '',
    konten: '',
    target: 'Semua',
    attachment: '',
  });

  const resetForm = () => {
    setForm({ judul: '', konten: '', target: 'Semua', attachment: '' });
    setEditingId(null);
  };

  const handleEdit = (item: Pengumuman) => {
    setEditingId(item.id);
    setForm({
      judul: item.judul,
      konten: item.konten,
      target: item.target,
      attachment: '',
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.judul.trim() || !form.konten.trim()) {
      alert('Judul dan konten tidak boleh kosong');
      return;
    }

    if (editingId) {
      setPengumuman(
        pengumuman.map((p) =>
          p.id === editingId
            ? {
                ...p,
                judul: form.judul,
                konten: form.konten,
                target: form.target,
              }
            : p
        )
      );
      alert('Pengumuman berhasil diperbarui');
    } else {
      const newPengumuman: Pengumuman = {
        id: Date.now().toString(),
        judul: form.judul,
        konten: form.konten,
        target: form.target,
        tanggal: new Date().toLocaleDateString('id-ID'),
        penulis: 'Admin',
        status: 'Draft',
      };
      setPengumuman([newPengumuman, ...pengumuman]);
      alert('Pengumuman baru berhasil dibuat');
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      setPengumuman(pengumuman.filter((p) => p.id !== id));
      alert('Pengumuman berhasil dihapus');
    }
  };

  const handlePublish = (id: string) => {
    setPengumuman(
      pengumuman.map((p) =>
        p.id === id ? { ...p, status: 'Published' as const } : p
      )
    );
    alert('Pengumuman berhasil dipublikasikan');
  };

    const columns = [
    {
        key: 'judul',
        header: 'Judul',
        label: 'Judul',
        width: '25%',
        // render hanya menerima 1 argumen (seluruh objek Pengumuman)
        render: (row: Pengumuman) => (
        <div>
            <p className="font-semibold text-gray-900">{row.judul}</p>
            <p className="text-xs text-gray-500 mt-1">
            {row.konten.substring(0, 50)}...
            </p>
        </div>
        ),
    },
    { 
        key: 'target', 
        header: 'Target', 
        label: 'Target', 
        width: '12%',
        render: (row: Pengumuman) => <span>{row.target}</span>
    },
    {
        key: 'tanggal',
        header: 'Tanggal',
        label: 'Tanggal',
        width: '12%',
        render: (row: Pengumuman) => new Date(row.tanggal).toLocaleDateString('id-ID'),
    },
    {
        key: 'status',
        header: 'Status',
        label: 'Status',
        width: '12%',
        render: (row: Pengumuman) => (
        <Badge variant={row.status === 'Published' ? 'success' : 'warning'}>
            {row.status === 'Published' ? 'Dipublikasikan' : 'Draft'}
        </Badge>
        ),
    },
    {
        key: 'views',
        header: 'Views',
        label: 'Views',
        width: '10%',
        render: (row: Pengumuman) => (
        <span className="text-sm text-gray-600">{row.views || 0}</span>
        ),
    },
    {
        key: 'actions',
        header: 'Aksi',
        label: 'Aksi',
        width: '29%',
        render: (row: Pengumuman) => (
        <div className="flex gap-2">
            <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row)}
            className="flex items-center gap-1"
            >
            <Edit2 className="w-4 h-4" />
            Edit
            </Button>
            {row.status === 'Draft' && (
            <Button
                variant="primary"
                size="sm"
                onClick={() => handlePublish(row.id)}
                className="flex items-center gap-1"
            >
                <Send className="w-4 h-4" />
                Publikasikan
            </Button>
            )}
            <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="flex items-center gap-1"
            >
            <Trash2 className="w-4 h-4" />
            Hapus
            </Button>
        </div>
        ),
    },
    ];
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Pengumuman</h1>
            <p className="text-gray-600 mt-1">
              Buat dan kelola pengumuman untuk pengguna sistem
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Buat Pengumuman Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div>
              <p className="text-sm text-gray-600">Total Pengumuman</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {pengumuman.length}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-gray-600">Dipublikasikan</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {pengumuman.filter((p) => p.status === 'Published').length}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {pengumuman.filter((p) => p.status === 'Draft').length}
              </p>
            </div>
          </Card>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Daftar Pengumuman</h2>
          </div>
          <DataTable columns={columns} data={pengumuman} searchable={false} />
        </div>

        {/* Info */}
        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3">📌 Tips Pengumuman</h3>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Gunakan judul yang jelas dan informatif</li>
            <li>• Sertakan deadline atau tanggal penting</li>
            <li>• Tentukan target audiens dengan spesifik</li>
            <li>• Periksa kembali konten sebelum mempublikasikan</li>
            <li>• Pengumuman yang dipublikasikan akan terlihat di dashboard pengguna</li>
          </ul>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Pengumuman *
            </label>
            <Input
              placeholder="Masukkan judul pengumuman..."
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konten *
            </label>
            <Textarea
              placeholder="Masukkan konten pengumuman..."
              value={form.konten}
              onChange={(e) => setForm({ ...form, konten: e.target.value })}
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audiens
            </label>
            <select
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Pengguna</option>
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Dosen">Dosen</option>
              <option value="Admin">Admin & Koordinator</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>Preview:</strong> Pengumuman ini akan ditampilkan di
              dashboard semua pengguna dengan status{' '}
              <strong>{editingId ? 'Draft (dapat diubah)' : 'Draft'}</strong>.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex-1"
            >
              {editingId ? 'Perbarui' : 'Buat'} Pengumuman
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
