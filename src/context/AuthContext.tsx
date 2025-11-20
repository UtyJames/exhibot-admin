// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/index';
import { authAPI } from '../service/authApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app start
    const savedUser = localStorage.getItem('exhiibot_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('exhiibot_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<void> => {
    await authAPI.login(email);
  };

const verifyOTP = async (email: string, otp: string): Promise<void> => {
  const response = await authAPI.verifyOTP(email, otp);
  setUser(response.user);
  
  // Store both user data and token
  const userWithToken = {
    ...response.user,
    token: response.token // Store the JWT token
  };
  
  localStorage.setItem('exhiibot_user', JSON.stringify(userWithToken));
};

  const resendOTP = async (email: string): Promise<void> => {
    await authAPI.resendOTP(email);
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('exhiibot_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        verifyOTP,
        resendOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};