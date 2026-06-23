import { useState, useEffect } from 'react';
import { usePenilaian } from '../../../hooks/useApi';
import Badge from '../../../components/ui/Badge';
import DataTable from '../../../components/ui/DataTable';
import { ClipboardCheck, Star, Calendar } from 'lucide-react';

export default function HistoriPenilaianPage() {
  const { getHistori, loading } = usePenilaian();
  const [historiList, setHistoriList] = useState<any[]>([]);

  useEffect(() => {
    loadHistori();
  }, []);

  const loadHistori = async () => {
    try {
      const data = await getHistori();
      if (data) setHistoriList(data);
    } catch { /* handled */ }
  };

  const columns = [
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
      key: 'jenisSidang',
      header: 'Jenis Sidang',
      render: (item: any) => {
        const jenis = item.jadwalSidang?.jenisSidang || '-';
        return <Badge variant="info">{jenis.replace(/_/g, ' ')}</Badge>;
      },
    },
    {
      key: 'tanggal',
      header: 'Tanggal',
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <Calendar size={14} className="text-gray-400" />
          <span>{item.jadwalSidang?.tanggal ? new Date(item.jadwalSidang.tanggal).toLocaleDateString('id-ID') : '-'}</span>
        </div>
      ),
    },
    {
      key: 'nilaiPresentasi',
      header: 'Presentasi',
      render: (item: any) => <span className="font-medium">{item.nilaiPresentasi ?? '-'}</span>,
    },
    {
      key: 'nilaiMateri',
      header: 'Materi',
      render: (item: any) => <span className="font-medium">{item.nilaiMateri ?? '-'}</span>,
    },
    {
      key: 'nilaiTeknik',
      header: 'Teknik',
      render: (item: any) => <span className="font-medium">{item.nilaiTeknik ?? '-'}</span>,
    },
    {
      key: 'totalNilai',
      header: 'Total',
      render: (item: any) => (
        <span className="font-bold text-pancasila-blue">{item.totalNilai ?? '-'}</span>
      ),
    },
    {
      key: 'isSubmitted',
      header: 'Status',
      render: (item: any) => item.isSubmitted ? (
        <Badge variant="success">Submitted</Badge>
      ) : (
        <Badge variant="warning">Draft</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Histori Penilaian</h1>
        <p className="text-gray-500">Riwayat penilaian sidang yang sudah Anda berikan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><ClipboardCheck size={20} className="text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Penilaian</p>
              <p className="text-2xl font-bold text-gray-900">{historiList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><Star size={20} className="text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Submitted</p>
              <p className="text-2xl font-bold text-green-600">{historiList.filter(h => h.isSubmitted).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><ClipboardCheck size={20} className="text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Rata-rata Nilai</p>
              <p className="text-2xl font-bold text-yellow-600">
                {historiList.length > 0
                  ? (historiList.reduce((a, h) => a + (Number(h.totalNilai) || 0), 0) / historiList.filter(h => h.totalNilai).length).toFixed(1)
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={historiList} loading={loading} emptyText="Belum ada riwayat penilaian" />
    </div>
  );
}
