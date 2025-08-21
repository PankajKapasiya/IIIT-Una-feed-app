import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  MapPin, 
  Calendar, 
  User, 
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Flag,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import CommentSection from './CommentSection';

const PostCard = ({ post, onUpdate, getPostTypeIcon, getPostTypeColor, getPostTypeLabel }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, post.id]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`/api/comments/post/${post.id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReaction = async (reactionType) => {
    try {
      const userId = `user-${Date.now()}`;
      await axios.post(`/api/posts/${post.id}/reactions`, {
        reactionType,
        userId
      });
      
      // Update local state
      setUserReactions(prev => ({
        ...prev,
        [reactionType]: !prev[reactionType]
      }));
      
      // Refresh post data
      onUpdate();
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const getTotalReactions = () => {
    return Object.values(post.reactions).reduce((sum, val) => sum + val, 0);
  };

  const renderPostContent = () => {
    switch (post.postType) {
      case 'EVENT':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>{post.content.location || 'Location TBD'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{post.content.date || 'Date TBD'}</span>
              </div>
            </div>
            <p className="text-gray-700">{post.content.description || post.prompt}</p>
            
            {/* RSVP Section */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-2">RSVP</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReaction('going')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    userReactions.going
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50'
                  }`}
                >
                  Going ({post.reactions.going || 0})
                </button>
                <button
                  onClick={() => handleReaction('interested')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    userReactions.interested
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-yellow-50'
                  }`}
                >
                  Interested ({post.reactions.interested || 0})
                </button>
                <button
                  onClick={() => handleReaction('notGoing')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    userReactions.notGoing
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-red-50'
                  }`}
                >
                  Not Going ({post.reactions.notGoing || 0})
                </button>
              </div>
            </div>
          </div>
        );

      case 'LOST_FOUND':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>{post.content.location || 'Location TBD'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{post.content.date || 'Date TBD'}</span>
              </div>
            </div>
            <p className="text-gray-700">
              <span className="font-medium">
                {post.content.isLost ? 'Lost:' : 'Found:'}
              </span> {post.content.item || 'Item description'}
            </p>
            {post.attachment && (
              <div className="bg-gray-100 rounded-lg p-3">
                <span className="text-sm text-gray-600">📷 Image attached</span>
              </div>
            )}
          </div>
        );

      case 'ANNOUNCEMENT':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User size={16} />
                <span>{post.content.department || 'Department TBD'}</span>
              </div>
            </div>
            <p className="text-gray-700">{post.content.content || post.prompt}</p>
            {post.attachment && (
              <div className="bg-gray-100 rounded-lg p-3">
                <span className="text-sm text-gray-600">📄 Document attached</span>
              </div>
            )}
          </div>
        );

      default:
        return <p className="text-gray-700">{post.prompt}</p>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 post-card">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {post.userId?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {post.userId || 'Anonymous User'}
                </span>
                <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getPostTypeColor(post.postType)}`}>
                  {getPostTypeIcon(post.postType)} {getPostTypeLabel(post.postType)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Post Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Edit size={16} />
                  <span>Edit Post</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Flag size={16} />
                  <span>Report Post</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                  <Trash2 size={16} />
                  <span>Delete Post</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>

        {/* Post Content */}
        {renderPostContent()}

        {/* Toxicity Warning */}
        {post.toxicityScore > 0.7 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">Content Warning</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              This post has been flagged for potentially inappropriate content.
            </p>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Reactions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleReaction('likes')}
                className={`p-2 rounded-lg transition-colors ${
                  userReactions.likes
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ThumbsUp size={18} />
              </button>
              <button
                onClick={() => handleReaction('love')}
                className={`p-2 rounded-lg transition-colors ${
                  userReactions.love
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart size={18} />
              </button>
              <span className="text-sm text-gray-500">
                {getTotalReactions()} reactions
              </span>
            </div>

            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm">{post.comments?.length || 0} comments</span>
            </button>
          </div>

          {/* Views */}
          <div className="flex items-center space-x-1 text-gray-500">
            <Eye size={16} />
            <span className="text-sm">176 views</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={comments}
          loading={loadingComments}
          onUpdate={fetchComments}
        />
      )}
    </div>
  );
};

export default PostCard;
