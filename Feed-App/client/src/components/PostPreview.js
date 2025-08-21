import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const PostPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Post Preview
          </h2>
          <p className="text-gray-600">
            This component shows a preview of posts before publishing
          </p>
        </div>

        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Feature</h3>
          <p className="text-gray-600 mb-6">
            The post preview functionality is integrated into the Create Post flow.
            You can see and edit your post before publishing it.
          </p>
          
          <button
            onClick={() => navigate('/create')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Go to Create Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
