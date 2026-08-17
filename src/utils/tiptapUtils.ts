import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';

/**
 * Extract plain text from TipTap JSON content
 * This is used for excerpts and search functionality
 */
export const extractTextFromTipTapJson = (content: string): string => {
  try {
    // First try to parse as JSON
    const json = JSON.parse(content);
    
    // Generate HTML from JSON using TipTap
    const html = generateHTML(json, [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
    ]);
    
    // Strip HTML tags and return plain text
    return html.replace(/<[^>]*>/g, '').trim();
  } catch {
    // If it's not valid JSON, treat as plain text
    return content.replace(/<[^>]*>/g, '').trim();
  }
};

/**
 * Generate a clean excerpt from content (either plain text or TipTap JSON)
 */
export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  const text = extractTextFromTipTapJson(content);
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Find the last complete word within the max length
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

/**
 * Check if content is TipTap JSON format
 */
export const isTipTapJson = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === 'object' && parsed.type === 'doc';
  } catch {
    return false;
  }
};