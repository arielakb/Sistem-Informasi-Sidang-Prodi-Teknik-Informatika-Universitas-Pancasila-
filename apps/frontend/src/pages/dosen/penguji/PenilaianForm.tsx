import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJadwalMenguji, useSubmitPenilaian } from '../../../hooks/useDosen';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { useForm } from '../../../hooks/useForm';
import { validateRequired } from '../../../lib/validation';

interface PenilaianValues {
  nilaiPresentasi: string;
  nilaiMateri: string;
  nilaiTeknik: string;
  catatan: string;
}

const validatePenilaian = (values: PenilaianValues) => {
  const errors: Partial<Record<keyof PenilaianValues, string>> = {};
  
  const presentasiError = validateRequired(values.nilaiPresentasi, 'Nilai Presentasi');
  if (presentasiError) errors.nilaiPresentasi = presentasiError;
  
  const materiError = validateRequired(values.nilaiMateri, 'Nilai Materi');
  if (materiError) errors.nilaiMateri = materiError;
  
  const teknikError = validateRequired(values.nilaiTeknik, 'Nilai Teknik');
  if (teknikError) errors.nilaiTeknik = teknikError;

  return errors;
};

export default function PenilaianForm() {
  const { jadwalId } = useParams();
  const navigate = useNavigate();
  const { data: jadwalList } = useJadwalMenguji();
  const submitPenilaian = useSubmitPenilaian();
  const [success, setSuccess] = useState(false);

  const jadwal = jadwalList?.find((j: any) => j.id === jadwalId);

  const form = useForm<PenilaianValues>({
    nilaiPresentasi: '',
    nilaiMateri: '',
    nilaiTeknik: '',
    catatan: '',
  }, validatePenilaian);

  const handleSubmit = async (values: PenilaianValues) => {
    await submitPenilaian.mutateAsync({
      jadwalId: jadwalId!,
      nilaiPresentasi: parseInt(values.nilaiPresentasi),
      nilaiMateri: parseInt(values.nilaiMateri),
      nilaiTeknik: parseInt(values.nilaiTeknik),
      catatan: values.catatan,
    });
    setSuccess(true);
  };

  if (!jadwal) return <div>Loading...</div>;

  const totalNilai = (parseInt(form.values.nilaiPresentasi) || 0) + 
                     (parseInt(form.values.nilaiMateri) || 0) + 
                     (parseInt(form.values.nilaiTeknik) || 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Penilaian Sidang</h2>
          <p className="text-gray-500">{jadwal.jenisSidang}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p><span className="text-gray-500">Mahasiswa:</span> {jadwal.mahasiswa.nama}</p>
            <p><span className="text-gray-500">Judul:</span> {jadwal.mahasiswa.judulSkripsi || '-'}</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (form.isSubmitting) return;
            form.handleSubmit(handleSubmit);
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Nilai Presentasi"
              type="number"
              min="0"
              max="100"
              value={form.values.nilaiPresentasi}
              onChange={(e) => form.setValue('nilaiPresentasi', e.target.value)}
              error={form.touched.nilaiPresentasi ? form.errors.nilaiPresentasi : undefined}
              required
            />
            <Input
              label="Nilai Materi"
              type="number"
              min="0"
              max="100"
              value={form.values.nilaiMateri}
              onChange={(e) => form.setValue('nilaiMateri', e.target.value)}
              error={form.touched.nilaiMateri ? form.errors.nilaiMateri : undefined}
              required
            />
            <Input
              label="Nilai Teknik"
              type="number"
              min="0"
              max="100"
              value={form.values.nilaiTeknik}
              onChange={(e) => form.setValue('nilaiTeknik', e.target.value)}
              error={form.touched.nilaiTeknik ? form.errors.nilaiTeknik : undefined}
              required
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Total Nilai: <span className="text-lg font-bold text-pancasila-blue">{totalNilai}</span> / 300</p>
          </div>

          <Textarea
            label="Catatan Evaluasi"
            placeholder="Berikan catatan dan saran perbaikan..."
            value={form.values.catatan}
            onChange={(e) => form.setValue('catatan', e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/penguji/jadwal')}>
              Batal
            </Button>
            <Button type="submit">
              {form.isSubmitting ? 'Menyimpan...' : 'Submit Penilaian'}
            </Button>
          </div>
        </form>
      </div>

      <Modal isOpen={success} onClose={() => {}} title="Berhasil!" size="sm">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <p className="text-gray-700">Penilaian berhasil disimpan!</p>
          <Button className="mt-4" onClick={() => navigate('/penguji/jadwal')}>
            Kembali ke Jadwal
          </Button>
        </div>
      </Modal>
    </div>
  );
}