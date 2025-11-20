import { useState, useEffect } from 'react';
import { activitiesAPI, Activity, ActivitiesResponse } from '../service/activitiesApi';

interface UseActivitiesParams {
  page?: number;
  limit?: number;
  type?: string;
}

export const useActivities = (params: UseActivitiesParams = {}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async (fetchParams: UseActivitiesParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: ActivitiesResponse = await activitiesAPI.getActivities({
        page: fetchParams.page || params.page || 1,
        limit: fetchParams.limit || params.limit || 20,
        type: fetchParams.type || params.type,
      });

      setActivities(response.data.activities);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activities');
      console.error('Activities API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [params.page, params.limit, params.type]);

  const refetch = () => {
    fetchActivities();
  };

  const changePage = (newPage: number) => {
    fetchActivities({ ...params, page: newPage });
  };

  const filterActivities = (filters: { type?: string }) => {
    fetchActivities({ ...params, ...filters, page: 1 });
  };

  return {
    activities,
    pagination,
    isLoading,
    error,
    refetch,
    changePage,
    filterActivities,
  };
};