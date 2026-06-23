import { useState, useEffect } from 'react';
import { useJadwal as useJadwalApi } from '../../hooks/useApi';
import { useToastStore } from '../../stores/toastStore';
import api from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { CalendarDays, Plus, Users, MapPin, Clock, Link as LinkIcon } from 'lucide-react';

const JENIS_SIDANG = [
  { value: 'SEMINAR_PROPOSAL', label: 'Seminar Proposal' },
  { value: 'SIDANG_KOMPREHENSIF', label: 'Sidang Komprehensif' },
  { value: 'SIDANG_SKRIPSI', label: 'Sidang Skripsi' },
];

export default function PenjadwalanSidangPage() {
  const { getAll, jadwalkanSidang, loading } = useJadwalApi();
  const addToast = useToastStore((s) => s.addToast);
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    jenisSidang: '',
    mahasiswaId: '',
    tanggal: '',
    waktuMulai: '',
    waktuSelesai: '',
    ruanganId: '',
    penguji1Id: '',
    penguji2Id: '',
    penguji3Id: '',
    linkMeeting: '',
  });

  useEffect(() => {
    loadJadwal();
  }, []);

  const loadJadwal = async () => {
    try {
      const data = await getAll();
      if (data) setJadwalList(data);
    } catch { /* handled */ }
  };

  const handleSubmit = async () => {
    if (!form.jenisSidang || !form.mahasiswaId || !form.tanggal || !form.waktuMulai || !form.waktuSelesai || !form.ruanganId) {
      addToast('Semua field wajib harus diisi', 'warning');
      return;
    }
    try {
      await jadwalkanSidang({
        ...form,
        tanggal: new Date(form.tanggal).toISOString(),
        waktuMulai: new Date(`${form.tanggal}T${form.waktuMulai}`).toISOString(),
        waktuSelesai: new Date(`${form.tanggal}T${form.waktuSelesai}`).toISOString(),
      });
      addToast('Jadwal sidang berhasil dibuat', 'success');
      setShowModal(false);
      setForm({ jenisSidang: '', mahasiswaId: '', tanggal: '', waktuMulai: '', waktuSelesai: '', ruanganId: '', penguji1Id: '', penguji2Id: '', penguji3Id: '', linkMeeting: '' });
      loadJadwal();
    } catch {
      addToast('Gagal membuat jadwal sidang', 'error');
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'DIJADWALKAN': return <Badge variant="info">Dijadwalkan</Badge>;
      case 'BERLANGSUNG': return <Badge variant="warning">Berlangsung</Badge>;
      case 'SELESAI': return <Badge variant="success">Selesai</Badge>;
      case 'DIBATALKAN': return <Badge variant="danger">Dibatalkan</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    {
      key: 'jenisSidang',
      header: 'Jenis Sidang',
      render: (item: any) => (
        <span className="font-medium">{JENIS_SIDANG.find(j => j.value === item.jenisSidang)?.label || item.jenisSidang}</span>
      ),
    },
    {
      key: 'mahasiswa',
      header: 'Mahasiswa',
      render: (item: any) => (
        <div>
          <p className="font-medium text-gray-900">{item.mahasiswa?.nama || '-'}</p>
          <p className="text-xs text-gray-500">{item.mahasiswa?.nim || ''}</p>
        </div>
      ),
    },
    {
      key: 'tanggal',
      header: 'Tanggal & Waktu',
      render: (item: any) => (
        <div>
          <p className="text-sm">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <p className="text-xs text-gray-500">{new Date(item.waktuMulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(item.waktuSelesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      ),
    },
    { key: 'ruangan', header: 'Ruangan', render: (item: any) => item.ruangan?.nama || '-' },
    { key: 'status', header: 'Status', render: (item: any) => statusBadge(item.status) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penjadwalan Sidang</h1>
          <p className="text-gray-500">Kelola jadwal sidang skripsi</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Buat Jadwal Baru
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Jadwal', value: jadwalList.length, color: 'text-gray-900' },
          { label: 'Dijadwalkan', value: jadwalList.filter(j => j.status === 'DIJADWALKAN').length, color: 'text-blue-600' },
          { label: 'Berlangsung', value: jadwalList.filter(j => j.status === 'BERLANGSUNG').length, color: 'text-yellow-600' },
          { label: 'Selesai', value: jadwalList.filter(j => j.status === 'SELESAI').length, color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable columns={columns} data={jadwalList} loading={loading} emptyText="Belum ada jadwal sidang" />

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Buat Jadwal Sidang Baru" size="lg">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Sidang *</label>
            <select
              value={form.jenisSidang}
              onChange={(e) => setForm({ ...form, jenisSidang: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Jenis --</option>
              {JENIS_SIDANG.map((j) => (
                <option key={j.value} value={j.value}>{j.label}</option>
              ))}
            </select>
          </div>
          <Input label="ID Mahasiswa *" value={form.mahasiswaId} onChange={(e: any) => setForm({ ...form, mahasiswaId: e.target.value })} placeholder="UUID Mahasiswa" />
          <Input label="Tanggal *" type="date" value={form.tanggal} onChange={(e: any) => setForm({ ...form, tanggal: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Waktu Mulai *" type="time" value={form.waktuMulai} onChange={(e: any) => setForm({ ...form, waktuMulai: e.target.value })} />
            <Input label="Waktu Selesai *" type="time" value={form.waktuSelesai} onChange={(e: any) => setForm({ ...form, waktuSelesai: e.target.value })} />
          </div>
          <Input label="ID Ruangan *" value={form.ruanganId} onChange={(e: any) => setForm({ ...form, ruanganId: e.target.value })} placeholder="UUID Ruangan" />
          <Input label="ID Penguji 1" value={form.penguji1Id} onChange={(e: any) => setForm({ ...form, penguji1Id: e.target.value })} placeholder="UUID Dosen Penguji 1" />
          <Input label="ID Penguji 2" value={form.penguji2Id} onChange={(e: any) => setForm({ ...form, penguji2Id: e.target.value })} placeholder="UUID Dosen Penguji 2" />
          <Input label="ID Penguji 3" value={form.penguji3Id} onChange={(e: any) => setForm({ ...form, penguji3Id: e.target.value })} placeholder="UUID Dosen Penguji 3 (opsional)" />
          <Input label="Link Meeting" value={form.linkMeeting} onChange={(e: any) => setForm({ ...form, linkMeeting: e.target.value })} placeholder="https://zoom.us/..." />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={handleSubmit}>Buat Jadwal</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
