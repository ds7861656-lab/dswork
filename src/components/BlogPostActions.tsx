import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BlogPostActionsProps {
  onPrint: () => void;
  onLike: () => void;
  onSave: () => void;
  isLiked: boolean;
  isSaved: boolean;
  disabled?: boolean; 
}

const BlogPostActions: React.FC<BlogPostActionsProps> = ({
  onPrint,
  onLike,
  onSave,
  isLiked,
  isSaved
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-6">
      <Link
        to="/blog"
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('blog.backToBlog')}
      </Link>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrint}
          className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          aria-label={t('blog.print')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>
        <button
          onClick={onLike}
          className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
          aria-label={isLiked ? t('blog.unlike') : t('blog.like')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button
          onClick={onSave}
          className={`p-2 rounded-full transition-colors ${isSaved ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'}`}
          aria-label={isSaved ? t('blog.unsave') : t('blog.save')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BlogPostActions;