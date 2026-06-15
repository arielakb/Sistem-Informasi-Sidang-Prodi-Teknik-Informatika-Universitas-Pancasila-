import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMahasiswaProfile } from '../../hooks/useMahasiswa';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function SkripsiPage() {
  const navigate = useNavigate();
  const { data: mahasiswa, isLoading } = useMahasiswaProfile();
  const [activeTab, setActiveTab] = useState('topik');

  const statusSteps = [
    { key: 'PENGAJUAN_TOPIK', label: 'Pengajuan Topik', done: true },
    { key: 'BIMBINGAN', label: 'Bimbingan', done: mahasiswa?.statusSkripsi !== 'PENGAJUAN_TOPIK' },
    { key: 'SEMINAR_PROPOSAL', label: 'Seminar Proposal', done: false },
    { key: 'SIDANG_KOMPREHENSIF', label: 'Sidang Komprehensif', done: false },
    { key: 'SIDANG_SKRIPSI', label: 'Sidang Skripsi', done: false },
    { key: 'LULUS', label: 'Lulus', done: false },
  ];

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skripsi</h1>
          <p className="text-gray-500">Kelola progres skripsi Anda</p>
        </div>
        {!mahasiswa?.judulSkripsi && (
          <Button onClick={() => navigate('/skripsi/topik')}>
            + Ajukan Topik
          </Button>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Progres Skripsi</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {statusSteps.map((step, idx) => (
            <div key={step.key} className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step.done 
                  ? 'bg-pancasila-blue text-white' 
                  : idx === statusSteps.findIndex(s => !s.done)
                    ? 'bg-white border-2 border-pancasila-blue text-pancasila-blue'
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {step.done ? '✓' : idx + 1}
              </div>
              <span className={`text-xs font-medium ${
                step.done ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
              {idx < statusSteps.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  step.done ? 'bg-pancasila-blue' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex border-b border-gray-200">
          {['topik', 'logbook', 'berkas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-pancasila-blue text-pancasila-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'topik' ? 'Topik' : tab === 'logbook' ? 'Logbook' : 'Berkas'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'topik' && (
            <div>
              {mahasiswa?.judulSkripsi ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Topik</label>
                    <p className="font-medium text-gray-900">{mahasiswa.topikDiajukan || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Judul Skripsi</label>
                    <p className="font-medium text-gray-900">{mahasiswa.judulSkripsi}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge variant="warning">{mahasiswa.statusSkripsi}</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Anda belum mengajukan topik</p>
                  <Button onClick={() => navigate('/skripsi/topik')}>
                    Ajukan Topik Sekarang
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logbook' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Riwayat Bimbingan</h3>
                <Button size="sm" onClick={() => navigate('/skripsi/logbook')}>
                  + Tambah
                </Button>
              </div>
              <p className="text-gray-500 text-sm">Belum ada catatan bimbingan</p>
            </div>
          )}

          {activeTab === 'berkas' && (
            <div>
              <h3 className="font-medium mb-4">Berkas Skripsi</h3>
              <p className="text-gray-500 text-sm">Belum ada berkas yang diupload</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}