// src/components/layout/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Home, Users, ShoppingBag, Trophy, BarChart3, X, FileText, Calendar } from 'lucide-react';
import { SidebarProps } from '../../types';
import { cartsAPI } from '../../service/cartsApi'; // Add this import

import Logo from "../../assets/logo.png"; 

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  // Add state for orders count
  const [ordersCount, setOrdersCount] = useState<number>(0);

  // Add effect to fetch orders count
  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const response = await cartsAPI.getCarts({ limit: 1 });
        setOrdersCount(response.data.pagination.total);
      } catch (error) {
        console.error('Failed to fetch orders count:', error);
      }
    };

    fetchOrdersCount();

    // Optional: Set up polling to refresh count every 30 seconds
    const interval = setInterval(fetchOrdersCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'All Users' },
    { 
      id: 'orders', 
      icon: ShoppingBag, 
      label: 'Manage Orders',
      badge: ordersCount > 0 ? ordersCount : undefined 
    },
    { id: 'posts', icon: FileText, label: 'Posts' },
    { id: 'events', icon: Calendar, label: 'Events' },
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
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-colors relative ${
                currentPage === item.id 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              
              {/* Badge for orders count */}
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;