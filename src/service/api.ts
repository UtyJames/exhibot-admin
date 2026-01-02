// src/services/api.ts
export const API_BASE_URL = 'https://tap-4lzu.onrender.com/api/v1';

// Simple API service without authentication
export const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  const savedUser = localStorage.getItem('exhiibot_user');
  if (savedUser) {
    try {
      const { token } = JSON.parse(savedUser);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error parsing user for token', e);
    }
  }

  return headers;
};

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  return response.json();
};

// Admin API endpoints - will try to call but expect 401
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const adminUsersAPI = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isCompleted?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.isCompleted !== undefined) queryParams.append('isCompleted', params.isCompleted.toString());

    const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateUser: async (id: string, userData: Partial<any>) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  deleteUser: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  toggleUserStatus: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const adminProductsAPI = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/admin/products?${queryParams}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createProduct: async (productData: {
    productName: string;
    productDesc: string;
    productImg: string;
    productPrice: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  updateProduct: async (id: string, productData: Partial<any>) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const adminAnalyticsAPI = {
  getPlatformAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/admin/analytics?${queryParams}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const adminOrdersAPI = {
  getCarts: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/admin/carts?${queryParams}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};