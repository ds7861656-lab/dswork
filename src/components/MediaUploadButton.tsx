// src/components/MediaUploadButton.tsx
// Component for uploading and inserting media into TipTap editor

import React, { useRef, useState } from 'react';
import { FiImage, FiVideo, FiLoader } from 'react-icons/fi';
import { useBlog } from '../contexts/BlogContext';
import { useSnackbar } from '../contexts/SnackbarContext';

interface MediaUploadButtonProps {
  type: 'image' | 'video';
  onInsert: (url: string) => void;
  className?: string;
}

const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({ 
  type, 
  onInsert,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { uploadImage } = useBlog();
  const { showError, showSuccess } = useSnackbar();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = type === 'image' 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      : ['video/mp4', 'video/webm', 'video/ogg'];

    if (!validTypes.includes(file.type)) {
      showError(`Invalid ${type} format. Please select a valid ${type} file.`);
      return;
    }

    // Validate file size (10MB for images, 50MB for videos)
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      showError(`File too large. Maximum size is ${type === 'image' ? '10MB' : '50MB'}.`);
      return;
    }

    try {
      setUploading(true);
      console.log(`📤 Uploading ${type}:`, file.name);

      // Upload file
      const url = await uploadImage(file);
      
      // Insert into editor
      onInsert(url);
      
      showSuccess(`${type === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      showError(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const Icon = type === 'image' ? FiImage : FiVideo;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className={`p-2 rounded ${className} ${uploading ? 'opacity-50 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
        title={`Insert ${type === 'image' ? 'Image' : 'Video'}`}
      >
        {uploading ? (
          <FiLoader className="w-4 h-4 animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};

export default MediaUploadButton;
