import { useMahasiswaBimbingan, useValidasiLogbook } from '../../../hooks/useDosen';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { Check, X, Eye } from 'lucide-react';

export default function BimbinganPage() {
  const { data: mahasiswaList, isLoading } = useMahasiswaBimbingan();
  const validasiLogbook = useValidasiLogbook();
  const [selectedLogbook, setSelectedLogbook] = useState<any>(null);
  const [catatan, setCatatan] = useState('');

  const handleValidasi = async (status: 'DIVALIDASI' | 'DITOLAK') => {
    if (!selectedLogbook) return;
    await validasiLogbook.mutateAsync({
      id: selectedLogbook.id,
      status,
      catatan: status === 'DITOLAK' ? catatan : undefined,
    });
    setSelectedLogbook(null);
    setCatatan('');
  };

  const columns = [
    { key: 'nama', header: 'Mahasiswa', render: (item: any) => (
      <div>
        <p className="font-medium">{item.nama}</p>
        <p className="text-xs text-gray-500">{item.nim}</p>
      </div>
    )},
    { key: 'judulSkripsi', header: 'Judul', render: (item: any) => (
      <p className="text-sm truncate max-w-xs">{item.judulSkripsi || 'Belum ada judul'}</p>
    )},
    { key: 'statusSkripsi', header: 'Status', render: (item: any) => (
      <Badge variant="warning">{item.statusSkripsi}</Badge>
    )},
    { key: 'logbook', header: 'Logbook Terakhir', render: (item: any) => (
      <div>
        {item.logbooks?.[0] ? (
          <div className="space-y-1">
            <p className="text-sm">{item.logbooks[0].topikBahasan}</p>
            <Badge variant={item.logbooks[0].status === 'DIVALIDASI' ? 'success' : 'warning'}>
              {item.logbooks[0].status}
            </Badge>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Belum ada</span>
        )}
      </div>
    )},
    { key: 'aksi', header: 'Aksi', render: (item: any) => (
      <div className="flex gap-2">
        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Lihat detail">
          <Eye size={16} />
        </button>
        {item.logbooks?.[0]?.status === 'MENUNGGU' && (
          <>
            <button 
              onClick={() => setSelectedLogbook(item.logbooks[0])}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded" 
              title="Validasi"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={() => setSelectedLogbook(item.logbooks[0])}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
              title="Tolak"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mahasiswa Bimbingan</h1>
        <p className="text-gray-500">Kelola dan validasi bimbingan mahasiswa</p>
      </div>

      <DataTable
        columns={columns}
        data={mahasiswaList || []}
        loading={isLoading}
        emptyText="Belum ada mahasiswa bimbingan"
      />

      {/* Validasi Modal */}
      <Modal
        isOpen={!!selectedLogbook}
        onClose={() => { setSelectedLogbook(null); setCatatan(''); }}
        title="Validasi Logbook"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Topik Bahasan</label>
            <p className="text-gray-900">{selectedLogbook?.topikBahasan}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tanggal</label>
            <p className="text-gray-900">{new Date(selectedLogbook?.tanggal).toLocaleDateString('id-ID')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Catatan (opsional untuk penolakan)</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
              rows={3}
              placeholder="Masukkan catatan jika menolak..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => { setSelectedLogbook(null); setCatatan(''); }}>
              Batal
            </Button>
            <Button variant="danger" onClick={() => handleValidasi('DITOLAK')}>
              Tolak
            </Button>
            <Button onClick={() => handleValidasi('DIVALIDASI')}>
              Validasi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}