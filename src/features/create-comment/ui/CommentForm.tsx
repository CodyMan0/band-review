"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { createComment } from "@/features/create-comment/action/create-comment";
import { getProfile } from "@/shared/config/profile";
import { formatTimestamp } from "@/shared/lib/format-time";
import { Input } from "@/shared/ui";

const TOOLTIP_KEY = "harmony-band-timestamp-guide-seen";

interface CommentFormProps {
  sessionId: string;
  currentTime: number;
  parentId?: string | null;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export function CommentForm({
  sessionId,
  currentTime,
  parentId,
  onSubmitted,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [displayedTime, setDisplayedTime] = useState(formatTimestamp(currentTime));
  const prevTimeRef = useRef(formatTimestamp(currentTime));

  // First-time tooltip
  useEffect(() => {
    if (parentId) return;
    const seen = localStorage.getItem(TOOLTIP_KEY);
    if (!seen) {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
        localStorage.setItem(TOOLTIP_KEY, "1");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [parentId]);

  // Rolling animation when displayed timestamp changes
  useEffect(() => {
    const formatted = formatTimestamp(currentTime);
    if (formatted !== prevTimeRef.current) {
      prevTimeRef.current = formatted;
      setDisplayedTime(formatted);
    }
  }, [currentTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const profile = getProfile();
    if (!profile) return;

    setIsSubmitting(true);
    setError("");

    const result = await createComment({
      session_id: sessionId,
      parent_id: parentId || null,
      timestamp_sec: currentTime,
      author_name: profile.name,
      author_part: profile.part,
      content: content.trim(),
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setContent("");
    onSubmitted?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && content.trim()) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem(TOOLTIP_KEY, "1");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Timestamp chip — only for top-level comments */}
        {!parentId && (
          <span className="relative shrink-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 border border-primary/20 px-2.5 py-1 font-mono text-xs font-semibold text-primary select-none overflow-hidden">
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="currentColor"
                className="opacity-60"
              >
                <polygon points="0.5,0.5 7.5,4 0.5,7.5" />
              </svg>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={displayedTime}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="inline-block"
                >
                  {displayedTime}
                </motion.span>
              </AnimatePresence>
            </span>

            {/* First-time guide tooltip */}
            {showTooltip && (
              <span
                className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg"
                style={{ animation: "slideUp 0.2s ease-out" }}
                onClick={dismissTooltip}
              >
                영상 시점이 자동으로 기록돼요
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
              </span>
            )}
          </span>
        )}

        {/* Reply label chip */}
        {parentId && (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground select-none">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M2 7 L2 3 Q2 1 4 1 L9 1" />
              <path d="M7 3 L9 1 L7 -1" />
            </svg>
            답글
          </span>
        )}

        {/* Input */}
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            parentId
              ? "답글을 입력하세요..."
              : "이 시점에 피드백을 남겨보세요..."
          }
          className="flex-1 text-sm h-9 bg-background border-border/70 focus-visible:border-primary/50 focus-visible:ring-primary/20 placeholder:text-muted-foreground/60 rounded-full px-4"
          autoFocus={!!parentId}
          disabled={isSubmitting}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150"
          aria-label="등록"
        >
          {isSubmitting ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
              className="animate-spin opacity-80"
            >
              <path
                d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zm0 1.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z"
                opacity="0.3"
              />
              <path d="M13 7a6 6 0 0 0-6-6V2.5A4.5 4.5 0 0 1 11.5 7H13z" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
            >
              <path d="M1 7L13 1L7.5 13L6 8L1 7Z" />
            </svg>
          )}
        </button>

        {/* Cancel button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all duration-150"
            aria-label="취소"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>
        )}
      </div>

      {error && <p className="text-xs text-destructive pl-2">{error}</p>}
    </form>
  );
}
