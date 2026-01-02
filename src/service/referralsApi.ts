import { API_BASE_URL, getHeaders, handleResponse } from './api';
import { ReferralApplication, ReviewApplicationPayload } from '../types';

export const referralsAPI = {
  // Submit a referral application
  submitApplication: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/referral-applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Get my submitted applications
  getMyApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/referral-applications/my-applications`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Get all applications (Admin)
  getAllApplications: async (status?: string) => {
    const queryParams = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/referral-applications/admin${queryParams}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Review an application (Approve/Reject)
  reviewApplication: async (applicationId: string, data: ReviewApplicationPayload) => {
    const response = await fetch(`${API_BASE_URL}/referral-applications/admin/${applicationId}/review`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  // Delete referral application and code (Revoke)
  deleteApplication: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/referrals/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
