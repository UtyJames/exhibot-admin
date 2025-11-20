// src/hooks/useAnalytics.ts
import { useState, useEffect } from 'react';
import { analyticsAPI, AnalyticsResponse } from '../service/analyticsApi';

interface UseAnalyticsParams {
  startDate?: string;
  endDate?: string;
}

export const useAnalytics = (params: UseAnalyticsParams = {}) => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (fetchParams: UseAnalyticsParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await analyticsAPI.getPlatformAnalytics({
        startDate: fetchParams.startDate || params.startDate,
        endDate: fetchParams.endDate || params.endDate,
      });

      setAnalytics(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
      console.error('Analytics API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [params.startDate, params.endDate]);

  const refetch = () => {
    fetchAnalytics();
  };

  const fetchWithDateRange = (startDate: string, endDate: string) => {
    fetchAnalytics({ startDate, endDate });
  };

  return {
    analytics,
    isLoading,
    error,
    refetch,
    fetchWithDateRange,
  };
};