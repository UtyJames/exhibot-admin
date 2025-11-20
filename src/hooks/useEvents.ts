// src/hooks/useEvents.ts
import { useState, useEffect } from 'react';
import { eventsAPI, Event, EventsResponse } from '../service/eventsApi';

interface UseEventsParams {
  page?: number;
  limit?: number;
  type?: string;
  isActive?: boolean;
}

export const useEvents = (params: UseEventsParams = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (fetchParams: UseEventsParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: EventsResponse = await eventsAPI.getEvents({
        page: fetchParams.page || params.page || 1,
        limit: fetchParams.limit || params.limit || 20,
        type: fetchParams.type || params.type,
        isActive: fetchParams.isActive ?? params.isActive,
      });

      setEvents(response.data.events);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
      console.error('Events API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [params.page, params.limit, params.type, params.isActive]);

  const refetch = () => {
    fetchEvents();
  };

  const changePage = (newPage: number) => {
    fetchEvents({ ...params, page: newPage });
  };

  const filterEvents = (filters: { type?: string; isActive?: boolean }) => {
    fetchEvents({ ...params, ...filters, page: 1 });
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventsAPI.deleteEvent(id);
      await fetchEvents(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
      return false;
    }
  };

  return {
    events,
    pagination,
    isLoading,
    error,
    refetch,
    changePage,
    filterEvents,
    deleteEvent,
  };
};