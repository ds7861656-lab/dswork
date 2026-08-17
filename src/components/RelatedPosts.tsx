import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BlogPost } from '../types/blog';

interface RelatedPostsProps {
  posts: BlogPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  const { t } = useTranslation();

  if (posts.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">{t('blog.relatedPosts')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {post.images.length > 0 && (
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
              {post.excerpt && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>}
              <span className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                {t('blog.readMore')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;