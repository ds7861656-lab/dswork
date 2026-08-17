import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(254, 'Email is too long');

// Comment validation schema
export const commentSchema = z
  .string()
  .min(1, 'Comment cannot be empty')
  .max(1000, 'Comment is too long')
  .refine(
    (val) => !/<script|javascript:|on\w+=/i.test(val),
    'Invalid content detected'
  );

// Blog post validation schema
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(50000, 'Content is too long'),
  excerpt: z
    .string()
    .max(500, 'Excerpt is too long')
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required'),
  tags: z
    .array(z.string().max(50, 'Tag is too long'))
    .max(10, 'Too many tags')
    .optional(),
  featuredImage: z
    .string()
    .url('Invalid image URL')
    .optional()
    .or(z.literal('')),
  isPublished: z.boolean(),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

// Sanitization function for general text input
export const sanitizeText = (text: string): string => {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .trim();
};

// Type exports
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;