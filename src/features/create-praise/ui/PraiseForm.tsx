'use client';

import { useState } from 'react';

import { createPraise } from '@/features/create-praise/action/create-praise';
import { getProfile } from '@/shared/config/profile';
import { formatTimestamp } from '@/shared/lib/format-time';
import { Input } from '@/shared/ui';

interface PraiseFormProps {
  sessionId: string;
  currentTime: number;
  onSubmitted?: () => void;
  onCancel: () => void;
}

export function PraiseForm({ sessionId, currentTime, onSubmitted, onCancel }: PraiseFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = content.trim() || '👏';

    const profile = getProfile();
    if (!profile) return;

    setIsSubmitting(true);
    setError('');

    const result = await createPraise({
      session_id: sessionId,
      timestamp_sec: currentTime,
      author_name: profile.name,
      author_part: profile.part,
      content: text,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setContent('');
    onSubmitted?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-600 select-none">
          👏 {formatTimestamp(currentTime)}
        </span>

        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="어떤 점이 좋았나요? (비워도 OK)"
          className="flex-1 text-sm h-9 bg-background border-border/70 focus-visible:border-amber-400/50 focus-visible:ring-amber-400/20 placeholder:text-muted-foreground/60 rounded-full px-4"
          autoFocus
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-500 text-white hover:bg-amber-600 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150"
          aria-label="칭찬 보내기"
        >
          {isSubmitting ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="animate-spin opacity-80">
              <path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zm0 1.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" opacity="0.3"/>
              <path d="M13 7a6 6 0 0 0-6-6V2.5A4.5 4.5 0 0 1 11.5 7H13z"/>
            </svg>
          ) : (
            <span className="text-sm">👏</span>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-border/70 text-muted-foreground hover:bg-muted active:scale-95 transition-all duration-150"
          aria-label="취소"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="11" y2="11" />
            <line x1="11" y1="1" x2="1" y2="11" />
          </svg>
        </button>
      </div>

      {error && <p className="text-xs text-destructive pl-2">{error}</p>}
    </form>
  );
}
