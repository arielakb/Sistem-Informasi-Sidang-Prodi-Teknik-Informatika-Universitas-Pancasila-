import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pancasila-blue focus:border-pancasila-blue outline-none text-sm"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-pancasila-gold rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-pancasila-blue rounded-full flex items-center justify-center">
            <User className="text-white" size={16} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.nama}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}