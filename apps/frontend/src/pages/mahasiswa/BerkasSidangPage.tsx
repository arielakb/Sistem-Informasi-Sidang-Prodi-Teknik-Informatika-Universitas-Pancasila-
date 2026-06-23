import { useState, useEffect } from 'react';
import { useMahasiswa } from '../../hooks/useApi';
import { useToastStore } from '../../stores/toastStore';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import FileUpload from '../../components/ui/FileUpload';
import DataTable from '../../components/ui/DataTable';
import { FileText, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';

const JENIS_BERKAS = [
  { value: 'DRAFT_SKRIPSI', label: 'Draft Skripsi' },
  { value: 'KARTU_BIMBINGAN', label: 'Kartu Bimbingan' },
  { value: 'TRANSKRIP_NILAI', label: 'Transkrip Nilai' },
  { value: 'KRS', label: 'KRS Aktif' },
  { value: 'SLIP_PEMBAYARAN', label: 'Slip Pembayaran' },
  { value: 'SURAT_PERNYATAAN', label: 'Surat Pernyataan' },
];

interface BerkasItem {
  id: string;
  jenisBerkas: string;
  filePath: string;
  status: string;
  catatanVerifikasi?: string;
  uploadedAt: string;
}

export default function BerkasSidangPage() {
  const { uploadBerkasSidang, loading } = useMahasiswa();
  const addToast = useToastStore((s) => s.addToast);
  const [jenisBerkas, setJenisBerkas] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [berkasList, setBerkasList] = useState<BerkasItem[]>([]);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'DIAJUKAN': return <Badge variant="warning">Diajukan</Badge>;
      case 'DIVERIFIKASI': return <Badge variant="info">Diverifikasi</Badge>;
      case 'DISETUJUI': return <Badge variant="success">Disetujui</Badge>;
      case 'DITOLAK': return <Badge variant="danger">Ditolak</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleUpload = async () => {
    if (!jenisBerkas || !selectedFile) {
      addToast('Pilih jenis berkas dan file terlebih dahulu', 'warning');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('jenisBerkas', jenisBerkas);
      await uploadBerkasSidang(formData);
      addToast('Berkas berhasil diupload', 'success');
      setJenisBerkas('');
      setSelectedFile(null);
    } catch {
      addToast('Gagal mengupload berkas', 'error');
    }
  };

  const columns = [
    {
      key: 'jenisBerkas',
      header: 'Jenis Berkas',
      render: (item: BerkasItem) => (
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-pancasila-blue" />
          <span className="font-medium">{JENIS_BERKAS.find(j => j.value === item.jenisBerkas)?.label || item.jenisBerkas}</span>
        </div>
      ),
    },
    {
      key: 'uploadedAt',
      header: 'Tanggal Upload',
      render: (item: BerkasItem) => new Date(item.uploadedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: BerkasItem) => statusBadge(item.status),
    },
    {
      key: 'catatan',
      header: 'Catatan Verifikasi',
      render: (item: BerkasItem) => (
        <span className="text-sm text-gray-500">{item.catatanVerifikasi || '-'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Berkas Sidang</h1>
        <p className="text-gray-500">Upload dan kelola berkas persyaratan sidang</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload size={20} className="text-pancasila-blue" />
          Upload Berkas Baru
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Berkas *</label>
            <select
              value={jenisBerkas}
              onChange={(e) => setJenisBerkas(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Jenis Berkas --</option>
              {JENIS_BERKAS.map((jenis) => (
                <option key={jenis.value} value={jenis.value}>{jenis.label}</option>
              ))}
            </select>
          </div>
          <div>
            <FileUpload
              label="File Berkas *"
              accept=".pdf,.doc,.docx"
              maxSize={10}
              onFileSelect={(file) => setSelectedFile(file)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleUpload} className="flex items-center gap-2">
            <Upload size={16} />
            Upload Berkas
          </Button>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Checklist Kelengkapan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {JENIS_BERKAS.map((jenis) => {
            const uploaded = berkasList.find(b => b.jenisBerkas === jenis.value);
            const approved = uploaded?.status === 'DISETUJUI';
            return (
              <div
                key={jenis.value}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  approved ? 'border-green-200 bg-green-50' : uploaded ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                {approved ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : uploaded ? (
                  <Clock size={18} className="text-yellow-600" />
                ) : (
                  <XCircle size={18} className="text-gray-400" />
                )}
                <span className={`text-sm font-medium ${approved ? 'text-green-800' : uploaded ? 'text-yellow-800' : 'text-gray-600'}`}>
                  {jenis.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Riwayat */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Riwayat Upload</h2>
        </div>
        <DataTable columns={columns} data={berkasList} emptyText="Belum ada berkas yang diupload" />
      </div>
    </div>
  );
}
