import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import api from '../../../lib/api';
import { validateMinLength, validateRequired } from '../../../lib/validation';

interface LogbookFormValues {
  tanggal: string;
  topikBahasan: string;
  hasilBimbingan: string;
}

const validateLogbook = (values: LogbookFormValues) => {
  const errors: Partial<Record<keyof LogbookFormValues, string>> = {};
  
  const tanggalError = validateRequired(values.tanggal, 'Tanggal');
  if (tanggalError) errors.tanggal = tanggalError;
  
  const topikError = validateRequired(values.topikBahasan, 'Topik Bahasan') || validateMinLength(values.topikBahasan, 10, 'Topik Bahasan');
  if (topikError) errors.topikBahasan = topikError;
  
  return errors;
};

export default function LogbookForm() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<LogbookFormValues>({
    tanggal: new Date().toISOString().split('T')[0],
    topikBahasan: '',
    hasilBimbingan: '',
  }, validateLogbook);

  const handleSubmit = async (values: LogbookFormValues) => {
    await api.post('/mahasiswa/logbook', values);
    setSuccess(true);
    setTimeout(() => navigate('/logbook'), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Isi Logbook Bimbingan</h2>
        <p className="text-sm text-gray-500 mb-6">Catat setiap pertemuan bimbingan dengan dosen pembimbing</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(handleSubmit);
          }}
          className="space-y-5"
        >
          <Input
            label="Tanggal Bimbingan"
            type="date"
            value={form.values.tanggal}
            onChange={(e) => form.setValue('tanggal', e.target.value)}
            error={form.touched.tanggal ? form.errors.tanggal : undefined}
            required
          />

          <Input
            label="Topik Bahasan"
            placeholder="Contoh: Pembahasan BAB I - Pendahuluan"
            value={form.values.topikBahasan}
            onChange={(e) => form.setValue('topikBahasan', e.target.value)}
            error={form.touched.topikBahasan ? form.errors.topikBahasan : undefined}
            required
          />

          <Textarea
            label="Hasil Bimbingan"
            placeholder="Jelaskan hasil atau kesepakatan dari pertemuan ini..."
            value={form.values.hasilBimbingan}
            onChange={(e) => form.setValue('hasilBimbingan', e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Batal
            </Button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? 'Menyimpan...' : 'Simpan Logbook'}
            </button>
          </div>
        </form>
      </div>

      <Modal isOpen={success} onClose={() => {}} title="Berhasil!" size="sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <p className="text-gray-700">Logbook berhasil disimpan!</p>
        </div>
      </Modal>
    </div>
  );
}