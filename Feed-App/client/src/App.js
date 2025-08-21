import React from 'react';

function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto' }}>
      <h1>IIIT-Una Feed</h1>
      <p>Frontend was restored. You can now rebuild the UI.</p>
      <p>
        Backend API: <code>http://localhost:5000</code>
      </p>
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';
import PostPreview from './components/PostPreview';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/preview" element={<PostPreview />} />
          </Routes>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
