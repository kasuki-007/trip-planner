import { useState } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ActivityTypeIcon } from './ActivityTypeIcon';
import { usePermissions } from '../../hooks/usePermissions';
import { useComments, useAddComment } from '../../hooks/useComments';
import { formatDate } from '../../utils/formatDate';


export function CommentDrawer({ tripId, activity, onClose }) {
  const [newComment, setNewComment] = useState('');
  const { canComment } = usePermissions();
  const { data: comments = [], isLoading } = useComments(tripId, 'activity', activity?.id ?? '');
  const { mutate: addComment, isPending } = useAddComment(tripId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !activity) return;
    addComment({ text: newComment.trim(), refType: 'activity', refId: activity.id });
    setNewComment('');
  };

  if (!activity) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-[#E0E0E0]">
          <ActivityTypeIcon type={activity.type} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#1A1A2E] text-sm">{activity.title}</h3>
            <p className="text-xs text-[#6B7280]">Comments · {comments.length}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A2E]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && (
            <div className="flex justify-center pt-8">
              <div className="w-6 h-6 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!isLoading && comments.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-[#6B7280]">
              <MessageCircle className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No comments yet</p>
            </div>
          )}
          {comments.map((c) => {
            const author = (c).author;
            return (
              <div key={c.id} className="flex gap-3">
                <Avatar name={author?.name ?? 'User'} src={author?.avatar} size="sm" />
                <div className="flex-1">
                  <div className="bg-[#F8F9FA] rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-[#1A1A2E]">{author?.name ?? 'User'}</p>
                    <p className="text-sm text-[#1A1A2E] mt-0.5">{c.body}</p>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1 px-1">{formatDate(c.createdAt, 'MMM d, h:mm a')}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        {canComment && (
          <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-[#E0E0E0] flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 text-sm border border-[#E0E0E0] rounded-xl outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isPending}
              className="p-2 rounded-xl bg-[#E94560] text-white disabled:opacity-40 hover:bg-[#d63851] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </>
  );
}
