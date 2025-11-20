// src/services/postsApi.ts
import { env } from '../utils/env';

export interface PostUser {
  _id: string;
  userName: string;
  email: string;
  profilePic?: string;
}

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image?: string;
  images: string[];
  siteName: string;
  favicon: string;
  author: string;
  video: string;
  type: string;
}

export interface Post {
  _id: string;
  user: PostUser;
  platform: string;
  mediaUrls: string[];
  linkPreview?: LinkPreview;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  retweets: number;
  content: string;
  mediaType: string;
  tapCount: number;
  isPublished: boolean;
  publishedAt: string;
  created_at: string;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
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

export const postsAPI = {
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    platform?: string;
    isPublished?: boolean;
  }): Promise<PostsResponse> => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.platform) queryParams.append('platform', params.platform);
    if (params?.isPublished !== undefined) queryParams.append('isPublished', params.isPublished.toString());

    const url = `${env.api.baseUrl}/admin/posts?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  deletePost: async (id: string): Promise<{ success: boolean; message: string }> => {
    const token = getAuthToken();
    
    const response = await fetch(`${env.api.baseUrl}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};