// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { usersAPI, User, UsersResponse } from '../service/usersApi';

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export const useUsers = (params: UseUsersParams = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (fetchParams: UseUsersParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: UsersResponse = await usersAPI.getUsers({
        page: fetchParams.page || params.page || 1,
        limit: fetchParams.limit || params.limit || 20,
        search: fetchParams.search || params.search,
        isActive: fetchParams.isActive ?? params.isActive,
        isCompleted: fetchParams.isCompleted ?? params.isCompleted,
      });

      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Users API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [params.page, params.limit, params.search, params.isActive, params.isCompleted]);

  const refetch = () => {
    fetchUsers();
  };

  const changePage = (newPage: number) => {
    fetchUsers({ ...params, page: newPage });
  };

  const searchUsers = (searchTerm: string) => {
    fetchUsers({ ...params, search: searchTerm, page: 1 });
  };

  const filterUsers = (filters: { isActive?: boolean; isCompleted?: boolean }) => {
    fetchUsers({ ...params, ...filters, page: 1 });
  };

  return {
    users,
    pagination,
    isLoading,
    error,
    refetch,
    changePage,
    searchUsers,
    filterUsers,
  };
};