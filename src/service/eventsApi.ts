// src/services/eventsApi.ts
import { env } from '../utils/env';

export interface EventUser {
  _id: string;
  userName: string;
  email: string;
  profilePic?: string;
}

export interface Event {
  _id: string;
  user: EventUser;
  title: string;
  description: string;
  type: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  ticketUrl?: string;
  location?: string;
  isActive: boolean;
  created_at: string;
}

export interface EventsResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
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

export const eventsAPI = {
  getEvents: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    isActive?: boolean;
  }): Promise<EventsResponse> => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const url = `${env.api.baseUrl}/admin/events?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  deleteEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    const token = getAuthToken();
    
    const response = await fetch(`${env.api.baseUrl}/admin/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};