// src/services/dashboardApi.ts
import { env } from '../utils/env';
import { DashboardResponse } from '../types/dashboard';

const getAuthToken = (): string => {
  const user = localStorage.getItem('exhiibot_user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      // In a real app, you'd store the token separately or get it from context
      return userData.token || '';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return '';
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      message: `Request failed with status ${response.status}` 
    }));
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

export const dashboardAPI = {
  getDashboardStats: async (): Promise<DashboardResponse> => {
    const token = getAuthToken();
    
    const response = await fetch(`${env.api.baseUrl}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};