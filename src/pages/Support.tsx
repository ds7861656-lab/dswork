import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Support: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      <Header />
      <main className="flex justify-center items-center min-h-[calc(100vh-80px)] px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Customer Support</h1>
          <p className="text-lg text-gray-600">Get help with your travel plans and bookings.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;