// src/components/CommentSection.tsx - UPDATED VERSION
// ✅ Proper reply handling + like functionality + nested reply display

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Comment } from '../types/blog';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (comment: string, replyToId?: string) => void;
  onLikeComment: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  onAddComment, 
  onLikeComment 
}) => {
  const { t, i18n } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const getLocale = () => {
    switch (i18n.language) {
      case 'fr': return 'fr-FR';
      case 'es': return 'es-ES';
      case 'zh': return 'zh-CN';
      default: return 'en-US';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(getLocale());
    } catch {
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    console.log('💬 Adding comment...');
    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
      console.log('✅ Comment added');
    } catch (error) {
      console.error('❌ Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyComment.trim() || !replyToId) return;

    console.log('💬 Adding reply to comment:', replyToId);
    setIsSubmittingReply(true);
    try {
      await onAddComment(replyComment, replyToId);
      setReplyComment('');
      setReplyToId(null);
      console.log('✅ Reply added');
    } catch (error) {
      console.error('❌ Failed to add reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyToId(replyToId === commentId ? null : commentId);
    if (replyToId !== commentId) {
      setReplyComment('');
    }
  };

  const toggleRepliesExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const cancelReply = () => {
    setReplyToId(null);
    setReplyComment('');
  };

  // ✅ Render individual comment (used recursively for replies)
  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const showReplies = expandedReplies.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div 
        key={comment.id} 
        className={`flex items-start gap-4 ${isReply ? 'ml-8 mt-4 pb-4' : 'border-b border-gray-200 pb-6'}`}
      >
        {/* Avatar */}
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className={isReply ? 'w-8 h-8 rounded-full' : 'w-10 h-10 rounded-full'}
        />

        {/* Comment Content */}
        <div className="flex-1">
          {/* Header: Name + Date */}
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-medium ${isReply ? 'text-sm' : ''} text-gray-900`}>
              {comment.author.name}
            </h4>
            <span className={`text-gray-500 ${isReply ? 'text-xs' : 'text-sm'}`}>
              {formatDate(comment.date)}
            </span>
          </div>

          {/* Comment Text */}
          <p className={`text-gray-700 mb-3 ${isReply ? 'text-sm' : ''}`}>
            {comment.content}
          </p>

          {/* Actions: Like + Reply */}
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={() => onLikeComment(comment.id)}
              className={`flex items-center gap-1 ${
                isReply ? 'text-xs' : 'text-sm'
              } ${
                comment.isLiked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 transition-colors`}
              title={comment.isLiked ? 'Unlike' : 'Like'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={isReply ? 'h-3 w-3' : 'h-4 w-4'}
                fill={comment.isLiked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{comment.likes}</span>
            </button>

            {/* Reply Button (only for top-level comments) */}
            {!isReply && (
              <button
                onClick={() => handleReplyClick(comment.id)}
                className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                {replyToId === comment.id ? '✕ Cancel' : t('blog.reply', 'Reply')}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyToId === comment.id && (
            <form onSubmit={handleReplySubmit} className="mt-4">
              <div className="mb-3">
                <textarea
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                  placeholder={t('blog.writeReply', 'Write a reply...')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  rows={3}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!replyComment.trim() || isSubmittingReply}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmittingReply ? t('blog.submitting', 'Submitting...') : t('blog.postReply', 'Post Reply')}
                </button>
                <button
                  type="button"
                  onClick={cancelReply}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  {t('blog.cancel', 'Cancel')}
                </button>
              </div>
            </form>
          )}

          {/* Replies Section */}
          {hasReplies && (
            <div className="mt-4">
              <button
                onClick={() => toggleRepliesExpanded(comment.id)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                {showReplies ? '▼' : '▶'} {comment.replies!.length} {t('blog.replies', 'replies')}
              </button>

              {/* Replies List */}
              {showReplies && (
                <div className="mt-3 space-y-4 border-l-2 border-gray-200 pl-4">
                  {comment.replies!.map(reply => renderComment(reply, true))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12 mb-12">
      <h3 className="text-2xl font-bold mb-6">
        {t('blog.comments', 'Comments')} ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('blog.writeComment', 'Write a comment')}
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('blog.commentPlaceholder', 'Share your thoughts...')}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? t('blog.submitting', 'Submitting...') : t('blog.postComment', 'Post Comment')}
        </button>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map(comment => renderComment(comment, false))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          {t('blog.noComments', 'No comments yet. Be the first to comment!')}
        </p>
      )}
    </div>
  );
};

export default CommentSection;