// src/pages/EventsPage.tsx
import React, { useState } from 'react';
import { Calendar, Filter, ExternalLink, Trash2, MapPin, RefreshCw, AlertCircle, Download } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import { useEvents } from '../hooks/useEvents';

const EventsPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { events, pagination, isLoading, error, refetch, changePage, deleteEvent } = useEvents({
    page: currentPage,
    limit: 20,
    type: typeFilter === 'all' ? undefined : typeFilter,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
  });

  const types = ['all', 'event', 'announcement'];
  const statuses = ['all', 'active', 'inactive'];

  const filteredEvents = events.filter(event => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      event.title?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.user.userName.toLowerCase().includes(searchLower) ||
      event.user.email.toLowerCase().includes(searchLower) ||
      event.type.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to delete this event?\n"${eventTitle}"`)) {
      const success = await deleteEvent(eventId);
      if (success) {
        // Success handled by the hook refresh
      } else {
        alert('Failed to delete event');
      }
    }
  };

  const getEventTypeIcon = (type: string) => {
    const typeIcons: { [key: string]: string } = {
      event: '🎉',
      announcement: '📢',
    };
    return typeIcons[type] || '📅';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isEventActive = (event: any) => {
    const now = new Date();
    const endDate = new Date(event.endDate);
    return event.isActive && endDate > now;
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return 'No description';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Events Management</h2>
        <p className="text-gray-600 text-sm mt-1">Manage and view all platform events</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search events by title, description, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={refetch}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600 whitespace-nowrap">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-black">{filteredEvents.length}</span> of{' '}
            <span className="font-medium text-black">{pagination.total}</span> events
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Failed to load events</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No events found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div key={event._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Event Cover Image */}
                {event.coverImage ? (
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                )}

                <div className="p-4">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {event.user.profilePic ? (
                        <img
                          src={event.user.profilePic}
                          alt={event.user.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {event.user.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-black">{event.user.userName}</p>
                        <p className="text-xs text-gray-600">{event.user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {getEventTypeIcon(event.type)} {event.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isEventActive(event)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isEventActive(event) ? 'Active' : 'Ended'}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <h3 className="font-semibold text-black mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {truncateText(event.description)}
                  </p>

                  {/* Event Metadata */}
                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {event.ticketUrl && (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Tickets
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteEvent(event._id, event.title)}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;