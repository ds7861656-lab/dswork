// src/utils/extractMediaFromContent.ts
// Extract image and video URLs from TipTap JSON content

interface TipTapNode {
  type: string;
  attrs?: {
    src?: string;
    [key: string]: any;
  };
  content?: TipTapNode[];
}

interface TipTapContent {
  type: string;
  content?: TipTapNode[];
}

/**
 * Extract all image URLs from TipTap JSON content
 */
export const extractImagesFromContent = (contentJson: string | TipTapContent): string[] => {
  const images: string[] = [];

  try {
    const content = typeof contentJson === 'string' ? JSON.parse(contentJson) : contentJson;

    const traverse = (node: TipTapNode) => {
      // Check if this node is an image
      if (node.type === 'image' && node.attrs?.src) {
        images.push(node.attrs.src);
      }

      // Recursively check child nodes
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    // Start traversal
    if (content.content) {
      content.content.forEach(traverse);
    }

    console.log('📸 Extracted', images.length, 'images from content');
    return images;
  } catch (error) {
    console.error('❌ Error extracting images:', error);
    return [];
  }
};

/**
 * Extract all video URLs from TipTap JSON content
 */
export const extractVideosFromContent = (contentJson: string | TipTapContent): string[] => {
  const videos: string[] = [];

  try {
    const content = typeof contentJson === 'string' ? JSON.parse(contentJson) : contentJson;

    const traverse = (node: TipTapNode) => {
      // Check if this node is a video
      if (node.type === 'video' && node.attrs?.src) {
        videos.push(node.attrs.src);
      }

      // Recursively check child nodes
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    // Start traversal
    if (content.content) {
      content.content.forEach(traverse);
    }

    console.log('🎥 Extracted', videos.length, 'videos from content');
    return videos;
  } catch (error) {
    console.error('❌ Error extracting videos:', error);
    return [];
  }
};

/**
 * Extract both images and videos from TipTap JSON content
 */
export const extractMediaFromContent = (contentJson: string | TipTapContent): {
  images: string[];
  videos: string[];
} => {
  const images = extractImagesFromContent(contentJson);
  const videos = extractVideosFromContent(contentJson);

  console.log('📦 Total media extracted:', {
    images: images.length,
    videos: videos.length
  });

  return { images, videos };
};

/**
 * Get featured image (first image from content or provided featured image)
 */
export const getFeaturedImage = (
  contentJson: string | TipTapContent,
  featuredImage?: string | null
): string | undefined => {
  // If featured image is explicitly set, use it
  if (featuredImage) {
    return featuredImage;
  }

  // Otherwise, use first image from content
  const images = extractImagesFromContent(contentJson);
  return images.length > 0 ? images[0] : undefined;
};
