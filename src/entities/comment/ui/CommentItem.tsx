"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { getPartConfig } from "@/shared/config/parts";
import { formatTimestamp } from "@/shared/lib/format-time";
import { PartIcon } from "@/shared/ui/icons";

import { type CommentWithReplies } from "../model/comment.interface";

interface CommentItemProps {
  comment: CommentWithReplies;
  onSeek: (seconds: number) => void;
  onReply: (commentId: string) => void;
  isHighlighted?: boolean;
}

export function CommentItem({ comment, onSeek, onReply, isHighlighted }: CommentItemProps) {
  const partConfig = getPartConfig(comment.author_part);
  const [repliesOpen, setRepliesOpen] = useState(false);

  return (
    <div
      id={`item-${comment.id}`}
      className={`flex flex-col gap-3 border-b border-border/60 py-2 last:border-b-0 rounded-lg ${isHighlighted ? "flash-highlight" : ""}`}
    >
      {/* Main comment */}
      <div className="flex items-start gap-3">
        {/* Part dot accent */}
        <div className="flex shrink-0 flex-col items-center pt-1">
          <div className={`h-2 w-2 rounded-full ${partConfig.dot} mt-0.5`} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Author + timestamp row */}
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${partConfig.color}`}
            >
              <PartIcon part={comment.author_part} size={12} />
              <span>{comment.author_name}</span>
            </span>

            <button
              onClick={() => onSeek(comment.timestamp_sec)}
              className="bg-primary/8 inline-flex items-center gap-1 rounded-full border border-primary/20 px-2.5 py-0.5 font-mono text-xs font-medium text-primary transition-all duration-150 hover:border-primary/35 hover:bg-primary/15 active:scale-95"
              title="이 시점으로 이동"
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="currentColor"
                className="opacity-70"
              >
                <polygon points="1,0.5 8,4.5 1,8.5" />
              </svg>
              {formatTimestamp(comment.timestamp_sec)}
            </button>
          </div>

          {/* Comment text */}
          <p className="text-sm leading-relaxed text-foreground/90">
            {comment.content}
          </p>

          {/* Action row */}
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => onReply(comment.id)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 2H2C1.45 2 1 2.45 1 3V7C1 7.55 1.45 8 2 8H4V10.5L7 8H10C10.55 8 11 7.55 11 7V3C11 2.45 10.55 2 10 2Z" />
              </svg>
              답글
            </button>
            {comment.replies.length > 0 && (
              <button
                onClick={() => setRepliesOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-150 hover:text-primary"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${repliesOpen ? "rotate-180" : ""}`}
                >
                  <path d="M2 3.5L5 6.5L8 3.5" />
                </svg>
                답글 {comment.replies.length}개
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies — collapsible accordion */}
      <AnimatePresence initial={false}>
        {comment.replies.length > 0 && repliesOpen && (
          <motion.div
            key="replies"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-5 flex flex-col gap-0 border-l-2 border-border/50 pl-4">
              {comment.replies.map((reply, i) => {
                const replyPartConfig = getPartConfig(reply.author_part);
                return (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="flex items-start gap-2 border-b border-border/30 py-2.5 last:border-b-0"
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${replyPartConfig.dot} mt-1.5 shrink-0`}
                    />
                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${replyPartConfig.color} mb-1`}
                      >
                        <PartIcon part={reply.author_part} size={12} />
                        <span>{reply.author_name}</span>
                      </span>
                      <p className="text-sm leading-relaxed text-foreground/85">
                        {reply.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
