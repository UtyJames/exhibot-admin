// src/pages/PostsPage.tsx
import React, { useState } from 'react';
import { FileText, Filter, ExternalLink, Trash2, Eye, RefreshCw, AlertCircle, Download } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import { usePosts } from '../hooks/usePosts';

const PostsPage: React.FC = () => {
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { posts, pagination, isLoading, error, refetch, changePage, deletePost } = usePosts({
    page: currentPage,
    limit: 20,
    platform: platformFilter === 'all' ? undefined : platformFilter,
    isPublished: statusFilter === 'all' ? undefined : statusFilter === 'published',
  });

  const platforms = ['all', 'instagram', 'tiktok', 'x', 'facebook', 'youtube', 'linkedin'];
  const statuses = ['all', 'published', 'unpublished'];

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      post.content?.toLowerCase().includes(searchLower) ||
      post.user.userName.toLowerCase().includes(searchLower) ||
      post.user.email.toLowerCase().includes(searchLower) ||
      post.platform.toLowerCase().includes(searchLower)
    );
  });

  const handleDeletePost = async (postId: string, postContent: string) => {
    if (window.confirm(`Are you sure you want to delete this post?\n"${postContent.substring(0, 100)}..."`)) {
      const success = await deletePost(postId);
      if (success) {
        // Success handled by the hook refresh
      } else {
        alert('Failed to delete post');
      }
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformIcons: { [key: string]: string } = {
      instagram: '📷',
      tiktok: '🎵',
      x: '🐦',
      facebook: '📘',
      youtube: '📺',
      linkedin: '💼',
    };
    return platformIcons[platform] || '📄';
  };

  const getMediaTypeIcon = (mediaType: string) => {
    const mediaIcons: { [key: string]: string } = {
      video: '🎥',
      image: '🖼️',
      text: '📝',
      link: '🔗',
    };
    return mediaIcons[mediaType] || '📄';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return 'No content';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Posts Management</h2>
        <p className="text-gray-600 text-sm mt-1">Manage and view all platform posts</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search posts by content, username, or email..."
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
              <span className="text-sm text-gray-600 whitespace-nowrap">Platform:</span>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
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
            Showing <span className="font-medium text-black">{filteredPosts.length}</span> of{' '}
            <span className="font-medium text-black">{pagination.total}</span> posts
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Failed to load posts</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No posts found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Post Preview */}
                  <div className="flex-shrink-0">
                    {post.linkPreview?.image ? (
                      <img
                        src={post.linkPreview.image}
                        alt={post.linkPreview.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {post.user.profilePic ? (
                          <img
                            src={post.user.profilePic}
                            alt={post.user.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {post.user.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-black">{post.user.userName}</p>
                          <p className="text-xs text-gray-600">{post.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {getPlatformIcon(post.platform)} {post.platform}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {getMediaTypeIcon(post.mediaType)} {post.mediaType}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">
                      {truncateText(post.content)}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
                      <span>❤️ {post.likes} likes</span>
                      <span>💬 {post.comments} comments</span>
                      <span>👁️ {post.views} views</span>
                      <span>🔄 {post.shares} shares</span>
                      <span>👆 {post.tapCount} taps</span>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>Published: {formatDate(post.publishedAt)}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        post.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {post.mediaUrls[0] && (
                      <a
                        href={post.mediaUrls[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    )}
                    <button
                      onClick={() => handleDeletePost(post._id, post.content)}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
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

export default PostsPage;