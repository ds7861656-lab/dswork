import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUploadCloud, FiImage, FiCheck, FiLoader } from 'react-icons/fi';
import { useBlog } from '../contexts/BlogContext';

interface PhotoLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageSrc: string, file?: File) => void;
  delayUpload?: boolean;
}

const PhotoLibrary: React.FC<PhotoLibraryProps> = ({
  isOpen,
  onClose,
  onInsert,
  delayUpload = false,
}) => {
  const { t } = useTranslation();
  const { uploadImage, getUserMediaLibrary } = useBlog(); 
  
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination State
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  // Load images function
  const loadImages = async (pageNum: number, reset: boolean) => {
    if (reset) {
      setIsLoadingLibrary(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await getUserMediaLibrary(pageNum, 18); // Load 18 items (divisible by 2 and 3 columns)
      
      setLibraryImages(prev => reset ? result.images : [...prev, ...result.images]);
      setHasMore(result.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to load library", err);
      setError(t('photoLibrary.error.loadFailed', 'Failed to load images'));
    } finally {
      setIsLoadingLibrary(false);
      setIsLoadingMore(false);
    }
  };

  // Initial fetch when tab changes to library
  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      // Always reset to page 1 on tab switch/open
      loadImages(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadImages(page + 1, false);
    }
  };

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('photoLibrary.error.invalidType', 'Please upload an image file (JPG, PNG, WEBP)'));
      return;
    }

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('photoLibrary.error.tooLarge', 'Image must be smaller than 5MB'));
      return;
    }

    if (delayUpload) {
      const blobUrl = URL.createObjectURL(file);
      onInsert(blobUrl, file);
    } else {
      try {
        setIsUploading(true);
        setError(null);

        const imageUrl = await uploadImage(file);

        // Update library state: Prepend the new image
        setLibraryImages(prev => [imageUrl, ...prev]);

        // Auto-insert if it's a direct upload action
        onInsert(imageUrl);

      } catch (err) {
        console.error(err);
        setError(t('photoLibrary.error.uploadFailed', 'Failed to upload image. Please try again.'));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
                <h3 className="font-semibold text-lg">{t('photoLibrary.title', 'Insert Image')}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-4 shrink-0">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'upload' 
                      ? 'border-black text-black' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('photoLibrary.upload', 'Upload New')}
                </button>
                <button
                  onClick={() => setActiveTab('library')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'library' 
                      ? 'border-black text-black' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('photoLibrary.library', 'Recent Uploads')}
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
                {activeTab === 'upload' && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`
                      border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center text-center p-8 transition-colors
                      ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <FiUploadCloud className="w-12 h-12 text-blue-500 mb-4" />
                        <p className="text-gray-900 font-medium">{t('photoLibrary.uploading', 'Uploading...')}</p>
                        <p className="text-gray-500 text-sm">{t('photoLibrary.pleaseWait', 'Optimizing your image')}</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FiImage className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium mb-1">
                          {t('photoLibrary.dragDrop', 'Click or drag image to upload')}
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                          JPG, PNG, WEBP up to 5MB
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-transform active:scale-95"
                        >
                          {t('photoLibrary.selectFile', 'Select File')}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'library' && (
                  <div className="flex flex-col h-full">
                    {isLoadingLibrary ? (
                      <div className="flex flex-col items-center justify-center py-12 h-full">
                         <FiLoader className="w-8 h-8 animate-spin text-gray-400 mb-2" />
                         <span className="text-gray-400 text-sm">{t('common.loading', 'Loading...')}</span>
                      </div>
                    ) : libraryImages.length === 0 ? (
                      <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiImage className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500">{t('photoLibrary.noImages', 'No images found in your library')}</p>
                        <button 
                          onClick={() => setActiveTab('upload')}
                          className="mt-4 text-blue-600 font-medium hover:underline"
                        >
                          {t('photoLibrary.uploadOne', 'Upload one now')}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
                          {libraryImages.map((src, index) => (
                            <div 
                              key={`${src}-${index}`} // Use index as fallback unique key if src dupes exist
                              onClick={() => onInsert(src)}
                              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 transition-all"
                            >
                              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-full text-blue-600 shadow-sm">
                                <FiCheck className="w-4 h-4" />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Load More Trigger */}
                        {hasMore && (
                          <div className="flex justify-center mt-2 pb-2">
                             <button
                               onClick={handleLoadMore}
                               disabled={isLoadingMore}
                               className="text-sm font-medium text-gray-500 hover:text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
                             >
                               {isLoadingMore && <FiLoader className="animate-spin w-4 h-4" />}
                               {isLoadingMore ? t('common.loading', 'Loading...') : t('common.loadMore', 'Load More')}
                             </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <FiX className="shrink-0" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PhotoLibrary;