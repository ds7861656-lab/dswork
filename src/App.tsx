// Updated App.tsx with Car Rental Routes

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { PageErrorBoundary } from './components/error-boundaries/PageErrorBoundary';
import { SectionErrorBoundary } from './components/error-boundaries/SectionErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import PublishSuccess from './pages/PublishSuccess';
import BlogEditor from './pages/BlogEditor';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Pricing from './pages/Pricing';
import PaymentMethod from './pages/PaymentMethod';
import CardPayment from './pages/CardPayment';
import AlipayPayment from './pages/AlipayPayment';
import PaymentSuccess from './pages/PaymentSuccess';
import Trips from './pages/Trips';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import About from './pages/About';
import Destinations from './pages/Destinations';
import Tours from './pages/Tours';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Accessibility from './pages/Accessibility';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import PaymentResult from './pages/PaymentResult';
import CarRentals from './pages/CarRentals';
import CarRentalDetails from './pages/CarRentalDetails';
import PaymentResultTest from './pages/PaymentResultTest';

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <Router>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PageErrorBoundary pageName="login"><Login /></PageErrorBoundary>} />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<PageErrorBoundary pageName="blog"><BlogProvider><SectionErrorBoundary sectionName="maincontent"><Blog /></SectionErrorBoundary></BlogProvider></PageErrorBoundary>} />
          <Route path="/blog/:id/:slug?" element={<PageErrorBoundary pageName="blogdetails"><BlogProvider><SectionErrorBoundary sectionName="maincontent"><BlogDetails /></SectionErrorBoundary></BlogProvider></PageErrorBoundary>} />
          <Route path="/blog/publish-success" element={<PageErrorBoundary pageName="publishsuccess"><BlogProvider><PublishSuccess /></BlogProvider></PageErrorBoundary>} />
          <Route path="/blog/create" element={<PageErrorBoundary pageName="blogeditor"><BlogProvider><ProtectedRoute><BlogEditor /></ProtectedRoute></BlogProvider></PageErrorBoundary>} />
          <Route path="/blog-editor" element={<PageErrorBoundary pageName="blogeditor"><BlogProvider><ProtectedRoute><BlogEditor /></ProtectedRoute></BlogProvider></PageErrorBoundary>} />
          
          {/* ✅ NEW: Car Rental Routes */}
          <Route path="/car-rentals" element={<PageErrorBoundary pageName="carrentals"><CarRentals /></PageErrorBoundary>} />
          <Route path="/car-rentals/:id" element={<PageErrorBoundary pageName="carrentaldetails"><CarRentalDetails /></PageErrorBoundary>} />
          
          {/* User Pages */}
          <Route path="/profile" element={<PageErrorBoundary pageName="profile"><Profile /></PageErrorBoundary>} />
          <Route path="/subscription" element={<PageErrorBoundary pageName="subscription"><Subscription /></PageErrorBoundary>} />
          <Route path="/dashboard" element={<PageErrorBoundary pageName="dashboard"><ProtectedRoute><Dashboard /></ProtectedRoute></PageErrorBoundary>} />
          
          {/* Pricing & Payment Routes */}
          <Route path="/pricing" element={<PageErrorBoundary pageName="pricing"><Pricing /></PageErrorBoundary>} />
          <Route path="/payment/method" element={<PageErrorBoundary pageName="paymentmethod"><PaymentMethod /></PageErrorBoundary>} />
          <Route path="/payment/card" element={<PageErrorBoundary pageName="cardpayment"><CardPayment /></PageErrorBoundary>} />
          <Route path="/payment/alipay" element={<PageErrorBoundary pageName="alipaypayment"><AlipayPayment /></PageErrorBoundary>} />
          <Route path="/payment/success" element={<PageErrorBoundary pageName="paymentsuccess"><PaymentSuccess /></PageErrorBoundary>} />
          <Route path="/payment/result" element={<PageErrorBoundary pageName="paymentresult"><PaymentResult /></PageErrorBoundary>} />
          
          {/* Other Pages */}
          <Route path="/trips" element={<PageErrorBoundary pageName="trips"><Trips /></PageErrorBoundary>} />
          <Route path="/notifications" element={<PageErrorBoundary pageName="notifications"><Notifications /></PageErrorBoundary>} />
          <Route path="/support" element={<PageErrorBoundary pageName="support"><Support /></PageErrorBoundary>} />
          <Route path="/about" element={<PageErrorBoundary pageName="about"><About /></PageErrorBoundary>} />
          <Route path="/destinations" element={<PageErrorBoundary pageName="destinations"><Destinations /></PageErrorBoundary>} />
          <Route path="/tours" element={<PageErrorBoundary pageName="tours"><Tours /></PageErrorBoundary>} />
          
          {/* Legal Pages */}
          <Route path="/faq" element={<PageErrorBoundary pageName="faq"><FAQ /></PageErrorBoundary>} />
          <Route path="/privacy" element={<PageErrorBoundary pageName="privacy"><Privacy /></PageErrorBoundary>} />
          <Route path="/terms" element={<PageErrorBoundary pageName="terms"><Terms /></PageErrorBoundary>} />
          <Route path="/cookies" element={<PageErrorBoundary pageName="cookies"><Cookies /></PageErrorBoundary>} />
          <Route path="/accessibility" element={<PageErrorBoundary pageName="accessibility"><Accessibility /></PageErrorBoundary>} />
          <Route path="/payment/result/test" element={<PaymentResultTest />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Router>
      </SnackbarProvider>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default App;
