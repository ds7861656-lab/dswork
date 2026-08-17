import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GalleryCard from '../components/GalleryCard';
import FeaturedBlogCard from '../components/FeaturedBlogCard';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { NewsletterService } from '../services/api/newsletterService';
import { CategoryService } from '../services/api/categoryService';
import { newsletterSchema, sanitizeText } from '../utils/validationSchemas';
import { useDebounce } from '../hooks/useDebounce';
import { i18nErrorHandler } from '../utils/i18nErrorHandler';
import { extractTextFromTipTapJson } from '../utils/tiptapUtils';
import type { BlogPost } from '../types/blog';
import type { Category } from '../services/api/categoryService';

// Mock trending tags for the hero section
// TODO: add backend support
const TRENDING_TAGS = ['Japan', 'Solo Travel', 'Sustainable', 'Street Food', 'Hiking'];

// --- CSS Styles for Animations ---
const PageStyles = () => (
  <style>{`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0; /* Start hidden */
    }

    .skeleton-shimmer {
      animation: shimmer 2s infinite linear;
      background: linear-gradient(to right, #f3f4f6 4%, #e5e7eb 25%, #f3f4f6 36%);
      background-size: 1000px 100%;
    }

    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

// --- Skeleton Component for Premium Loading State ---
const BlogSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col">
    <div className="aspect-4/3 w-full skeleton-shimmer"></div>
    <div className="p-6 flex flex-col gap-4 flex-1">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-gray-100 rounded-full skeleton-shimmer"></div>
        <div className="h-4 w-16 bg-gray-100 rounded-full skeleton-shimmer"></div>
      </div>
      <div className="h-8 w-full bg-gray-100 rounded-lg skeleton-shimmer"></div>
      <div className="h-4 w-2/3 bg-gray-100 rounded-lg skeleton-shimmer"></div>
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-50">
        <div className="w-10 h-10 rounded-full skeleton-shimmer"></div>
        <div className="h-4 w-32 bg-gray-100 rounded-full skeleton-shimmer"></div>
      </div>
    </div>
  </div>
);

const EmptyState: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 animate-fade-in-up">
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">{t('blog.noPostsFound')}</h3>
      <p className="text-gray-500 max-w-sm mx-auto">{t('blog.tryDifferentFilters')}</p>
    </div>
  );
};

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const { getBlogPostsPaginated, getBlogPostsByCategory, toggleLike } = useBlog();
  const { user } = useAuth();
  const { showSuccess } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [postsPerPage] = useState(9);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'myblogs' | 'liked' | 'saved'>('all');

  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const postsRef = useRef<HTMLDivElement>(null);
  const newsletterService = new NewsletterService(import.meta.env.VITE_API_BASE_URL || '');
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch categories
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const categoryService = new CategoryService();
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);

      // Fallback categories
      setCategories([
        { id: 1, name: "Adventure", slug: "adventure", color: "#F59E0B", icon: "mountain" },
        { id: 2, name: "Culture", slug: "culture", color: "#8B5CF6", icon: "landmark" },
        { id: 3, name: "Food", slug: "food", color: "#EF4444", icon: "utensils" },
      ]);
    }
  };

  fetchCategories();
}, []);

  // Handle like button
  const handleLike = async (postId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // ✅ CRITICAL FIX: Find post to get current isLiked state
      const post = blogPosts.find(p => p.id === postId);
      if (!post) {
        console.error('❌ Post not found:', postId);
        return;
      }

      console.log('❤️ Toggling like for post:', postId, 'Current isLiked:', post.isLiked);

      // ✅ PASS current isLiked state to toggleLike
      // This ensures backend sends correct type: 1 for like, 0 for unlike
      await toggleLike(postId, post.isLiked ?? false);
      // ✅ Update local state after successful API call
      setBlogPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newIsLiked = !p.isLiked;
          const newLikes = newIsLiked ? (p.likes || 0) + 1 : (p.likes || 0) - 1;
          
          console.log('📊 Updated - isLiked:', newIsLiked, 'likes:', newLikes);
          
          return {
            ...p,
            isLiked: newIsLiked,
            likes: newLikes
          };
        }
        return p;
      }));

      console.log('✅ Like toggle successful!');
    } catch (err) {
      console.error('❌ Failed to toggle like:', err);
    }
  };

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        // Simulate a tiny delay to show off the skeleton animation even on fast networks
        const minDelay = new Promise(resolve => setTimeout(resolve, 800));
        const dataPromise = getBlogPostsPaginated(currentPage, postsPerPage);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, { posts, total }] = await Promise.all([minDelay, dataPromise]);
        
        setBlogPosts(posts);
        setTotalPosts(total);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [getBlogPostsPaginated, currentPage, postsPerPage, t]);

  // Filter and sort
  useEffect(() => {
    let filtered = [...blogPosts];

    if (viewMode === 'myblogs') {
      filtered = filtered.filter(post => post.author.id === user?.uid);
    } else if (viewMode === 'liked') {
      // For now, mock liked posts (will be replaced with database logic)
      // Filter posts that user has liked
      filtered = filtered.filter(post => post.isLiked);
    } else if (viewMode === 'saved') {
      // For now, mock saved posts (will be replaced with database logic)
      // Filter posts that user has saved
      filtered = filtered.filter(post => post.isSaved);
    }

    if (debouncedSearchTerm) {
      filtered = filtered.filter(post => {
        // Search in title and excerpt
        const titleMatch = post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const excerptMatch = (post.excerpt?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || false);

        // Also search in the full content (for TipTap JSON content)
        const contentText = extractTextFromTipTapJson(post.content).toLowerCase();
        const contentMatch = contentText.includes(debouncedSearchTerm.toLowerCase());

        return titleMatch || excerptMatch || contentMatch;
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory || post.categoryId?.toString() === selectedCategory);
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
   }, [blogPosts, debouncedSearchTerm, selectedCategory, sortBy, viewMode, user]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, currentPage, setSearchParams]);

  // Scroll Progress and Back To Top
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      
      setScrollProgress(Number(scroll));
      setShowBackToTop(totalScroll > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const isFirstPage = currentPage === 1;
  const hasPosts = filteredPosts.length > 0;
  // TODO implement real featured post
  const featuredPost = (isFirstPage && hasPosts) ? filteredPosts[0] : null;
  const gridPosts = (isFirstPage && hasPosts) ? filteredPosts : filteredPosts;

  useEffect(() => {
    console.log("featuredPost: ", featuredPost);
    console.log("userId", user?.uid);
  })

  const handlePageChange = (pageNumber: number) => {
    setLoading(true); // Show skeleton on page change
    setCurrentPage(pageNumber);
    if (postsRef.current) {
      postsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sanitizedEmail = sanitizeText(email);
      const validatedData = newsletterSchema.parse({ email: sanitizedEmail });
      setNewsletterLoading(true);
      await newsletterService.subscribe(validatedData.email);
      setIsSubscribed(true);
      setEmail('');
      showSuccess(t('blog.subscriptionSuccess', 'Successfully subscribed to newsletter!'));
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      i18nErrorHandler.showErrorToUser(err, { component: 'Blog', action: 'newsletterSubscription' }, [], t.bind(t));
    } finally {
      setNewsletterLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-teal-100 selection:text-teal-900">
      <PageStyles />
      <Header showNavLinks={false} />
      
      {/* Hero Section */}
      <section className="relative h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
            alt="Travel Background" 
            className={`w-full h-full object-cover transition-all duration-[2s] ease-out ${heroImageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
            onLoad={() => setHeroImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
         
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white font-serif tracking-tight drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t('blog.title', 'Journal')}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('blog.subtitle')}
          </p>
          
          <div className="relative max-w-2xl mx-auto group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full transition-opacity opacity-50 group-hover:opacity-75"></div>
            <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full p-2 shadow-2xl transition-all duration-300 focus-within:bg-white/20 focus-within:border-white/50 focus-within:scale-105">
              <div className="pl-4 text-white/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('blog.searchPlaceholder', 'Search for destinations, tips, or stories...')}
                className="w-full px-4 py-3 bg-transparent text-white placeholder-white/70 border-none focus:ring-0 text-lg"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider mr-2">Trending:</span>
            <button
              onClick={() => { setSelectedCategory(''); setViewMode('myblogs'); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                viewMode === 'myblogs'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md transform scale-105'
                  : 'bg-transparent text-white border-transparent hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {t('blog.myBlogs', 'My Blogs')}
            </button>
            {TRENDING_TAGS.map((tag, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(tag)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm text-white text-xs font-medium transition-all hover:-translate-y-0.5"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar with Scroll Progress */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
        {/* Scroll Progress Indicator */}
        <div 
          className="absolute top-0 left-0 h-0.5 bg-teal-600 transition-all duration-100 ease-out z-50"
          style={{ width: `${scrollProgress * 100}%` }}
        />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-4">
            <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <div className="flex items-center space-x-2 min-w-max">
                <button
                  onClick={() => { setSelectedCategory(''); setViewMode('all'); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    !selectedCategory && viewMode === 'all'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md transform scale-105'
                      : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {t('blog.allBlogs', 'All Blogs')}
                </button>
              
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                      selectedCategory === category.slug
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md transform scale-105'
                        : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              {/* Create New Blog Icon */}
              <button
                onClick={() => navigate('/blog/create')}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-all duration-200 group"
                title={t('blog.createNew', 'Create New Blog')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* Liked Posts Icon */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setViewMode(viewMode === 'liked' ? 'all' : 'liked');
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                  viewMode === 'liked' 
                    ? 'bg-teal-600 text-white' 
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
                title={t('blog.likedPosts', 'Liked Posts')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-all ${viewMode === 'liked' ? '' : 'hover:scale-110'}`} fill={viewMode === 'liked' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Saved Posts Icon */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setViewMode(viewMode === 'saved' ? 'all' : 'saved');
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                  viewMode === 'saved' 
                    ? 'bg-teal-600 text-white' 
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
                title={t('blog.savedPosts', 'Saved Posts')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-all ${viewMode === 'saved' ? '' : 'hover:scale-110'}`} fill={viewMode === 'saved' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:inline">{t('blog.sortBy')}</span>
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent pl-2 pr-8 py-1 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer hover:text-teal-600 transition-colors"
                >
                  <option value="newest">{t('blog.newest')}</option>
                  <option value="oldest">{t('blog.oldest')}</option>
                  <option value="popular">{t('blog.popular')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-16" ref={postsRef}>
        
        {loading ? (
          /* Loading State using Skeleton List */
          <div className="animate-fade-in-up">
            {/* Featured Skeleton */}
            <div className="mb-12 h-[400px] w-full bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
              <div className="lg:w-1/2 h-64 lg:h-full skeleton-shimmer"></div>
              <div className="lg:w-1/2 p-10 flex flex-col justify-center space-y-4">
                <div className="h-6 w-32 bg-gray-100 rounded skeleton-shimmer"></div>
                <div className="h-10 w-full bg-gray-100 rounded skeleton-shimmer"></div>
                <div className="h-4 w-full bg-gray-100 rounded skeleton-shimmer"></div>
                <div className="h-4 w-2/3 bg-gray-100 rounded skeleton-shimmer"></div>
              </div>
            </div>
            
            {/* List Skeleton */}
            <div className="flex flex-col gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col sm:flex-row h-64">
                  <div className="sm:w-2/5 h-full skeleton-shimmer"></div>
                  <div className="sm:w-3/5 p-6 flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="h-4 w-24 bg-gray-100 rounded skeleton-shimmer"></div>
                      <div className="h-4 w-32 bg-gray-100 rounded skeleton-shimmer"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-100 rounded skeleton-shimmer"></div>
                    <div className="h-4 w-full bg-gray-100 rounded skeleton-shimmer"></div>
                    <div className="h-4 w-2/3 bg-gray-100 rounded skeleton-shimmer"></div>
                    <div className="mt-auto flex items-center gap-3 pt-4">
                      <div className="w-10 h-10 rounded-full skeleton-shimmer"></div>
                      <div className="h-4 w-32 bg-gray-100 rounded skeleton-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !hasPosts ? (
          <EmptyState />
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="h-px bg-gray-200 flex-1"></span>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('blog.featured', 'Editor\'s Pick')}</span>
                  <span className="h-px bg-gray-200 flex-1"></span>
                </div>
                <FeaturedBlogCard post={featuredPost} />
              </section>
            )}

            {/* List Posts */}
            <section>
               {featuredPost && <h2 className="text-2xl font-bold font-serif mb-8 text-gray-900 animate-fade-in-up">{t('blog.latestStories', 'Latest Stories')}</h2>}
             
{gridPosts.length > 0 ? (
  <div className="flex flex-col gap-6">
    {gridPosts.map((post, index) => (
      <div 
        key={post.id} 
        className="animate-fade-in-up" 
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row h-full">
          
          {/* Image Section */}
          <div className="sm:w-1/3 h-48 max-h-48 relative overflow-hidden group">
            <img 
              src={post.images?.[0] || 'https://via.placeholder.com/400x300'} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full">
                {post.category}
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="sm:w-2/3 p-4 flex flex-col justify-between">
            
            {/* Meta Info */}
            <div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-teal-600 transition-colors cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
                {post.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 line-clamp-1 mb-3 text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            
            {/* Author & Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <img 
                  src={post.author.avatar || 'https://via.placeholder.com/40'} 
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-xs font-medium text-gray-900">{post.author.name}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Like Button - NO COMMENTS INSIDE TEMPLATE STRING */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                  disabled={!user}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                    post.isLiked
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={!user ? 'Login to like' : post.isLiked ? 'Unlike' : 'Like'}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-3 w-3"
                    fill={post.isLiked ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <span>{post.likes || 0}</span>
                </button>
                
                {post.author.id === user?.uid && (
                  <button
                    onClick={() => navigate(`/blog-editor?id=${post.id}`)}
                    className="px-3 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    {t('blog.edit', 'Edit')}
                  </button>
                )}
                
                <button
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="px-3 py-1 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                >
                  {t('blog.read', 'Read')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
) : !featuredPost && (
  <EmptyState />
)}

            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <nav className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                    }`}
                    aria-label={t('blog.previousPage')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                    }`}
                    aria-label={t('blog.nextPage')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Newsletter Section */}
        <section className="mt-24 relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100 group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
           <div className="absolute top-0 right-0 w-80 h-80 bg-teal-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-700 group-hover:scale-110"></div>
           <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 transition-transform duration-700 group-hover:scale-110"></div>
           
           <div className="relative z-10 p-8 md:p-16 text-center max-w-3xl mx-auto">
            <span className="text-teal-600 font-bold tracking-widest text-xs uppercase mb-4 block">{t('blog.newsletter')}</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-gray-900 leading-tight">
              {t('blog.newsletterTitle', 'Travel Inspiration in Your Inbox')}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg font-light">
              {t('blog.newsletterDescription', 'Join 25,000+ travelers. Get weekly itineraries, hidden gems, and exclusive guides.')}
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('blog.emailPlaceholder')}
                className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50/50 focus:bg-white transition-all shadow-inner"
                required
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {newsletterLoading ? t('blog.subscribing', 'Joining...') : t('blog.subscribe')}
              </button>
            </form>
            
            {isSubscribed && (
              <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-lg inline-block text-sm font-medium animate-fade-in-up border border-green-100">
                <span className="mr-2">✓</span> {t('blog.subscriptionSuccess')}
              </div>
            )}
            
            <p className="mt-6 text-xs text-gray-400">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </section>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white text-teal-600 border border-teal-100 rounded-full shadow-xl flex items-center justify-center hover:bg-teal-50 hover:scale-110 transition-all focus:outline-none z-50 group animate-fade-in-up"
            aria-label={t('blog.backToTop')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;