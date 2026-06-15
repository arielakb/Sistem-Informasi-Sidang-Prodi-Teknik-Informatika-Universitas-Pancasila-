import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-pancasila-blue mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Halaman yang Anda cari tidak tersedia.</p>
        <Button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</Button>
      </div>
    </div>
  );
}