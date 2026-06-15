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
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['MAHASISWA', 'DOSEN_PEMBIMBING', 'DOSEN_PENGUJI', 'KAPRODI', 'ADMIN', 'ADMIN_AKADEMIK'] },
  { path: '/skripsi', label: 'Skripsi', icon: GraduationCap, roles: ['MAHASISWA'] },
  { path: '/logbook', label: 'Logbook', icon: BookOpen, roles: ['MAHASISWA', 'DOSEN_PEMBIMBING'] },
  { path: '/bimbingan', label: 'Bimbingan', icon: Users, roles: ['DOSEN_PEMBIMBING'] },
  { path: '/jadwal', label: 'Jadwal', icon: CalendarDays, roles: ['MAHASISWA', 'DOSEN_PEMBIMBING', 'DOSEN_PENGUJI', 'ADMIN_AKADEMIK'] },
  { path: '/penguji/jadwal', label: 'Jadwal Menguji', icon: ClipboardCheck, roles: ['DOSEN_PENGUJI'] },
  { path: '/berkas', label: 'Berkas', icon: FileText, roles: ['MAHASISWA'] },
  { path: '/koordinator', label: 'Dashboard Koordinator', icon: BarChart3, roles: ['KAPRODI'] },
  { path: '/admin/data-master', label: 'Data Master', icon: Database, roles: ['ADMIN', 'ADMIN_AKADEMIK'] },
  { path: '/admin/jadwal', label: 'Penjadwalan', icon: CalendarDays, roles: ['ADMIN', 'ADMIN_AKADEMIK'] },
  { path: '/pengaturan', label: 'Pengaturan', icon: Settings, roles: ['ADMIN', 'ADMIN_AKADEMIK'] },
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
      <nav className="flex-1 py-4 px-3 space-y-1">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-pancasila-blue border-l-4 border-pancasila-gold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-pancasila-blue' : 'text-gray-400 group-hover:text-gray-600'} />
              {!collapsed && (
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
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