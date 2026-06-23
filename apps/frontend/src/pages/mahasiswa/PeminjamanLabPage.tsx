import { useState } from 'react';
import { useToastStore } from '../../stores/toastStore';
import api from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { Building2, Plus, CalendarDays, Clock } from 'lucide-react';

export default function PeminjamanLabPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ruanganId: '',
    tanggalPinjam: '',
    waktuMulai: '',
    waktuSelesai: '',
    keperluan: '',
  });
  const [peminjamanList] = useState<any[]>([]);

  const handleSubmit = async () => {
    if (!form.ruanganId || !form.tanggalPinjam || !form.waktuMulai || !form.waktuSelesai || !form.keperluan) {
      addToast('Semua field wajib diisi', 'warning');
      return;
    }
    setLoading(true);
    try {
      await api.post('/mahasiswa/peminjaman-lab', {
        ...form,
        tanggalPinjam: new Date(form.tanggalPinjam).toISOString(),
        waktuMulai: new Date(`${form.tanggalPinjam}T${form.waktuMulai}`).toISOString(),
        waktuSelesai: new Date(`${form.tanggalPinjam}T${form.waktuSelesai}`).toISOString(),
      });
      addToast('Peminjaman berhasil diajukan', 'success');
      setShowModal(false);
      setForm({ ruanganId: '', tanggalPinjam: '', waktuMulai: '', waktuSelesai: '', keperluan: '' });
    } catch {
      addToast('Gagal mengajukan peminjaman', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'MENUNGGU': return <Badge variant="warning">Menunggu</Badge>;
      case 'DISETUJUI': return <Badge variant="success">Disetujui</Badge>;
      case 'DITOLAK': return <Badge variant="danger">Ditolak</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    { key: 'ruangan', header: 'Ruangan', render: (item: any) => item.ruangan?.nama || '-' },
    { key: 'tanggalPinjam', header: 'Tanggal', render: (item: any) => new Date(item.tanggalPinjam).toLocaleDateString('id-ID') },
    { key: 'waktu', header: 'Waktu', render: (item: any) => (
      <span>{new Date(item.waktuMulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(item.waktuSelesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
    )},
    { key: 'keperluan', header: 'Keperluan' },
    { key: 'status', header: 'Status', render: (item: any) => statusBadge(item.status) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Peminjaman Lab</h1>
          <p className="text-gray-500">Ajukan peminjaman ruangan atau laboratorium</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Ajukan Peminjaman
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Peminjaman</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{peminjamanList.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Menunggu</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{peminjamanList.filter(p => p.status === 'MENUNGGU').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Disetujui</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{peminjamanList.filter(p => p.status === 'DISETUJUI').length}</p>
        </div>
      </div>

      {/* Riwayat */}
      <DataTable columns={columns} data={peminjamanList} emptyText="Belum ada riwayat peminjaman" />

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ajukan Peminjaman Lab" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ruangan *</label>
            <select
              value={form.ruanganId}
              onChange={(e) => setForm({ ...form, ruanganId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Ruangan --</option>
              <option value="lab-1">Lab Komputer 1</option>
              <option value="lab-2">Lab Komputer 2</option>
              <option value="sidang-a">Ruang Sidang A</option>
            </select>
          </div>
          <Input
            label="Tanggal Pinjam *"
            type="date"
            value={form.tanggalPinjam}
            onChange={(e: any) => setForm({ ...form, tanggalPinjam: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Waktu Mulai *"
              type="time"
              value={form.waktuMulai}
              onChange={(e: any) => setForm({ ...form, waktuMulai: e.target.value })}
            />
            <Input
              label="Waktu Selesai *"
              type="time"
              value={form.waktuSelesai}
              onChange={(e: any) => setForm({ ...form, waktuSelesai: e.target.value })}
            />
          </div>
          <Textarea
            label="Keperluan *"
            placeholder="Jelaskan keperluan peminjaman..."
            value={form.keperluan}
            onChange={(e: any) => setForm({ ...form, keperluan: e.target.value })}
            rows={3}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={handleSubmit}>Ajukan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
