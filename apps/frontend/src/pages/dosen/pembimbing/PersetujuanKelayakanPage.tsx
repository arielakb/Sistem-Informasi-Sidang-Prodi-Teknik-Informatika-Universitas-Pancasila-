import { useState } from 'react';

import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Textarea from '../../../components/ui/Textarea';
import Badge from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface PersetujuanRequest {
  id: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  nim: string;
  judul: string;
  tahap: 'Seminar Proposal' | 'Sidang Komprehensif' | 'Sidang Skripsi';
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
}

export default function PersetujuanKelayakanPage() {
  const [requests, setRequests] = useState<PersetujuanRequest[]>([
    {
      id: '1',
      mahasiswaId: '1',
      mahasiswaNama: 'Ahmad Rizki',
      nim: '2021101001',
      judul: 'Sistem Rekomendasi Film Berbasis Kolaboratif',
      tahap: 'Seminar Proposal',
      status: 'Pending',
      requestedAt: '2 hari lalu',
    },
    {
      id: '2',
      mahasiswaId: '3',
      mahasiswaNama: 'Budi Santoso',
      nim: '2021101003',
      judul: 'Prediksi Harga Saham dengan LSTM',
      tahap: 'Sidang Komprehensif',
      status: 'Pending',
      requestedAt: '1 hari lalu',
    },
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PersetujuanRequest | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleViewDetail = (request: PersetujuanRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
    setFeedback('');
  };

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: 'Approved' as const } : req
      )
    );
    setShowDetailModal(false);
    alert('Persetujuan diberikan!');
  };

  const handleReject = (id: string) => {
    if (!feedback.trim()) {
      alert('Silakan berikan alasan penolakan');
      return;
    }
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: 'Rejected' as const } : req
      )
    );
    setShowDetailModal(false);
    alert('Permintaan ditolak dengan alasan');
  };

  const pendingRequests = requests.filter((req) => req.status === 'Pending');
  const approvedRequests = requests.filter((req) => req.status === 'Approved');
  const rejectedRequests = requests.filter((req) => req.status === 'Rejected');

  const getTahapColor = (tahap: string) => {
    switch (tahap) {
      case 'Seminar Proposal':
        return 'info';
      case 'Sidang Komprehensif':
        return 'warning';
      case 'Sidang Skripsi':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Persetujuan Kelayakan</h1>
          <p className="text-gray-600 mt-1">Berikan persetujuan untuk tahap bimbingan mahasiswa</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu Persetujuan</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingRequests.length}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sudah Disetujui</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{rejectedRequests.length}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Pending Requests */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">Permintaan Menunggu</h2>
          {pendingRequests.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900">Semua Permintaan Selesai!</h3>
              <p className="text-green-700 mt-1">Tidak ada permintaan persetujuan yang tertunda.</p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <Card key={req.id} className="border-l-4 border-l-yellow-400">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{req.mahasiswaNama}</h3>
                      <span className="text-sm text-gray-500">({req.nim})</span>
                      <Badge variant={getTahapColor(req.tahap) as any}>{req.tahap}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Judul:</strong> {req.judul}
                    </p>
                    <p className="text-xs text-gray-500">Requested {req.requestedAt}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewDetail(req)}
                  >
                    Proses
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Approved Requests */}
        {approvedRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Sudah Disetujui</h2>
            <div className="space-y-2">
              {approvedRequests.map((req) => (
                <Card key={req.id} className="border-l-4 border-l-green-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{req.mahasiswaNama}</h4>
                        <Badge variant="success">{req.tahap}</Badge>
                        <Badge variant="success">Disetujui</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{req.judul}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Requests */}
        {rejectedRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Ditolak</h2>
            <div className="space-y-2">
              {rejectedRequests.map((req) => (
                <Card key={req.id} className="border-l-4 border-l-red-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{req.mahasiswaNama}</h4>
                        <Badge variant={getTahapColor(req.tahap) as any}>{req.tahap}</Badge>
                        <Badge variant="danger">Ditolak</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{req.judul}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Persetujuan Kelayakan - ${selectedRequest?.mahasiswaNama}`}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Mahasiswa</label>
            <p className="mt-1 text-gray-900">{selectedRequest?.mahasiswaNama}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">NIM</label>
              <p className="mt-1 text-gray-900">{selectedRequest?.nim}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tahap</label>
              <p className="mt-1 font-semibold text-gray-900">{selectedRequest?.tahap}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul Skripsi</label>
            <p className="mt-1 text-gray-900 text-sm">{selectedRequest?.judul}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Pastikan mahasiswa sudah memenuhi semua syarat untuk tahap <strong>{selectedRequest?.tahap}</strong> sebelum memberikan persetujuan.
            </p>
          </div>
          <Textarea
            placeholder="Catatan atau alasan (jika ditolak)..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              onClick={() => handleApprove(selectedRequest?.id || '')}
              className="flex-1"
            >
              ✓ Setujui
            </Button>
            <Button
              variant="danger"
              onClick={() => handleReject(selectedRequest?.id || '')}
              className="flex-1"
            >
              ✗ Tolak
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
