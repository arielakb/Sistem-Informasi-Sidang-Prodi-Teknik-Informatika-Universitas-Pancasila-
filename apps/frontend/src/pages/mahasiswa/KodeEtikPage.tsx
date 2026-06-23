import { useState } from 'react';
import { useToastStore } from '../../stores/toastStore';
import api from '../../lib/api';
import Button from '../../components/ui/Button';
import { ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';

const KODE_ETIK_ITEMS = [
  'Saya menyatakan bahwa skripsi ini adalah hasil karya sendiri dan bukan plagiat.',
  'Saya tidak akan melakukan kecurangan akademik dalam bentuk apapun.',
  'Saya bersedia menerima sanksi jika terbukti melanggar kode etik akademik.',
  'Saya akan mengikuti prosedur dan aturan yang berlaku di program studi.',
  'Saya akan menjaga kerahasiaan data penelitian yang bersifat sensitif.',
  'Saya akan mencantumkan semua referensi dan sumber yang digunakan dalam skripsi.',
  'Saya akan menghormati hak kekayaan intelektual pihak lain.',
];

export default function KodeEtikPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(KODE_ETIK_ITEMS.length).fill(false));
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const allChecked = checkedItems.every(Boolean);

  const toggleItem = (index: number) => {
    const newItems = [...checkedItems];
    newItems[index] = !newItems[index];
    setCheckedItems(newItems);
  };

  const handleSign = async () => {
    if (!allChecked) {
      addToast('Harap centang semua pernyataan', 'warning');
      return;
    }
    setLoading(true);
    try {
      await api.post('/mahasiswa/kode-etik', { signed: true });
      setSigned(true);
      addToast('Kode etik berhasil ditandatangani', 'success');
    } catch {
      addToast('Gagal menandatangani kode etik', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (signed) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kode Etik</h1>
          <p className="text-gray-500">Pernyataan kode etik penulisan skripsi</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-green-800">Kode Etik Telah Ditandatangani</h2>
          <p className="text-green-600 mt-2">Anda telah menyetujui pernyataan kode etik penulisan skripsi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kode Etik</h1>
        <p className="text-gray-500">Pernyataan kode etik penulisan skripsi</p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-yellow-800">Perhatian</p>
          <p className="text-sm text-yellow-700">Anda wajib membaca dan menyetujui seluruh pernyataan kode etik sebelum melanjutkan proses skripsi.</p>
        </div>
      </div>

      {/* Kode Etik */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck size={24} className="text-pancasila-blue" />
          <h2 className="text-lg font-semibold text-gray-900">Pernyataan Kode Etik</h2>
        </div>

        <div className="space-y-4">
          {KODE_ETIK_ITEMS.map((item, index) => (
            <label
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                checkedItems[index] ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checkedItems[index]}
                onChange={() => toggleItem(index)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-pancasila-blue focus:ring-pancasila-blue"
              />
              <span className={`text-sm ${checkedItems[index] ? 'text-green-800' : 'text-gray-700'}`}>
                {index + 1}. {item}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {checkedItems.filter(Boolean).length} dari {KODE_ETIK_ITEMS.length} pernyataan dicentang
            </p>
            <Button onClick={handleSign} className="flex items-center gap-2">
              <ShieldCheck size={16} />
              Tandatangani Kode Etik
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
