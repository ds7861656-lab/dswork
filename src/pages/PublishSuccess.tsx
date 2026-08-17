import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface PublishSuccessProps {
  showPreview?: boolean;
  showShareOptions?: boolean;
  onCreateAnother?: () => void;
  onGoToDashboard?: () => void;
}

const PublishSuccess: React.FC<PublishSuccessProps> = ({
  showPreview = true,
  showShareOptions = true,
  onCreateAnother,
  onGoToDashboard,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  // const [shareOpen, setShareOpen] = useState(false);

  const getLocale = () => {
    switch (i18n.language) {
      case 'fr': return 'fr-FR';
      case 'es': return 'es-ES';
      case 'zh': return 'zh-CN';
      default: return 'en-US';
    }
  };
  
  // Get post data from location state
  const postData = (location.state as { 
    id?: string; 
    title?: string; 
    excerpt?: string; 
    image?: string;
    category?: string;
  }) || {};
  
  const { id, title, excerpt, image, category } = postData;

  // Hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Generate shareable URL
  const getShareableUrl = () => {
    return id ? `${window.location.origin}/blog/${id}` : window.location.origin;
  };

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl())
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      })
      .catch(err => console.error('Failed to copy link:', err));
  };

  // Handle social sharing
  const handleSocialShare = (platform: string) => {
    const url = getShareableUrl();
    const text = title ? `Check out my new blog post: ${title}` : 'Check out this blog post';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // Navigation handlers
  const handleRead = () => {
    if (id) {
      navigate(`/blog/${id}`);
    }
  };

  const handleBack = () => {
    navigate('/blog');
  };

  const handleCreateAnother = () => {
    if (onCreateAnother) {
      onCreateAnother();
    } else {
      navigate('/blog/create');
    }
  };

  const handleGoToDashboard = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header showToolbar showNavLinks={false} />
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <div 
                  className={`w-3 h-3 rounded-full ${
                    ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-red-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="px-4 py-8 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12 md:py-20">
            {/* Success Icon with Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-green-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 md:w-16 md:h-16 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-25"></div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              {t('blog.publishedSuccessfully')}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 text-center max-w-lg">
              {t('blog.publishSuccessMessage')}
            </p>

            {/* Post Preview */}
            {showPreview && title && (
              <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={user?.photoURL || '/assets/default-avatar.png'} 
                    alt={user?.displayName || 'User'} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user?.displayName || user?.email || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString(getLocale())}</p>
                  </div>
                </div>
                
                {image && (
                  <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
                
                {excerpt && (
                  <p className="text-gray-600 mb-3">{excerpt}</p>
                )}
                
                {category && (
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                    {category}
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleRead}
                disabled={!id}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                {t('blog.readPost')}
              </button>
              
              <button
                onClick={handleCreateAnother}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('blog.createAnother')}
              </button>
              
              <button
                onClick={handleGoToDashboard}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t('blog.goToDashboard')}
              </button>
            </div>

            {/* Share Options */}
            {showShareOptions && id && (
              <div className="w-full max-w-2xl">
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    {t('blog.shareYourPost')}
                  </h3>
                  
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSocialShare('facebook')}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Share on Facebook"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleSocialShare('twitter')}
                        className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        aria-label="Share on Twitter"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleSocialShare('linkedin')}
                        className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Share on LinkedIn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={handleCopyLink}
                        className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        aria-label="Copy link"
                      >
                        {copiedLink ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    {copiedLink && (
                      <p className="text-sm text-green-600 animate-pulse">
                        {t('blog.linkCopied')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Options */}
            <div className="mt-8 text-center">
              <button
                onClick={handleBack}
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors focus:outline-none focus:underline"
              >
                {t('blog.backToBlog')}
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PublishSuccess;