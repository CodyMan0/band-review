'use client';

import { getPartConfig } from '@/shared/config/parts';
import { formatTimestamp } from '@/shared/lib/format-time';

import { type CommentWithReplies } from '../model/comment.interface';

interface CommentItemProps {
  comment: CommentWithReplies;
  onSeek: (seconds: number) => void;
  onReply: (commentId: string) => void;
}

export function CommentItem({ comment, onSeek, onReply }: CommentItemProps) {
  const partConfig = getPartConfig(comment.author_part);

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-border/60 last:border-b-0">
      {/* Main comment */}
      <div className="flex items-start gap-3">
        {/* Part dot accent */}
        <div className="flex flex-col items-center pt-1 shrink-0">
          <div className={`w-2 h-2 rounded-full ${partConfig.dot} mt-0.5`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Author + timestamp row */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${partConfig.color}`}>
              <span>{partConfig.emoji}</span>
              <span>{comment.author_name}</span>
            </span>

            <button
              onClick={() => onSeek(comment.timestamp_sec)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/8 border border-primary/20 px-2.5 py-0.5 font-mono text-xs font-medium text-primary hover:bg-primary/15 hover:border-primary/35 active:scale-95 transition-all duration-150"
              title="이 시점으로 이동"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" className="opacity-70">
                <polygon points="1,0.5 8,4.5 1,8.5" />
              </svg>
              {formatTimestamp(comment.timestamp_sec)}
            </button>
          </div>

          {/* Comment text */}
          <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>

          {/* Reply button */}
          <button
            onClick={() => onReply(comment.id)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2H2C1.45 2 1 2.45 1 3V7C1 7.55 1.45 8 2 8H4V10.5L7 8H10C10.55 8 11 7.55 11 7V3C11 2.45 10.55 2 10 2Z" />
            </svg>
            답글
          </button>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-5 flex flex-col gap-0 border-l-2 border-border/50 pl-4">
          {comment.replies.map((reply) => {
            const replyPartConfig = getPartConfig(reply.author_part);
            return (
              <div key={reply.id} className="flex items-start gap-2 py-2.5 border-b border-border/30 last:border-b-0">
                <div className={`w-1.5 h-1.5 rounded-full ${replyPartConfig.dot} mt-1.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${replyPartConfig.color} mb-1`}>
                    <span>{replyPartConfig.emoji}</span>
                    <span>{reply.author_name}</span>
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/85">{reply.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
