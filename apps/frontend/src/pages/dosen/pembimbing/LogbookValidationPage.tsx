import { useState } from 'react';

import { Card } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface LogbookEntry {
  id: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  nim: string;
  tanggal: string;
  aktivitas: string;
  hambatan: string;
  status: 'Waiting' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export default function LogbookValidationPage() {
  const [logbooks, setLogbooks] = useState<LogbookEntry[]>([
    {
      id: '1',
      mahasiswaId: '1',
      mahasiswaNama: 'Ahmad Rizki',
      nim: '2021101001',
      tanggal: '2026-06-14',
      aktivitas: 'Mempelajari dataset dan membersihkan data. Melakukan exploratory data analysis.',
      hambatan: 'Dataset terlalu besar, perlu optimasi memory',
      status: 'Waiting',
      submittedAt: '2 jam lalu',
    },
    {
      id: '2',
      mahasiswaId: '1',
      mahasiswaNama: 'Ahmad Rizki',
      nim: '2021101001',
      tanggal: '2026-06-13',
      aktivitas: 'Implementasi algoritma collaborative filtering. Testing dengan data sample.',
      hambatan: 'Akurasi masih rendah (45%)',
      status: 'Waiting',
      submittedAt: '1 hari lalu',
    },
    {
      id: '3',
      mahasiswaId: '3',
      mahasiswaNama: 'Budi Santoso',
      nim: '2021101003',
      tanggal: '2026-06-12',
      aktivitas: 'Training model LSTM dengan epoch 100. Evaluasi pada test set.',
      hambatan: 'Overfitting pada data latih',
      status: 'Waiting',
      submittedAt: '2 hari lalu',
    },
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLogbook, setSelectedLogbook] = useState<LogbookEntry | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleViewDetail = (entry: LogbookEntry) => {
    setSelectedLogbook(entry);
    setShowDetailModal(true);
    setFeedback('');
  };

  const handleApprove = (id: string) => {
    setLogbooks(
      logbooks.map((log) =>
        log.id === id ? { ...log, status: 'Approved' as const } : log
      )
    );
    setShowDetailModal(false);
    alert('Logbook approved!');
  };

  const handleReject = (id: string) => {
    if (!feedback.trim()) {
      alert('Silakan berikan feedback sebelum menolak');
      return;
    }
    setLogbooks(
      logbooks.map((log) =>
        log.id === id ? { ...log, status: 'Rejected' as const } : log
      )
    );
    setShowDetailModal(false);
    alert('Logbook rejected with feedback');
  };

  const waitingLogbooks = logbooks.filter((log) => log.status === 'Waiting');

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Validasi Logbook Bimbingan</h1>
          <p className="text-gray-600 mt-1">Review logbook dari mahasiswa bimbingan Anda</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logbook Menunggu</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{waitingLogbooks.length}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sudah Disetujui</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {logbooks.filter((log) => log.status === 'Approved').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {logbooks.filter((log) => log.status === 'Rejected').length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Queue */}
        <div className="space-y-4">
          {waitingLogbooks.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900">Semua Logbook Telah Divalidasi!</h3>
              <p className="text-green-700 mt-1">Tidak ada logbook yang menunggu validasi saat ini.</p>
            </div>
          ) : (
            waitingLogbooks.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-yellow-400">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{entry.mahasiswaNama}</h3>
                      <span className="text-sm text-gray-500">({entry.nim})</span>
                      <Badge variant="warning">Menunggu</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Tanggal:</strong> {new Date(entry.tanggal).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Aktivitas:</strong> {entry.aktivitas}
                    </p>
                    {entry.hambatan && (
                      <p className="text-sm text-red-600 mt-2">
                        <strong>Hambatan:</strong> {entry.hambatan}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-3">Submitted {entry.submittedAt}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewDetail(entry)}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <FileText className="w-4 h-4" />
                    Review
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Review Logbook - ${selectedLogbook?.mahasiswaNama}`}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Mahasiswa</label>
              <p className="mt-1 text-gray-900">{selectedLogbook?.mahasiswaNama}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">NIM</label>
              <p className="mt-1 text-gray-900">{selectedLogbook?.nim}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
            <p className="mt-1 text-gray-900">
              {selectedLogbook?.tanggal && new Date(selectedLogbook.tanggal).toLocaleDateString('id-ID')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Aktivitas</label>
            <div className="mt-1 p-3 bg-gray-50 rounded text-gray-900 text-sm">
              {selectedLogbook?.aktivitas}
            </div>
          </div>
          {selectedLogbook?.hambatan && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Hambatan</label>
              <div className="mt-1 p-3 bg-red-50 rounded text-red-900 text-sm">
                {selectedLogbook.hambatan}
              </div>
            </div>
          )}
          <Textarea
            placeholder="Feedback atau catatan untuk mahasiswa..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              onClick={() => handleApprove(selectedLogbook?.id || '')}
              className="flex items-center gap-2 flex-1"
            >
              <CheckCircle className="w-4 h-4" />
              Setujui
            </Button>
            <Button
              variant="danger"
              onClick={() => handleReject(selectedLogbook?.id || '')}
              className="flex items-center gap-2 flex-1"
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
