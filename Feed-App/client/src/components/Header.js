import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, Users, Bell } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unafeed!
              </h1>
              <p className="text-xs text-gray-500">IIIT-Una Campus Feed</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home size={20} />
              <span>Feed</span>
            </Link>
            
            <Link
              to="/create"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/create') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Plus size={20} />
              <span>Create Post</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">S</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <nav className="flex items-center justify-around">
            <Link
              to="/"
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home size={20} />
              <span className="text-xs">Feed</span>
            </Link>
            
            <Link
              to="/create"
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/create') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Plus size={20} />
              <span className="text-xs">Create</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
