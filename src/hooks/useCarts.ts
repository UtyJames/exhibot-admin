// src/hooks/useCarts.ts
import { useState, useEffect } from 'react';
import { cartsAPI, CartOrder, CartsResponse } from '../service/cartsApi';

interface UseCartsParams {
  page?: number;
  limit?: number;
}

export const useCarts = (params: UseCartsParams = {}) => {
  const [carts, setCarts] = useState<CartOrder[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarts = async (fetchParams: UseCartsParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: CartsResponse = await cartsAPI.getCarts({
        page: fetchParams.page || params.page || 1,
        limit: fetchParams.limit || params.limit || 20,
      });

      setCarts(response.data.carts);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart orders');
      console.error('Carts API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, [params.page, params.limit]);

  const refetch = () => {
    fetchCarts();
  };

  const changePage = (newPage: number) => {
    fetchCarts({ ...params, page: newPage });
  };

  return {
    carts,
    pagination,
    isLoading,
    error,
    refetch,
    changePage,
  };
};