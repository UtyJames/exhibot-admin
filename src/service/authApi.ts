// src/services/authApi.ts
import { env, validateEnv } from '../utils/env';

// Validate environment on import
validateEnv();

export interface LoginResponse {
  message: string;
}

export interface VerifyOTPResponse {
  message: string;
  token: string;
  profileCompleted: boolean;
  user: {
    _id: string;
    email: string;
    userName: string;
    name: string;
    profilePic: string;
    created_at: string;
  };
}

export interface ResendOTPResponse {
  message: string;
}

export interface CheckEmailResponse {
  success: boolean;
  exists: boolean;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      message: `Request failed with status ${response.status}` 
    }));
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

export const authAPI = {
  login: async (email: string): Promise<LoginResponse> => {
    const response = await fetch(`${env.api.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  verifyOTP: async (email: string, otp: string): Promise<VerifyOTPResponse> => {
    const response = await fetch(`${env.api.baseUrl}/auth/verify-login-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    return handleResponse(response);
  },

  resendOTP: async (email: string): Promise<ResendOTPResponse> => {
    const response = await fetch(`${env.api.baseUrl}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  checkEmail: async (email: string): Promise<CheckEmailResponse> => {
    const response = await fetch(`${env.api.baseUrl}/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },
};