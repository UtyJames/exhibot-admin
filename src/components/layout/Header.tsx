import React from 'react';
import { Menu } from 'lucide-react';
import { HeaderProps } from '../../types';

import logo from '../../assets/logo.png'; 


const Header: React.FC<HeaderProps> = ({ setSidebarOpen, title, subtitle }) => {
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
              {/* Logo Image */}
              <div className="flex-shrink-0">
                <img 
                  src={logo} 
                  alt="Exhiibot Logo" 
                  className="h-8 w-8 object-contain" // Adjust size as needed
                />
              </div>
              
              {/* Title and Subtitle */}
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
              </div>
            </div>
          </div>
          
          {/* Last Updated */}
          <div className="text-right">
            <p className="text-xs text-gray-400">Last updated</p>
            <p className="text-xs font-medium">Jan 18, 2024 - 3:45 PM</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;