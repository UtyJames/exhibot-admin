import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { HeaderProps } from '../../types';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png'; 

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, title, subtitle }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="bg-black text-white border-b border-gray-800 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <img 
                  src={logo} 
                  alt="Exhiibot Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User info and logout */}
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400">Welcome, {user?.name || user?.userName}</p>
              <p className="text-xs font-medium">Last updated: {new Date().toLocaleString()}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;