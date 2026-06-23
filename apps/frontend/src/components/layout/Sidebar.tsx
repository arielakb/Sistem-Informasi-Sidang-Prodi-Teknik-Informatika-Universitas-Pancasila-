import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CalendarDays,
  FileText,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Database,
  Megaphone,
  Clock,
  Building2,
  ShieldCheck,
  UserPlus,
  TrendingUp,
  History,
  CheckSquare,
  FileCheck,
  Inbox,
} from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: any;
  roles: string[];
}

const menuItems: MenuItem[] = [
  // Dashboard - semua role
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['MAHASISWA', 'DOSEN_PEMBIMBING', 'DOSEN_PENGUJI', 'KAPRODI', 'ADMIN', 'ADMIN_AKADEMIK', 'SEKRETARIAT', 'STAF_PRODI'] },

  // Mahasiswa
  { path: '/skripsi', label: 'Skripsi', icon: GraduationCap, roles: ['MAHASISWA'] },
  { path: '/berkas', label: 'Berkas Sidang', icon: FileText, roles: ['MAHASISWA'] },
  { path: '/berkas/final', label: 'Berkas Final', icon: FileCheck, roles: ['MAHASISWA'] },
  { path: '/jadwal', label: 'Jadwal Sidang', icon: CalendarDays, roles: ['MAHASISWA'] },
  { path: '/peminjaman-lab', label: 'Peminjaman Lab', icon: Building2, roles: ['MAHASISWA'] },
  { path: '/kode-etik', label: 'Kode Etik', icon: ShieldCheck, roles: ['MAHASISWA'] },

  // Dosen Pembimbing
  { path: '/bimbingan', label: 'Bimbingan', icon: Users, roles: ['DOSEN_PEMBIMBING'] },
  { path: '/pembimbing/bimbingan-list', label: 'Daftar Mahasiswa', icon: Inbox, roles: ['DOSEN_PEMBIMBING'] },
  { path: '/pembimbing/logbook-validasi', label: 'Validasi Logbook', icon: CheckSquare, roles: ['DOSEN_PEMBIMBING'] },
  { path: '/pembimbing/kelayakan', label: 'Persetujuan Kelayakan', icon: ClipboardCheck, roles: ['DOSEN_PEMBIMBING'] },

  // Dosen Penguji
  { path: '/penguji/jadwal', label: 'Jadwal Menguji', icon: CalendarDays, roles: ['DOSEN_PENGUJI'] },
  { path: '/penguji/histori', label: 'Histori Penilaian', icon: History, roles: ['DOSEN_PENGUJI'] },

  // Koordinator / Kaprodi
  { path: '/koordinator', label: 'Dashboard Koordinator', icon: BarChart3, roles: ['KAPRODI'] },
  { path: '/koordinator/penugasan', label: 'Penugasan Pembimbing', icon: UserPlus, roles: ['KAPRODI'] },
  { path: '/koordinator/laporan', label: 'Laporan Kinerja', icon: TrendingUp, roles: ['KAPRODI'] },

  // Admin
  { path: '/admin/data-master', label: 'Data Master', icon: Database, roles: ['ADMIN', 'ADMIN_AKADEMIK'] },
  { path: '/admin/pengumuman', label: 'Pengumuman', icon: Megaphone, roles: ['ADMIN', 'ADMIN_AKADEMIK'] },
  { path: '/admin/jadwal', label: 'Penjadwalan', icon: CalendarDays, roles: ['ADMIN', 'ADMIN_AKADEMIK'] },
  { path: '/admin/deadline', label: 'Deadline', icon: Clock, roles: ['ADMIN', 'ADMIN_AKADEMIK'] },

  // Sekretariat
  { path: '/sekretariat', label: 'Dashboard Sekretariat', icon: Inbox, roles: ['SEKRETARIAT'] },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const userRole = user?.role || '';
  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pancasila-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UP</span>
            </div>
            <span className="font-bold text-pancasila-blue">SIAS</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-pancasila-blue border-l-4 border-pancasila-gold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-pancasila-blue' : 'text-gray-400 group-hover:text-gray-600'} />
              {!collapsed && (
                <span className={`font-medium text-sm ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && user && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-gray-900 truncate">{user.nama}</p>
            <p className="text-xs text-gray-500 truncate">{user.role.replace(/_/g, ' ')}</p>
          </div>
        )}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}