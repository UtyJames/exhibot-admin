// src/App.tsx
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MainApp from './MainApp';
import { validateEnv } from './utils/env';

// Validate environment on app start
try {
  validateEnv();
} catch (error) {
  console.error('Failed to initialize app:', error);
}

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <LoginPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;