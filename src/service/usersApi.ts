// src/services/usersApi.ts
import { env } from '../utils/env';

export interface User {
  _id: string;
  userName: string;
  role: string;
  isCompleted: boolean;
  isActive: boolean;
  email: string;
  tags: string[];
  followers: string[];
  following: string[];
  created_at: string;
  token?: string;
  address?: string;
  bio?: string;
  name?: string;
  profilePic?: string;
  bannerImage?: string;
  socialLinks?: {
    instagram?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
    discord?: string;
    linkedin?: string;
  };
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  bio?: string;
  isActive?: boolean;
  isCompleted?: boolean;
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

export const usersAPI = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isCompleted?: boolean;
  }): Promise<UsersResponse> => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.isCompleted !== undefined) queryParams.append('isCompleted', params.isCompleted.toString());

    const url = `${env.api.baseUrl}/admin/users?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getUser: async (id: string): Promise<UserResponse> => {
    const token = getAuthToken();
    
    const response = await fetch(`${env.api.baseUrl}/admin/users/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<UserResponse> => {
    const token = getAuthToken();
    
    const response = await fetch(`${env.api.baseUrl}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },

  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const token = getAuthToken();
    
    const response = await fetch(`${env.api.baseUrl}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  toggleUserStatus: async (id: string): Promise<UserResponse> => {
    const token = getAuthToken();
    
    const response = await fetch(`${env.api.baseUrl}/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};