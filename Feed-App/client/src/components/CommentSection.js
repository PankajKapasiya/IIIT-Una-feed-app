import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  Reply, 
  MoreVertical,
  Edit,
  Trash2,
  Flag,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, comments, loading, onUpdate }) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [generatingMeme, setGeneratingMeme] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentData = {
        postId,
        content: newComment,
        userId: `user-${Date.now()}`,
        parentId: replyTo?.id || null
      };

      await axios.post('/api/comments', commentData);
      setNewComment('');
      setReplyTo(null);
      onUpdate();
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await axios.put(`/api/comments/${commentId}`, {
        content: editContent
      });
      setEditingComment(null);
      setEditContent('');
      onUpdate();
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`/api/comments/${commentId}`);
      onUpdate();
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  const handleReaction = async (commentId, reactionType) => {
    try {
      await axios.post(`/api/comments/${commentId}/reactions`, {
        reactionType,
        userId: `user-${Date.now()}`
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const getTotalReactions = (reactions) => {
    return Object.values(reactions || {}).reduce((sum, val) => sum + val, 0);
  };

  const renderComment = (comment, level = 0) => {
    const isEditing = editingComment === comment.id;
    const isReplying = replyTo?.id === comment.id;

    return (
      <div key={comment.id} className={`${level > 0 ? 'comment-thread' : ''}`}>
        <div className="bg-gray-50 rounded-lg p-4 mb-3">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {comment.userId?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 text-sm">
                  {comment.userId || 'Anonymous User'}
                </span>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Comment Actions */}
            <div className="relative">
              <button
                onClick={() => setEditingComment(editingComment === comment.id ? null : comment.id)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <MoreVertical size={14} />
              </button>
              
              {editingComment === comment.id && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => handleEditComment(comment.id)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditComment(comment.id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
              
              {/* Meme Display */}
              {comment.isMeme && comment.memeUrl && (
                <div className="mt-2">
                  <img 
                    src={comment.memeUrl} 
                    alt="Generated meme" 
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Toxicity Warning */}
              {comment.toxicityScore > 0.7 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  ⚠️ This comment has been flagged for potentially inappropriate content.
                </div>
              )}
            </div>
          )}

          {/* Comment Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {/* Reactions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReaction(comment.id, 'likes')}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  onClick={() => handleReaction(comment.id, 'love')}
                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                >
                  <Heart size={14} />
                </button>
                <span className="text-xs text-gray-500">
                  {getTotalReactions(comment.reactions)}
                </span>
              </div>

              {/* Reply Button */}
              <button
                onClick={() => setReplyTo(replyTo?.id === comment.id ? null : comment)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Reply size={12} />
                <span>Reply</span>
              </button>
            </div>

            {/* Meme Generation Info */}
            {comment.content.startsWith('/meme ') && (
              <div className="text-xs text-gray-500">
                Generated with AI
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="ml-8 mb-3">
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Reply to ${comment.userId}...`}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8">
            {comment.replies.map(replyId => {
              const reply = comments.find(c => c.id === replyId);
              return reply ? renderComment(reply, level + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-4">Comments</h4>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? `Reply to ${replyTo.userId}...` : "Write a comment..."}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
            
            {/* Meme Generation Info */}
            {newComment.startsWith('/meme ') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-blue-800">
                  <ImageIcon size={16} />
                  <span className="text-sm font-medium">Meme Generation</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Type /meme followed by your prompt to generate a meme. Example: /meme funny campus life
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post Comment
                </button>
                {replyTo && (
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel Reply
                  </button>
                )}
              </div>

              {/* Meme Generation Button */}
              {newComment.startsWith('/meme ') && (
                <button
                  type="button"
                  onClick={() => {
                    // Meme generation is handled automatically when posting
                    toast.success('Meme will be generated when you post the comment!');
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ImageIcon size={16} />
                  <span>Generate Meme</span>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Comments List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner"></div>
            <span className="ml-3 text-gray-600">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments
              .filter(comment => !comment.parentId) // Only show top-level comments
              .map(comment => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
