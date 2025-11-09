import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import ReferralsPage from './pages/ReferralsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const getPageTitle = (): string => {
    const titles: { [key: string]: string } = {
      home: 'Admin',
      users: 'All Users',
      orders: 'Manage Orders',
      referrals: 'Referrals',
      analytics: 'Analytics'
    };
    return titles[currentPage] || 'Exhiibot Admin';
  };

  const getPageSubtitle = (): string => {
    const subtitles: { [key: string]: string } = {
      home: 'Platform Management',
      users: 'Manage and view all platform users',
      orders: 'View and manage all customer orders',
      referrals: 'View top referrers and their performance',
      analytics: 'Detailed analytics and insights'
    };
    return subtitles[currentPage] || 'Platform Management';
  };

  const renderCurrentPage = (): JSX.Element => {
    switch (currentPage) {
      case 'home':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'users':
        return <UsersPage />;
      case 'orders':
        return <OrdersPage />;
      case 'referrals':
        return <ReferralsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 lg:ml-64">
        <Header 
          setSidebarOpen={setSidebarOpen}
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
        />
        
        <main className="p-4 sm:p-6 lg:p-8">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;