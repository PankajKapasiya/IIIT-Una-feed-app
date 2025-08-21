import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageCircle, Heart, ThumbsUp, MapPin, Calendar, User, Eye } from 'lucide-react';
import axios from 'axios';
import PostCard from './PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPosts = () => {
    let filtered = posts;
    
    if (filter !== 'all') {
      filtered = posts.filter(post => post.postType === filter.toUpperCase());
    }
    
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'mostReactions':
        return filtered.sort((a, b) => {
          const aTotal = Object.values(a.reactions).reduce((sum, val) => sum + val, 0);
          const bTotal = Object.values(b.reactions).reduce((sum, val) => sum + val, 0);
          return bTotal - aTotal;
        });
      case 'mostComments':
        return filtered.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      default:
        return filtered;
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'EVENT':
        return '🎉';
      case 'LOST_FOUND':
        return '🔍';
      case 'ANNOUNCEMENT':
        return '📢';
      default:
        return '📝';
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'EVENT':
        return 'badge-event';
      case 'LOST_FOUND':
        return 'badge-lost-found';
      case 'ANNOUNCEMENT':
        return 'badge-announcement';
      default:
        return 'bg-gray-500';
    }
  };

  const getPostTypeLabel = (type) => {
    switch (type) {
      case 'EVENT':
        return 'Event';
      case 'LOST_FOUND':
        return 'Lost & Found';
      case 'ANNOUNCEMENT':
        return 'Announcement';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Loading posts...</span>
      </div>
    );
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div className="space-y-6">
      {/* Header with Create Post Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Feed</h1>
          <p className="text-gray-600 mt-1">Stay updated with what's happening at IIIT-Una</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Create Post</span>
        </Link>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Post Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Posts</option>
              <option value="event">Events</option>
              <option value="lost_found">Lost & Found</option>
              <option value="announcement">Announcements</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostReactions">Most Reactions</option>
              <option value="mostComments">Most Comments</option>
            </select>
          </div>
        </div>

        {/* Filter Stats */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>Total Posts: {posts.length}</span>
            <span>Filtered: {filteredPosts.length}</span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Events: {posts.filter(p => p.postType === 'EVENT').length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>Lost & Found: {posts.filter(p => p.postType === 'LOST_FOUND').length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span>Announcements: {posts.filter(p => p.postType === 'ANNOUNCEMENT').length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "Be the first to share something with the campus!"
              : `No ${getPostTypeLabel(filter)} posts found.`
            }
          </p>
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Create First Post</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={fetchPosts}
              getPostTypeIcon={getPostTypeIcon}
              getPostTypeColor={getPostTypeColor}
              getPostTypeLabel={getPostTypeLabel}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredPosts.length > 0 && (
        <div className="text-center pt-6">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
