import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../utils/contact';

interface FooterProps {
  companyName?: string;
  companyLogo?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  showNewsletter?: boolean;
  onNewsletterSubmit?: (email: string) => void;
}

const Footer: React.FC<FooterProps> = ({
  companyName = "Afreshtrip",
  companyLogo = "/assets/tubiao.png",
  contactEmail = CONTACT_EMAIL,
  contactPhone = CONTACT_PHONE,
  socialLinks = {
    facebook: "https://facebook.com/afreshtrip",
    instagram: "https://instagram.com/afreshtrip",
    twitter: "https://twitter.com/afreshtrip",
    youtube: "https://youtube.com/afreshtrip",
  },
  showNewsletter = true,
  onNewsletterSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { t } = useTranslation();

  // Show/hide back to top button based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      // Show only if we scrolled down a bit
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && onNewsletterSubmit) {
      onNewsletterSubmit(email);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset subscription status after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Brand & Socials (Span 4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <img 
                src={companyLogo} 
                alt={`${companyName} Logo`} 
                className="w-10 h-10 rounded-full border-2 border-slate-700 group-hover:border-teal-500 transition-colors" 
              />
              <span className="text-2xl font-bold text-white tracking-tight font-serif group-hover:text-teal-400 transition-colors">
                {companyName}
              </span>
            </Link>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
              {t('footer.companyDescription')}
            </p>
            
            {/* Social Media - Modern Circles */}
            <div className="flex gap-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-serif font-semibold text-white mb-6 tracking-wide">{t('footer.quickLinks')}</h3>
            <ul className="space-y-4">
              {['aboutUs', 'trips', 'blog', 'faq'].map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link === 'aboutUs' ? 'about' : link}`} 
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-teal-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                    {t(`footer.${link}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Support (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-serif font-semibold text-white mb-6 tracking-wide">{t('footer.legal')}</h3>
            <ul className="space-y-4">
              {['privacyPolicy', 'termsOfUse', 'cookiePolicy', 'accessibility'].map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link.replace('Policy', '').replace('OfUse', '')}`} 
                    className="text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {t(`footer.${link}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact (Span 4) */}
          <div className="lg:col-span-4">
        <h3 className="text-lg font-serif font-semibold text-white mb-6 tracking-wide">{t('footer.address')}</h3>

            <div className="mt-8">
              <div className="flex items-center gap-3 text-slate-400 mb-3 hover:text-white transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-teal-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href={`mailto:${contactEmail}`} className="text-sm">{contactEmail}</a>
              </div>
              <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-teal-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href={`tel:${contactPhone}`} className="text-sm">{contactPhone}</a>
              </div>

<div className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer mt-3">
  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-teal-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </div>
 <div className="text-sm leading-relaxed">

  {t('footer.workAddress').split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ))}
</div>
</div>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm">
            © {currentYear} {companyName}. {t('footer.allRightsReserved')}
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <Link to="/terms" className="hover:text-white transition-colors">{t('footer.termsOfUse')}</Link>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* Conditional Back to Top - Only shows if not handled by parent or if explicit */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-500 transition-all focus:outline-none z-40 transform hover:-translate-y-1 hover:shadow-teal-500/30 md:hidden"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </footer>
  );
};

export default Footer;