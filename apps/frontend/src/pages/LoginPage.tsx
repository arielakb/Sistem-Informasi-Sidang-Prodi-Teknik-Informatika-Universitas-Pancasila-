import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
  const { user, setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
      navigate('/dashboard');
    } catch {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pancasila-blue to-pancasila-blue-light">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-pancasila-blue mb-2">SIAS</h1>
        <p className="text-gray-500 mb-6">Sistem Administrasi Skripsi</p>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pancasila-blue focus:border-pancasila-blue outline-none"
              placeholder="admin@univpancasila.ac.id"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pancasila-blue focus:border-pancasila-blue outline-none"
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pancasila-blue text-white py-2 rounded-lg hover:bg-pancasila-blue-dark transition"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}