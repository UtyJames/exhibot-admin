// src/services/cartsApi.ts
import { env } from '../utils/env';

export interface CartProduct {
  _id: string;
  productName: string;
  productDesc: string;
  productImg: string;
  productPrice: string;
  created_at: string;
}

export interface CartOrder {
  _id: string;
  firstName: string;
  lastName: string;
  shippingAddress: string;
  zipCode: string;
  country: string;
  userId: string;
  product: CartProduct;
  created_at: string;
}

export interface CartsResponse {
  success: boolean;
  message: string;
  data: {
    carts: CartOrder[];
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

export const cartsAPI = {
  getCarts: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<CartsResponse> => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${env.api.baseUrl}/admin/carts?${queryParams}`;

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