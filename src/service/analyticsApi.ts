// src/services/analyticsApi.ts
import { env } from '../utils/env';

export interface PlatformAnalytics {
  _id: null;
  totalProfileViews: number;
  totalLinkClicks: number;
  totalNewFollowers: number;
  totalBraceletTaps: number;
}

export interface UserGrowthData {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

export interface PostsByPlatform {
  _id: string;
  count: number;
}

export interface EventsByType {
  _id: string;
  count: number;
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    analytics: PlatformAnalytics;
    userGrowth: UserGrowthData[];
    postsByPlatform: PostsByPlatform[];
    eventsByType: EventsByType[];
  };
}

const getAuthToken = (): string => {
  const user = localStorage.getItem('exhiibot_user');
  if (user) {
    try {
      const userData = JSON.parse(user);
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

export const analyticsAPI = {
  getPlatformAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<AnalyticsResponse> => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${env.api.baseUrl}/admin/analytics?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};