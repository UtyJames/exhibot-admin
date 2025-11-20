// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../service/dashboardApi';
import { DashboardData } from '../types/dashboard';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dashboardAPI.getDashboardStats();
      setDashboardData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Dashboard API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    dashboardData,
    isLoading,
    error,
    refetch,
  };
};