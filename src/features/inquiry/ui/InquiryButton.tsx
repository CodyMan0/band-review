'use client';

import { useState } from 'react';

import { createInquiry } from '@/features/inquiry/action/create-inquiry';
import { getProfile } from '@/shared/config/profile';
import { BottomSheet, Button, Input } from '@/shared/ui';

export function InquiryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = () => {
    const profile = getProfile();
    if (profile) setName(profile.name);
    setIsOpen(true);
    setSubmitted(false);
    setError('');
    setContent('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError('');

    const result = await createInquiry({
      author_name: name.trim(),
      content: content.trim(),
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  };

  return (
    <>
      {/* FAB — 문의 (좌측, 새 세션 FAB와 겹치지 않게) */}
      <button
        onClick={handleOpen}
        className="fixed left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-md transition-all active:scale-95 hover:text-foreground sm:left-1/2 sm:-translate-x-[calc(min(270px,50vw)-8px)]"
        style={{ bottom: 'calc(24px + var(--safe-area-bottom))' }}
        aria-label="문의하기"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 9.5C15 13.09 12.31 16 9 16C7.93 16 6.93 15.72 6.06 15.22L3 16L3.78 13.06C3.28 12.16 3 11.12 3 10C3 6.41 5.69 3.5 9 3.5C12.31 3.5 15 6.41 15 9.5Z" />
        </svg>
      </button>

      <BottomSheet open={isOpen} onOpenChange={setIsOpen}>
        {submitted ? (
          <div className="flex flex-col items-center py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl">
              ✓
            </div>
            <p className="mt-3 text-base font-semibold">문의가 접수되었어요</p>
            <p className="mt-1 text-sm text-muted-foreground">감사합니다!</p>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="mt-5 rounded-full px-6"
              size="sm"
            >
              닫기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold">문의하기</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                건의사항이나 궁금한 점을 남겨주세요
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="inquiry-name" className="text-sm font-medium">
                이름
              </label>
              <Input
                id="inquiry-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                required
                className="h-10 rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="inquiry-content" className="text-sm font-medium">
                내용
              </label>
              <textarea
                id="inquiry-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="문의 내용을 입력해주세요"
                required
                rows={3}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !content.trim()}
              className="h-11 w-full rounded-xl text-sm font-semibold active:scale-[0.98]"
            >
              {isSubmitting ? '보내는 중...' : '보내기'}
            </Button>
          </form>
        )}
      </BottomSheet>
    </>
  );
}
