import { env } from '../utils/env';

export interface ActivityUser {
  _id: string;
  userName: string;
  email: string;
  profilePic?: string;
}

export interface ActivityActor {
  userId: string | null;
  name: string;
  profilePic: string | null;
}

export interface Activity {
  _id: string;
  user: ActivityUser;
  actor: ActivityActor;
  type: string;
  description: string;
  metadata?: any;
  isRead: boolean;
  created_at: string;
  __v: number;
}

export interface ActivitiesResponse {
  success: boolean;
  message: string;
  data: {
    activities: Activity[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
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

export const activitiesAPI = {
  getActivities: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<ActivitiesResponse> => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);

    const url = `${env.api.baseUrl}/admin/activities?${queryParams}`;

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