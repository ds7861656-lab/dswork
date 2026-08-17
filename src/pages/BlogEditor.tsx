import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, FiImage, FiX, FiCheck, FiGlobe, FiLock,
  FiAlertCircle, FiSettings, FiMoreHorizontal,
  FiBold, FiItalic, FiList, FiLink, FiRotateCcw, FiRotateCw, FiHash,
  FiMinus, FiVideo
} from 'react-icons/fi';

import { useBlog } from '../contexts/BlogContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useDebounce } from '../hooks/useDebounce';
import FeatureAccessModal from '../components/FeatureAccessModal';
import { FeatureId } from '../types/features';
import PhotoLibrary from '../components/PhotoLibrary';
import MediaUploadButton from '../components/MediaUploadButton';
import { CategoryService } from '../services/api/categoryService';
import { SubscriptionRequiredError } from '../services/api';

// --- TIPTAP V3 IMPORTS ---
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Video } from '../extensions/VideoExtension';
import { generateExcerpt } from '../utils/tiptapUtils';
import { extractMediaFromContent } from '../utils/extractMediaFromContent';

interface BlogFormValues {
  title: string;
  content: string;
  excerpt: string;
  categoryId: number;
  tags: string[];
  featuredImage: string | null;
  isPublished: boolean;
}

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { createBlogPost, updateBlogPost, getBlogPostById, uploadImage } = useBlog();
  const { showError, showSuccess } = useSnackbar();
  //const { checkFeatureAccess } = useFeatureAccess();

  // UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPhotoLibraryOpen, setIsPhotoLibraryOpen] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<'cover' | 'editor'>('editor');
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'forbidden'>('idle');
  const [postId, setPostId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hasFeatureAccess, setHasFeatureAccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPublishPrompt, setShowPublishPrompt] = useState(false);
  const pendingUploadsRef = useRef<Map<string, File>>(new Map());
  const lastSavedValuesRef = useRef<string>('');
  // Refs
  const titleTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { isDirty }
  } = useForm<BlogFormValues>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      categoryId: 1, 
      tags: [],
      featuredImage: null,
      isPublished: false
    }
  });

  const watchedValues = watch();
  const debouncedValues = useDebounce(watchedValues, 1500);



  // --- TIPTAP SETUP ---
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Video, // ✅ VIDEO SUPPORT
      Placeholder.configure({
        placeholder: t('blog.contentPlaceholder', 'Tell your story...'),
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setValue('content', JSON.stringify(editor.getJSON()), { shouldDirty: true });
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[40vh] outline-none',
      },
    },
  });

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get('id');

    if (editId) {
      setPostId(editId);
      const loadPost = async () => {
        try {
          const post = await getBlogPostById(editId);
          if (post) {
            console.log('📸 Post loaded:', {
              title: post.title,
              images: post.images,
              imagesLength: post.images?.length || 0,
              firstImage: post.images?.[0]
            });

            // ✅ FIX: Properly extract featured image from post
            const featuredImageUrl = post.images?.[0] || null;
            
            reset({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt || '',
              categoryId: post.categoryId || 1,
              tags: post.tags || [],
              featuredImage: featuredImageUrl,  // ✅ Store first image as featured
              isPublished: post.isPublished
            });

            console.log('✅ Featured image set to:', featuredImageUrl);

            if (post.content) {
              try {
                editor?.commands.setContent(JSON.parse(post.content));
              } catch {
                // Fallback for old HTML content
                editor?.commands.setContent(post.content);
              }
            }
            
            // Adjust title height after load
            setTimeout(() => {
              if (titleTextareaRef.current) {
                titleTextareaRef.current.style.height = 'auto';
                titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
              }
            }, 100);
          }
        } catch (error) {
          console.error('Error loading post:', error);
          showError(t('common.errorLoading', 'Failed to load post'));
        }
      };
      loadPost();
    }
  }, [location.search, getBlogPostById, reset, editor, showError, t]);

  // --- CATEGORIES ---
  useEffect(() => {
    const categoryService = new CategoryService();
    categoryService.getCategories().then(cats => {
      setCategories(cats.map(c => ({ id: c.id.toString(), name: c.name })));
    }).catch(() => {
      setCategories([{ id: '1', name: 'General' }]);
    });
  }, []);

  // --- MOBILE CHECK ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- AUTO SAVE ---
 useEffect(() => {
    if (!isDirty || !postId) return;

    // ✅ FIX: Create a stable string representation of values
    const currentValuesString = JSON.stringify({
      title: debouncedValues.title,
      content: debouncedValues.content,
      categoryId: debouncedValues.categoryId,
      tags: debouncedValues.tags,
      isPublished: debouncedValues.isPublished,
      featuredImage: debouncedValues.featuredImage
    });

    // ✅ FIX: Only save if values actually changed
    if (currentValuesString === lastSavedValuesRef.current) {
      console.log('⏭️ Skipping auto-save: No changes detected');
      return;
    }

    console.log('💾 Auto-saving changes...');
    lastSavedValuesRef.current = currentValuesString;

    const autoSave = async () => {
      setSaveStatus('saving');
      try {
        // Upload pending images
        const uploadedUrls = new Map<string, string>();
        for (const [blobUrl, file] of pendingUploadsRef.current) {
          const realUrl = await uploadImage(file);
          uploadedUrls.set(blobUrl, realUrl);
          URL.revokeObjectURL(blobUrl);
        }

        // Prepare data with replacements
        const title = debouncedValues.title;
        let content = debouncedValues.content;
        let featuredImage = debouncedValues.featuredImage;

        // Replace in featuredImage
        if (featuredImage && uploadedUrls.has(featuredImage)) {
          featuredImage = uploadedUrls.get(featuredImage)!;
        }

        // Replace in content
        if (content) {
          const contentJson = JSON.parse(content);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const replaceSrc = (node: any) => {
            if (node.type === 'image' && node.attrs?.src && uploadedUrls.has(node.attrs.src)) {
              node.attrs.src = uploadedUrls.get(node.attrs.src);
            }
            if (node.type === 'video' && node.attrs?.src && uploadedUrls.has(node.attrs.src)) {
              node.attrs.src = uploadedUrls.get(node.attrs.src);
            }
            if (node.content) {
              node.content.forEach(replaceSrc);
            }
          };
          replaceSrc(contentJson);
          content = JSON.stringify(contentJson);
        }

        // Clear pending if uploaded
        if (pendingUploadsRef.current.size > 0) {
          pendingUploadsRef.current = new Map();
        }

        await updateBlogPost(postId, {
          title,
          content,
          excerpt: generateExcerpt(content, 150),
          tags: debouncedValues.tags,
          categoryId: debouncedValues.categoryId,
          images: featuredImage ? [featuredImage] : [],
          videos: [],
          isPublished: debouncedValues.isPublished,
        });
        
        setSaveStatus('saved');
        console.log('✅ Auto-save complete!');
        
        // ✅ FIX: Mark form as clean WITHOUT triggering re-render loop
        setTimeout(() => {
          reset(getValues(), { keepValues: true, keepDirty: false });
        }, 100);
        
      } catch (error) {
        console.error('❌ Auto-save error:', error);
        lastSavedValuesRef.current = ''; // Reset on error to allow retry
        
        if (error instanceof SubscriptionRequiredError) {
          setSaveStatus('forbidden');
        } else {
          setSaveStatus('error');
        }
      }
    };
    
    autoSave();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues, postId, isDirty]);

  // --- HANDLERS ---
  const handlePhotoInsert = async (src: string, file?: File) => {
    console.log('📸 Photo insert:', { src, target: photoTarget, hasFile: !!file });
    
    if (photoTarget === 'cover') {
      console.log('🖼️ Setting cover image:', src);
      setValue('featuredImage', src, { shouldDirty: true });
      
      // If file was provided and using delayUpload, upload it now
      if (file) {
        try {
          console.log('📤 Uploading cover image file...');
          const uploadedUrl = await uploadImage(file);
          console.log('✅ Cover uploaded, updating to:', uploadedUrl);
          setValue('featuredImage', uploadedUrl, { shouldDirty: true });
        } catch (err) {
          console.error('❌ Failed to upload cover:', err);
          showError(t('common.errorUploading', 'Failed to upload cover image'));
        }
      }
    } else {
      console.log('🖼️ Inserting image into editor:', src);
      editor?.chain().focus().setImage({ src }).run();
    }
    
    setIsPhotoLibraryOpen(false);
  };

  const handleTitleResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  };

const onPublishToggle = async () => {
  // ✅ Don't block immediately - let backend decide
  const newValue = !getValues('isPublished');
  setValue('isPublished', newValue, { shouldDirty: true }); // Optimistic

  if (postId) {
    try {
      await updateBlogPost(postId, { isPublished: newValue });
      showSuccess(newValue ? t('blog.published') : t('blog.draftSaved', 'Reverted to draft'));
    } catch (err) {
      setValue('isPublished', !newValue); // Revert
      // ✅ Only show modal on actual subscription error from backend
      if (err instanceof SubscriptionRequiredError) {
        setShowUpgradeModal(true);
      } else {
        showError('Failed to update publish status');
      }
    }
  }
};

const handlePublishNow = async () => {
  try {
    // ✅ Don't check hasFeatureAccess here - let backend decide
    setValue('isPublished', true, { shouldDirty: true });
    await handleSubmit(onSave)();
    showSuccess(t('blog.published', 'Published successfully!'));
    setShowPublishPrompt(false);
    setTimeout(() => navigate('/blog'), 500);
  } catch (error) {
    console.error('❌ Publish error:', error);
    // ✅ Only show subscription modal if backend says so
    if (error instanceof SubscriptionRequiredError) {
      setShowUpgradeModal(true);
    }
  }
};

const onSave = async (data: BlogFormValues) => {
  setSaveStatus('saving');
  try {
    // ✅ Extract media from TipTap content
    const { images: contentImages, videos: contentVideos } = extractMediaFromContent(data.content);
    
    // ✅ IMPORTANT: Always preserve featured image as FIRST in array
    // If user has a featured image, ensure it's first
    // Then add any other images from content (excluding the featured image to avoid dupes)
    let allImages: string[] = [];
    
    if (data.featuredImage) {
      // Featured image is first
      allImages = [data.featuredImage];
      // Add other content images (but not the featured image again)
      const otherImages = contentImages.filter(img => img !== data.featuredImage);
      allImages.push(...otherImages);
    } else {
      // No featured image, use all content images
      allImages = contentImages;
    }
    
    console.log('📦 Preparing blog post data:');
    console.log('  Featured image:', data.featuredImage);
    console.log('  Content images:', contentImages);
    console.log('  All images (final):', allImages);
    console.log('  Videos:', contentVideos);

    if (postId) {
      // Update existing post
      console.log('🔄 Updating post:', postId);
      console.log('  With images:', allImages);
      
      await updateBlogPost(postId, {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || generateExcerpt(data.content, 150),
        tags: data.tags,
        categoryId: data.categoryId,
        images: allImages,  // ✅ Featured image will be first
        videos: contentVideos,
        isPublished: data.isPublished
      });
      showSuccess(t('blog.updated', 'Post updated successfully!'));
    } else {
      // Create new post
      console.log('✨ Creating new post');
      console.log('  With images:', allImages);
      
      const newId = await createBlogPost({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || generateExcerpt(data.content, 150),
        tags: data.tags,
        categoryId: data.categoryId,
        images: allImages,  // ✅ Featured image will be first
        videos: contentVideos,
        isPublished: data.isPublished
      });
      setPostId(newId);
      showSuccess(t('blog.created', 'Post created successfully!'));
    }
    setSaveStatus('saved');
  } catch (error) {
    console.error('❌ Save error:', error);
    setSaveStatus('error');
    
    // ✅ Only show subscription modal if it's actually a subscription error
    if (error instanceof SubscriptionRequiredError) {
      setSaveStatus('forbidden');
      setShowUpgradeModal(true);
    } else {
      showError(t('common.errorSaving', 'Failed to save post'));
    }
  }
};

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. TOP NAVIGATION */}
      <nav className="sticky top-0 z-20 bg-gradient-to-r from-teal-600 to-teal-500 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
            className="p-2 text-white hover:bg-teal-600 rounded-full transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>

          {/* Title & Status */}
          <div className="flex items-center gap-3">
            <h1 className="text-white font-semibold text-lg hidden sm:block">
              {postId ? t('blog.editPost', 'Edit Post') : t('blog.newPost', 'New Post')}
            </h1>

            {/* Save Status */}
            {saveStatus === 'saving' && (
              <span className="text-teal-100 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                {t('blog.saving', 'Saving...')}
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-white flex items-center gap-1 bg-teal-600 px-2 py-1 rounded-md">
                <FiCheck className="w-3 h-3"/>
                {t('blog.saved', 'Saved')}
              </span>
            )}
            {saveStatus === 'forbidden' && (
              <span className="text-amber-300 flex items-center gap-1 bg-amber-600/20 px-2 py-1 rounded-md">
                <FiAlertCircle className="w-3 h-3"/>
                {t('blog.upgradeRequired')}
              </span>
            )}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Close and Save Draft Button */}
          <button
            onClick={async () => {
              // Save as draft
              setValue('isPublished', false, { shouldDirty: true });
              await handleSubmit(onSave)();
              // Navigate back after saving
              setTimeout(() => navigate('/blog'), 500);
            }}
            className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
          >
            {t('blog.closeAndSaveDraft', 'Close and Save Draft')}
          </button>

          {/* Publish Button */}
          <button
            onClick={async () => {
              // Save and publish
              setValue('isPublished', true, { shouldDirty: true });
              await handleSubmit(onSave)();
              showSuccess(t('blog.published', 'Published successfully!'));
              // Optional: Navigate to success page or blog list
              setTimeout(() => navigate('/blog'), 500);
            }}
            className="px-5 py-2 bg-white text-teal-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all shadow-sm"
          >
            {t('blog.publish', 'Publish')}
          </button>

          {/* Settings Trigger (Optional) */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-white hover:bg-teal-600 rounded-full transition-colors"
          >
            <FiSettings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* 2. WRITING CANVAS */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 sm:py-16">
        
        {/* Cover Image Area (Document-based) */}
        <div className="group relative mb-8">
          {watch('featuredImage') ? (
            <div className="relative w-full aspect-video sm:aspect-21/9 rounded-xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
              <img 
                src={watch('featuredImage')!} 
                alt="Cover" 
                className="w-full h-full object-cover"
                onError={() => console.error('❌ Failed to load featured image:', watch('featuredImage'))}
              />
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => { 
                    console.log('🔄 Opening photo library for cover update');
                    setPhotoTarget('cover'); 
                    setIsPhotoLibraryOpen(true); 
                  }}
                  className="bg-white/90 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm mr-2 hover:bg-white"
                >
                  {t('blog.changeCover', 'Change Cover')}
                </button>
                <button 
                  onClick={() => {
                    console.log('🗑️ Removing featured image');
                    setValue('featuredImage', null, { shouldDirty: true });
                  }}
                  className="bg-white/90 text-red-600 p-1.5 rounded-md shadow-sm hover:bg-white"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { 
                console.log('➕ Opening photo library to add cover');
                setPhotoTarget('cover'); 
                setIsPhotoLibraryOpen(true); 
              }}
              className="group flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors py-2 px-0 mb-4 text-sm font-medium"
            >
              <FiImage className="w-4 h-4" />
              <span>{t('blog.addCover', 'Add Cover Image')}</span>
            </button>
          )}
        </div>

        {/* Title Input (Seamless) */}
        <div className="relative mb-6">
          <textarea
            {...register('title')}
            ref={(e) => {
              register('title').ref(e);
              titleTextareaRef.current = e;
            }}
            onInput={(e) => {
              register('title').onChange(e); // Maintain hook form state
              handleTitleResize(e);
            }}
            placeholder={t('blog.titlePlaceholder', 'Article Title')}
            rows={1}
            className="w-full text-4xl sm:text-5xl font-extrabold text-gray-900 placeholder-gray-300 border-none resize-none focus:ring-0 bg-transparent p-0 leading-tight"
            style={{ minHeight: '60px' }}
          />
        </div>

        {/* Meta Chips (Category/Tags) */}
        <div className="flex flex-wrap items-center gap-2 mb-10 text-sm">
           <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
             {categories.find(c => c.id === watch('categoryId').toString())?.name || 'General'}
           </span>
           {watch('tags').length > 0 && (
             <span className="text-gray-400">|</span>
           )}
           {watch('tags').map(tag => (
             <span key={tag} className="text-gray-500">#{tag}</span>
           ))}
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
           >
             + {t('blog.editMeta', 'Edit details')}
           </button>
        </div>

        {/* Editor */}
        <div className="relative min-h-[50vh] prose prose-lg max-w-none text-gray-800 leading-relaxed">
          {/* Fixed Formatting Toolbar (Desktop) */}
          {editor && (
            <div className="hidden sm:flex items-center bg-white shadow-sm border border-gray-200 justify-center overflow-hidden divide-x divide-gray-100 mb-4 p-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor.isActive('bold') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FiBold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor.isActive('italic') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FiItalic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="font-bold text-xs">H2</span>
              </button>
              <button
                onClick={() => {
                   const url = window.prompt('URL');
                   if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                className={`p-2 rounded ${editor.isActive('link') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FiLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${editor.isActive('bulletList') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="p-2 rounded text-gray-600 hover:bg-gray-50"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              
              {/* ✅ INLINE MEDIA UPLOAD BUTTONS */}
              <MediaUploadButton
                type="image"
                onInsert={(url) => editor.chain().focus().setImage({ src: url }).run()}
              />
              <MediaUploadButton
                type="video"
                onInsert={(url) => editor.chain().focus().setVideo({ src: url }).run()}
              />
            </div>
          )}


          <EditorContent editor={editor} />
        </div>
      </main>

      {/* 3. MOBILE TOOLBAR (Fixed Bottom) */}
      {isMobile && editor && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30 flex items-center justify-between pb-safe">
          <div className="flex items-center gap-1">
             <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 text-gray-500 disabled:opacity-30">
               <FiRotateCcw className="w-5 h-5" />
             </button>
             <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 text-gray-500 disabled:opacity-30">
               <FiRotateCw className="w-5 h-5" />
             </button>
          </div>
          <div className="h-4 w-px bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-4">
             <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1 ${editor.isActive('heading', { level: 2 }) ? 'text-blue-600' : 'text-gray-600'}`}>
               <FiHash className="w-5 h-5" />
             </button>
             <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1 ${editor.isActive('bulletList') ? 'text-blue-600' : 'text-gray-600'}`}>
               <FiList className="w-5 h-5" />
             </button>
             
             {/* ✅ INLINE MEDIA UPLOAD BUTTONS - MOBILE */}
             <MediaUploadButton
               type="image"
               onInsert={(url) => editor.chain().focus().setImage({ src: url }).run()}
               className="p-1"
             />
             <MediaUploadButton
               type="video"
               onInsert={(url) => editor.chain().focus().setVideo({ src: url }).run()}
               className="p-1"
             />
             
             <button onClick={() => setIsSettingsOpen(true)} className="p-1 text-gray-600">
               <FiMoreHorizontal className="w-5 h-5" />
             </button>
          </div>
        </div>
      )}

      {/* 4. SETTINGS SIDEBAR (Drawer) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto p-6 border-l border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-semibold text-lg">{t('blog.postSettings', 'Post Settings')}</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="text-sm font-medium text-gray-700 block mb-2">{t('blog.category')}</label>
                   <select
                     {...register('categoryId')}
                     className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                   >
                     {categories.map(c => (
                       <option key={c.id} value={parseInt(c.id)}>{c.name}</option>
                     ))}
                   </select>
                </div>

                <div>
                   <label className="text-sm font-medium text-gray-700 block mb-2">{t('blog.tags')}</label>
                   <Controller
                     name="tags"
                     control={control}
                     render={({ field: { value, onChange } }) => (
                       <div className="space-y-2">
                         <div className="flex flex-wrap gap-2">
                           {value.map(tag => (
                             <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                               {tag}
                               <button onClick={() => onChange(value.filter(t => t !== tag))}><FiX className="w-3 h-3" /></button>
                             </span>
                           ))}
                         </div>
                         <input
                           placeholder="Add tag and press Enter"
                           className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                               e.preventDefault();
                               const val = e.currentTarget.value.trim();
                               if (val && !value.includes(val)) {
                                 onChange([...value, val]);
                                 e.currentTarget.value = '';
                               }
                             }
                           }}
                         />
                       </div>
                     )}
                   />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">{t('blog.excerpt')}</label>
                  <textarea
                    {...register('excerpt')}
                    rows={4}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none resize-none"
                    placeholder={t('blog.excerptHint', 'Write a short summary...')}
                  />
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{t('blog.words')}: {wordCount}</span>
                    <span>ID: {postId || 'new'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <PhotoLibrary
        isOpen={isPhotoLibraryOpen}
        onClose={() => setIsPhotoLibraryOpen(false)}
        onInsert={handlePhotoInsert}
        delayUpload={true}
      />
      <FeatureAccessModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureId={FeatureId.BLOG_PUBLISHING}
      />

      {/* Publish Prompt Modal */}
      <AnimatePresence>
        {showPublishPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPublishPrompt(false)}
              className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 p-6 w-full max-w-md mx-4"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('blog.publishPromptTitle', 'Publish your blog post?')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('blog.publishPromptMessage', 'Would you like to publish this post now or keep it as a draft?')}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowPublishPrompt(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    {t('blog.stayDraft', 'Stay in Draft')}
                  </button>
                  <button
                    onClick={handlePublishNow}
                    className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg font-medium transition-colors"
                  >
                    {t('blog.publishNow', 'Publish Now')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogEditor;
