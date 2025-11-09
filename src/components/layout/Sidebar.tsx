import React from 'react';
import { Home, Users, ShoppingBag, Trophy, BarChart3, X } from 'lucide-react';
import { SidebarProps } from '../../types';

import Logo from "../../assets/logo.png"; 

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'All Users' },
    { id: 'orders', icon: ShoppingBag, label: 'Manage Orders' },
    { id: 'referrals', icon: Trophy, label: 'All Referrals' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`fixed top-0 left-0 h-full bg-black text-white w-64 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          {/* Sidebar Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={Logo} 
              alt="Exhiibot" 
              className="h-8 w-8 object-contain"
            />
            <h2 className="text-xl font-bold">Exhibot</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentPage === item.id 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;