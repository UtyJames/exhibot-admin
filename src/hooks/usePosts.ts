// src/hooks/usePosts.ts
import { useState, useEffect } from 'react';
import { postsAPI, Post, PostsResponse } from '../service/postsApi';

interface UsePostsParams {
  page?: number;
  limit?: number;
  platform?: string;
  isPublished?: boolean;
}

export const usePosts = (params: UsePostsParams = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (fetchParams: UsePostsParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: PostsResponse = await postsAPI.getPosts({
        page: fetchParams.page || params.page || 1,
        limit: fetchParams.limit || params.limit || 20,
        platform: fetchParams.platform || params.platform,
        isPublished: fetchParams.isPublished ?? params.isPublished,
      });

      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
      console.error('Posts API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [params.page, params.limit, params.platform, params.isPublished]);

  const refetch = () => {
    fetchPosts();
  };

  const changePage = (newPage: number) => {
    fetchPosts({ ...params, page: newPage });
  };

  const filterPosts = (filters: { platform?: string; isPublished?: boolean }) => {
    fetchPosts({ ...params, ...filters, page: 1 });
  };

  const deletePost = async (id: string) => {
    try {
      await postsAPI.deletePost(id);
      await fetchPosts(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
      return false;
    }
  };

  return {
    posts,
    pagination,
    isLoading,
    error,
    refetch,
    changePage,
    filterPosts,
    deletePost,
  };
};