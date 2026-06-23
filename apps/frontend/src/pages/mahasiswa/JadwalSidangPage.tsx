import { useState, useEffect } from 'react';
import { useMahasiswa } from '../../hooks/useApi';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import { CalendarDays, Clock, MapPin, Users, ExternalLink } from 'lucide-react';

interface JadwalItem {
  id: string;
  jenisSidang: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  ruangan: { nama: string };
  penguji1?: { nama: string };
  penguji2?: { nama: string };
  penguji3?: { nama: string };
  status: string;
  linkMeeting?: string;
}

export default function JadwalSidangPage() {
  const { getJadwal, loading } = useMahasiswa();
  const [jadwalList, setJadwalList] = useState<JadwalItem[]>([]);

  useEffect(() => {
    loadJadwal();
  }, []);

  const loadJadwal = async () => {
    try {
      const data = await getJadwal();
      if (data) setJadwalList(data);
    } catch {
      // handled by API interceptor
    }
  };

  const jenisSidangLabel = (jenis: string) => {
    switch (jenis) {
      case 'SEMINAR_PROPOSAL': return 'Seminar Proposal';
      case 'SIDANG_KOMPREHENSIF': return 'Sidang Komprehensif';
      case 'SIDANG_SKRIPSI': return 'Sidang Skripsi';
      default: return jenis;
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

  const upcoming = jadwalList.filter(j => j.status === 'DIJADWALKAN' || j.status === 'BERLANGSUNG');
  const past = jadwalList.filter(j => j.status === 'SELESAI' || j.status === 'DIBATALKAN');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Sidang</h1>
        <p className="text-gray-500">Lihat jadwal sidang skripsi Anda</p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 ? (
        <div className="space-y-4">
          {upcoming.map((jadwal) => (
            <div key={jadwal.id} className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 border-l-4 border-l-pancasila-blue">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">{jenisSidangLabel(jadwal.jenisSidang)}</span>
                    {statusBadge(jadwal.status)}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-gray-400" />
                      <span>{new Date(jadwal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>{new Date(jadwal.waktuMulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(jadwal.waktuSelesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{jadwal.ruangan?.nama || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span>
                        Penguji: {[jadwal.penguji1?.nama, jadwal.penguji2?.nama, jadwal.penguji3?.nama].filter(Boolean).join(', ') || 'Belum ditentukan'}
                      </span>
                    </div>
                  </div>
                </div>

                {jadwal.linkMeeting && (
                  <a
                    href={jadwal.linkMeeting}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 bg-pancasila-blue text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    <ExternalLink size={14} />
                    Join Meeting
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <CalendarDays size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Belum ada jadwal sidang</p>
          <p className="text-sm text-gray-400 mt-1">Jadwal sidang akan muncul setelah dijadwalkan oleh admin</p>
        </div>
      )}

      {/* Riwayat */}
      {past.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Sidang</h2>
          </div>
          <DataTable
            columns={[
              { key: 'jenisSidang', header: 'Jenis Sidang', render: (item: JadwalItem) => jenisSidangLabel(item.jenisSidang) },
              { key: 'tanggal', header: 'Tanggal', render: (item: JadwalItem) => new Date(item.tanggal).toLocaleDateString('id-ID') },
              { key: 'ruangan', header: 'Ruangan', render: (item: JadwalItem) => item.ruangan?.nama || '-' },
              { key: 'status', header: 'Status', render: (item: JadwalItem) => statusBadge(item.status) },
            ]}
            data={past}
          />
        </div>
      )}
    </div>
  );
}
