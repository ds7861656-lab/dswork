import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id',
      'colspan', 'rowspan'
    ],
    ALLOW_DATA_ATTR: false
  });
};

/**
 * Creates a sanitized HTML object for dangerouslySetInnerHTML
 * @param html - The HTML string to sanitize
 * @returns Object with __html property for React
 */
export const createSanitizedHtml = (html: string) => ({
  __html: sanitizeHtml(html)
});