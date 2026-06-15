import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import { usePengajuanTopik } from '../../../hooks/useMahasiswa';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { validateRequired, validateMinLength, validateMaxLength } from '../../../lib/validation';

interface TopikFormValues {
  topik: string;
  judul: string;
  deskripsi: string;
}

const validateTopik = (values: TopikFormValues) => {
  const errors: Partial<Record<keyof TopikFormValues, string>> = {};
  
  const topikError = validateRequired(values.topik, 'Topik') || validateMinLength(values.topik, 10, 'Topik') || validateMaxLength(values.topik, 500, 'Topik');
  if (topikError) errors.topik = topikError;
  
  const judulError = validateRequired(values.judul, 'Judul') || validateMinLength(values.judul, 10, 'Judul') || validateMaxLength(values.judul, 200, 'Judul');
  if (judulError) errors.judul = judulError;
  
  const deskripsiError = validateMaxLength(values.deskripsi, 2000, 'Deskripsi');
  if (deskripsiError) errors.deskripsi = deskripsiError;
  
  return errors;
};

export default function PengajuanTopikForm() {
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const pengajuanTopik = usePengajuanTopik();
  
  const form = useForm<TopikFormValues>({
    topik: '',
    judul: '',
    deskripsi: '',
  }, validateTopik);

  const handleSubmit = async (values: TopikFormValues) => {
    await pengajuanTopik.mutateAsync(values);
    setSuccess(true);
    setTimeout(() => {
      navigate('/skripsi');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Pengajuan Topik Skripsi</h2>
        <p className="text-sm text-gray-500 mb-6">Isi form berikut untuk mengajukan topik skripsi Anda</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(handleSubmit);
          }}
          className="space-y-5"
        >
          <Input
            label="Topik"
            placeholder="Contoh: Sistem Informasi Manajemen Perpustakaan"
            value={form.values.topik}
            onChange={(e) => form.setValue('topik', e.target.value)}
            error={form.touched.topik ? form.errors.topik : undefined}
            required
          />

          <Input
            label="Judul Skripsi"
            placeholder="Contoh: Perancangan Sistem Informasi Manajemen Perpustakaan Berbasis Web"
            value={form.values.judul}
            onChange={(e) => form.setValue('judul', e.target.value)}
            error={form.touched.judul ? form.errors.judul : undefined}
            required
          />

          <Textarea
            label="Deskripsi Singkat"
            placeholder="Jelaskan secara singkat mengenai topik yang diajukan..."
            value={form.values.deskripsi}
            onChange={(e) => form.setValue('deskripsi', e.target.value)}
            error={form.touched.deskripsi ? form.errors.deskripsi : undefined}
          />
          <p className="text-sm text-gray-500">{`${form.values.deskripsi.length}/2000 karakter`}</p>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/skripsi')}
            >
              Batal
            </Button>
            <Button
              type="submit"
              {...({ disabled: form.isSubmitting } as any)}
            >
              {form.isSubmitting ? 'Memproses...' : 'Ajukan Topik →'}
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={success}
        onClose={() => {}}
        title="Berhasil!"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <p className="text-gray-700">Topik berhasil diajukan!</p>
          <p className="text-sm text-gray-500 mt-1">Mengalihkan ke halaman skripsi...</p>
        </div>
      </Modal>
    </div>
  );
}