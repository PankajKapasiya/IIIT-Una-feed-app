import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Send, Sparkles, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreatePost = () => {
  const [prompt, setPrompt] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [editablePost, setEditablePost] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (classification) {
      setClassification(null);
      setShowPreview(false);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setAttachment(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const classifyPost = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsClassifying(true);
    try {
      const response = await axios.post('/api/ai/classify', { prompt });
      setClassification(response.data);
      setEditablePost({
        title: response.data.suggestedTitle,
        content: response.data.extractedData,
        postType: response.data.postType,
        prompt: prompt
      });
      setShowPreview(true);
      toast.success('Post classified successfully!');
    } catch (error) {
      console.error('Classification error:', error);
      toast.error('Failed to classify post. Please try again.');
    } finally {
      setIsClassifying(false);
    }
  };

  const handlePreviewEdit = (field, value) => {
    setEditablePost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePost = async () => {
    if (!editablePost) return;

    try {
      const formData = new FormData();
      formData.append('prompt', editablePost.prompt);
      formData.append('userId', `user-${Date.now()}`);
      
      if (attachment) {
        formData.append('attachment', attachment);
      }

      await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Post creation error:', error);
      toast.error('Failed to create post. Please try again.');
    }
  };

  const resetFlow = () => {
    setPrompt('');
    setClassification(null);
    setShowPreview(false);
    setEditablePost(null);
    setAttachment(null);
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What would you like to share?
          </h2>
          <p className="text-gray-600">
            Type naturally and let AI figure out the post type
          </p>
        </div>

        {!showPreview ? (
          <>
            {/* Main Input Area */}
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder="e.g., 'Lost my black wallet near the library yesterday evening' or 'Workshop on Docker tomorrow at 5pm in CSE Lab'"
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-field"
                  disabled={isClassifying}
                />
                <button
                  onClick={classifyPost}
                  disabled={isClassifying || !prompt.trim()}
                  className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isClassifying ? (
                    <div className="spinner"></div>
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>

              {/* File Upload Area */}
              <div
                className={`file-upload-area rounded-lg p-6 text-center cursor-pointer ${
                  dragOver ? 'dragover' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                
                {attachment ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-600 font-medium">
                      {attachment.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachment(null);
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600">
                      <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, GIF, PDF up to 5MB
                    </p>
                  </>
                )}
              </div>

              {/* AI Features Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">AI-Powered Features</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Smart post classification (Event, Lost & Found, Announcement)</li>
                  <li>• Automatic content extraction and title generation</li>
                  <li>• Toxicity detection and content moderation</li>
                  <li>• Meme generation in comments with /meme command</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          /* Post Preview */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Does everything look good?
              </h3>
              <p className="text-gray-600">
                Review and edit your post before publishing
              </p>
            </div>

            {/* Post Preview Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getPostTypeColor(editablePost.postType)}`}>
                      {getPostTypeIcon(editablePost.postType)} {editablePost.postType.replace('_', ' ')}
                    </span>
                    {classification?.toxicityScore > 0.7 && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        <AlertTriangle size={12} />
                        <span>Content Warning</span>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={editablePost.title}
                    onChange={(e) => handlePreviewEdit('title', e.target.value)}
                    className="w-full text-xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none mb-3"
                  />

                  <div className="space-y-3">
                    {editablePost.postType === 'EVENT' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editablePost.content.description || ''}
                            onChange={(e) => handlePreviewEdit('content', { ...editablePost.content, description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              type="text"
                              value={editablePost.content.location || ''}
                              onChange={(e) => handlePreviewEdit('content', { ...editablePost.content, location: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                            <input
                              type="text"
                              value={editablePost.content.date || ''}
                              onChange={(e) => handlePreviewEdit('content', { ...editablePost.content, date: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {editablePost.postType === 'LOST_FOUND' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                          <input
                            type="text"
                            value={editablePost.content.item || ''}
                            onChange={(e) => handlePreviewEdit('content', { ...editablePost.content, item: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={editablePost.content.location || ''}
                            onChange={(e) => handlePreviewEdit('content', { ...editablePost.content, location: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {editablePost.postType === 'ANNOUNCEMENT' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          <input
                            type="text"
                            value={editablePost.content.department || ''}
                            onChange={(e) => handlePreviewEdit('content', { ...editablePost.content, department: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                          <textarea
                            value={editablePost.content.content || ''}
                            onChange={(e) => handlePreviewEdit('content', { ...editablePost.content, content: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {attachment && (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs text-center">
                      {attachment.type.startsWith('image/') ? '📷' : '📄'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={resetFlow}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Nah! Restart flow
              </button>
              <button
                onClick={handlePost}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Looks good! Post it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
