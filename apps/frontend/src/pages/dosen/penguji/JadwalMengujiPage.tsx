import { useJadwalMenguji } from '../../../hooks/useDosen';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

export default function JadwalMengujiPage() {
  const { data: jadwalList, isLoading } = useJadwalMenguji();
  const navigate = useNavigate();

  const columns = [
    { key: 'mahasiswa', header: 'Mahasiswa', render: (item: any) => (
      <div>
        <p className="font-medium">{item.mahasiswa.nama}</p>
        <p className="text-xs text-gray-500">{item.mahasiswa.nim}</p>
      </div>
    )},
    { key: 'jenisSidang', header: 'Jenis Sidang', render: (item: any) => (
      <Badge variant="info">{item.jenisSidang}</Badge>
    )},
    { key: 'tanggal', header: 'Waktu & Tempat', render: (item: any) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-sm">
          <CalendarDays size={14} className="text-gray-400" />
          {new Date(item.tanggal).toLocaleDateString('id-ID')}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock size={14} />
          {item.waktuMulai} - {item.waktuSelesai}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
          {item.ruangan.nama}
        </div>
      </div>
    )},
    { key: 'status', header: 'Status', render: (item: any) => (
      <Badge variant={item.status === 'BERLANGSUNG' ? 'warning' : item.status === 'SELESAI' ? 'success' : 'default'}>
        {item.status}
      </Badge>
    )},
    { key: 'aksi', header: 'Aksi', render: (item: any) => (
      item.status === 'SELESAI' ? (
        <Button size="sm">
          Sudah Dinilai
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={() => navigate(`/penguji/penilaian/${item.id}`)}
        >
          Nilai
        </Button>
      )
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Menguji</h1>
        <p className="text-gray-500">Daftar sidang yang menjadi penguji</p>
      </div>

      <DataTable
        columns={columns}
        data={jadwalList || []}
        loading={isLoading}
        emptyText="Belum ada jadwal menguji"
      />
    </div>
  );
}