import { useState } from 'react';
import { useMahasiswa } from '../../hooks/useApi';
import { useToastStore } from '../../stores/toastStore';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import FileUpload from '../../components/ui/FileUpload';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function BerkasFinalPage() {
  const { uploadBerkasFinal, loading } = useMahasiswa();
  const addToast = useToastStore((s) => s.addToast);
  const [naskah, setNaskah] = useState<File | null>(null);
  const [pengesahan, setPengesahan] = useState<File | null>(null);
  const [berkasLain, setBerkasLain] = useState<File | null>(null);
  const [statusPembimbing] = useState('DIAJUKAN');
  const [statusKoordinator] = useState('DIAJUKAN');

  const statusBadge = (status: string) => {
    switch (status) {
      case 'DIAJUKAN': return <Badge variant="warning">Menunggu Review</Badge>;
      case 'DIVERIFIKASI': return <Badge variant="info">Diverifikasi</Badge>;
      case 'DISETUJUI': return <Badge variant="success">Disetujui</Badge>;
      case 'DITOLAK': return <Badge variant="danger">Ditolak</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleUpload = async () => {
    if (!naskah || !pengesahan) {
      addToast('File naskah dan pengesahan wajib diupload', 'warning');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('naskah', naskah);
      formData.append('pengesahan', pengesahan);
      if (berkasLain) formData.append('berkasLain', berkasLain);
      await uploadBerkasFinal(formData);
      addToast('Berkas final berhasil diupload', 'success');
      setNaskah(null);
      setPengesahan(null);
      setBerkasLain(null);
    } catch {
      addToast('Gagal mengupload berkas final', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Berkas Final</h1>
        <p className="text-gray-500">Upload naskah final skripsi dan lembar pengesahan</p>
      </div>

      {/* Status Approval */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status Pembimbing</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">Persetujuan Pembimbing</p>
            </div>
            {statusBadge(statusPembimbing)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status Koordinator</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">Persetujuan Koordinator</p>
            </div>
            {statusBadge(statusKoordinator)}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Upload size={20} className="text-pancasila-blue" />
          Upload Berkas Final
        </h2>

        <div className="space-y-6">
          {/* Naskah */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-pancasila-blue" />
              <span className="font-semibold text-gray-900">Naskah Skripsi Final *</span>
              <span className="text-xs text-red-500">Wajib</span>
            </div>
            <FileUpload
              label=""
              accept=".pdf"
              maxSize={50}
              onFileSelect={(file) => setNaskah(file)}
            />
            <p className="text-xs text-gray-500 mt-2">Format PDF, maksimal 50MB</p>
          </div>

          {/* Pengesahan */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={18} className="text-green-600" />
              <span className="font-semibold text-gray-900">Lembar Pengesahan *</span>
              <span className="text-xs text-red-500">Wajib</span>
            </div>
            <FileUpload
              label=""
              accept=".pdf"
              maxSize={10}
              onFileSelect={(file) => setPengesahan(file)}
            />
            <p className="text-xs text-gray-500 mt-2">Lembar pengesahan yang sudah ditandatangani (PDF, max 10MB)</p>
          </div>

          {/* Berkas Lain */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} className="text-gray-400" />
              <span className="font-semibold text-gray-900">Berkas Tambahan</span>
              <span className="text-xs text-gray-400">Opsional</span>
            </div>
            <FileUpload
              label=""
              accept=".pdf,.doc,.docx,.zip"
              maxSize={20}
              onFileSelect={(file) => setBerkasLain(file)}
            />
            <p className="text-xs text-gray-500 mt-2">Berkas pendukung lainnya (PDF/Word/ZIP, max 20MB)</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleUpload} className="flex items-center gap-2">
            <Upload size={16} />
            Submit Berkas Final
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-2">📌 Informasi Penting</h3>
        <ul className="space-y-1 text-sm text-blue-900">
          <li>• Naskah skripsi harus sudah dalam versi final yang disetujui pembimbing</li>
          <li>• Lembar pengesahan harus sudah ditandatangani oleh semua pihak</li>
          <li>• Berkas yang sudah diupload akan direview oleh pembimbing dan koordinator</li>
          <li>• Anda akan mendapat notifikasi jika ada revisi yang diperlukan</li>
        </ul>
      </div>
    </div>
  );
}
