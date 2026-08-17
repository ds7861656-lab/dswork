import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TripPlanner from '../components/trip/TripPlanner';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] selection:bg-teal-100 selection:text-teal-900 flex flex-col font-serif">
      
      {/* Header stays sticky at the top */}
      <Header />
      
      {/* 
        Main Content Area
        - On Mobile: TripPlanner takes full remaining height (calc(100vh-80px)). 
        - On Desktop: Flex-1 fills available space.
        - z-0 ensures it stays behind header (z-50) 
      */}
      <main className="flex-1 flex flex-col relative z-0">
        <TripPlanner />
      </main>

      {/* 
        Footer
        - Hidden on Mobile (md:block) to maximize map area.
        - Visible on Desktop.
      */}
      <div className="hidden md:block shrink-0 z-40 relative">
        <Footer showNewsletter={false} />
      </div>
      
    </div>
  );
};

export default Home;