import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useApi';
import { useToastStore } from '../../stores/toastStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { CalendarDays, Plus, Trash2, Clock, AlertTriangle } from 'lucide-react';

interface Deadline {
  id: string;
  jenisDeadline: string;
  tanggalDeadline: string;
  keterangan?: string;
  isActive: boolean;
  createdAt: string;
}

const JENIS_DEADLINE = [
  'Pengajuan Topik',
  'Upload Berkas Sidang',
  'Pendaftaran Seminar Proposal',
  'Pendaftaran Sidang Komprehensif',
  'Pendaftaran Sidang Skripsi',
  'Upload Berkas Final',
  'Pendaftaran MK Spesial',
];

export default function DeadlinePage() {
  const { getAllDeadline, setDeadline, loading } = useAdmin();
  const addToast = useToastStore((s) => s.addToast);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ jenisDeadline: '', tanggalDeadline: '', keterangan: '' });

  useEffect(() => {
    loadDeadlines();
  }, []);

  const loadDeadlines = async () => {
    try {
      const data = await getAllDeadline();
      if (data) setDeadlines(data);
    } catch { /* handled */ }
  };

  const handleSubmit = async () => {
    if (!form.jenisDeadline || !form.tanggalDeadline) {
      addToast('Jenis dan tanggal deadline wajib diisi', 'warning');
      return;
    }
    try {
      await setDeadline({
        jenisDeadline: form.jenisDeadline,
        tanggalDeadline: new Date(form.tanggalDeadline).toISOString(),
        keterangan: form.keterangan || undefined,
      });
      addToast('Deadline berhasil ditambahkan', 'success');
      setShowModal(false);
      setForm({ jenisDeadline: '', tanggalDeadline: '', keterangan: '' });
      loadDeadlines();
    } catch {
      addToast('Gagal menambahkan deadline', 'error');
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();
  const isNearDeadline = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // 7 days
  };

  const columns = [
    {
      key: 'jenisDeadline',
      header: 'Jenis Deadline',
      render: (item: Deadline) => (
        <span className="font-medium text-gray-900">{item.jenisDeadline}</span>
      ),
    },
    {
      key: 'tanggalDeadline',
      header: 'Tanggal',
      render: (item: Deadline) => (
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-gray-400" />
          <span>{new Date(item.tanggalDeadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Deadline) => {
        if (isExpired(item.tanggalDeadline)) return <Badge variant="danger">Berakhir</Badge>;
        if (isNearDeadline(item.tanggalDeadline)) return <Badge variant="warning">Segera</Badge>;
        return <Badge variant="success">Aktif</Badge>;
      },
    },
    {
      key: 'keterangan',
      header: 'Keterangan',
      render: (item: Deadline) => <span className="text-sm text-gray-500">{item.keterangan || '-'}</span>,
    },
    {
      key: 'sisa',
      header: 'Sisa Waktu',
      render: (item: Deadline) => {
        const diff = new Date(item.tanggalDeadline).getTime() - Date.now();
        if (diff <= 0) return <span className="text-sm text-red-500">Sudah lewat</span>;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return <span className={`text-sm font-medium ${days <= 7 ? 'text-orange-600' : 'text-green-600'}`}>{days} hari lagi</span>;
      },
    },
  ];

  const activeDeadlines = deadlines.filter(d => !isExpired(d.tanggalDeadline));
  const nearDeadlines = deadlines.filter(d => isNearDeadline(d.tanggalDeadline));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Deadline</h1>
          <p className="text-gray-500">Atur deadline untuk kegiatan akademik</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Tambah Deadline
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><CalendarDays size={20} className="text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Deadline</p>
              <p className="text-2xl font-bold text-gray-900">{deadlines.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><Clock size={20} className="text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Aktif</p>
              <p className="text-2xl font-bold text-green-600">{activeDeadlines.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><AlertTriangle size={20} className="text-orange-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Segera ({"<"} 7 hari)</p>
              <p className="text-2xl font-bold text-orange-600">{nearDeadlines.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={deadlines} loading={loading} emptyText="Belum ada deadline yang ditentukan" />

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Deadline Baru" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Deadline *</label>
            <select
              value={form.jenisDeadline}
              onChange={(e) => setForm({ ...form, jenisDeadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Jenis --</option>
              {JENIS_DEADLINE.map((jenis) => (
                <option key={jenis} value={jenis}>{jenis}</option>
              ))}
            </select>
          </div>
          <Input
            label="Tanggal Deadline *"
            type="date"
            value={form.tanggalDeadline}
            onChange={(e: any) => setForm({ ...form, tanggalDeadline: e.target.value })}
          />
          <Input
            label="Keterangan"
            value={form.keterangan}
            onChange={(e: any) => setForm({ ...form, keterangan: e.target.value })}
            placeholder="Tambahkan keterangan (opsional)"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={handleSubmit}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
