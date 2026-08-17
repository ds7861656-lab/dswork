import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BlogPost } from '../types/blog';

interface FeaturedBlogCardProps {
  post: BlogPost;
}

const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({ post }) => {
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getLocale = () => {
    switch (i18n.language) {
      case 'fr': return 'fr-FR';
      case 'es': return 'es-ES';
      case 'zh': return 'zh-CN';
      default: return 'en-US';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(getLocale(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/blog/${post.id}`} className="group block mb-12">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col lg:flex-row h-full lg:h-[400px]">
        {/* Image Section - 50% width on desktop */}
        <div className="lg:w-1/2 relative overflow-hidden h-64 lg:h-full">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            src={post.images?.[0] || '/assets/placeholder-blog.jpg'}
            alt={post.title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-teal-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
              {t(`blog.${post.category.replace(/ /g, '')}`, post.category)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center relative">
          <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
            <span className="flex items-center">
               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               {formatDate(post.date)}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              5 {t('blog.minRead')}
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors font-serif leading-tight">
            {post.title}
          </h2>

          <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-base lg:text-lg">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.author.avatar || '/assets/default-avatar.png'}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = '/assets/default-avatar.png';
                }}
              />
              <div className="text-sm">
                <p className="text-gray-900 font-medium">{post.author.name}</p>
                <p className="text-gray-500 text-xs">{t('blog.aboutAuthor')}</p>
              </div>
            </div>

            <span className="inline-flex items-center text-teal-600 font-semibold group-hover:translate-x-1 transition-transform">
              {t('blog.readMore')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedBlogCard;