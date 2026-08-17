import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Header showToolbar showNavLinks={false} />
    <main className="px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
        </div>
        <div className="h-64 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default LoadingSkeleton;