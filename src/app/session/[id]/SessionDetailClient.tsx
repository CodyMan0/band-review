'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

import { type CommentWithReplies } from '@/entities/comment/model/comment.interface';
import { CommentList } from '@/entities/comment/ui/CommentList';
import { TimelineMarkers } from '@/entities/comment/ui/TimelineMarkers';
import { type Session } from '@/entities/session/model/session.interface';
import { VideoPlayer, type VideoPlayerRef } from '@/entities/session/ui/VideoPlayer';
import { CommentForm } from '@/features/create-comment/ui/CommentForm';
import { ProfileProvider } from '@/features/user-profile/ui/ProfileProvider';
import { type Part, PARTS } from '@/shared/config/parts';

interface Props {
  session: Session;
  initialComments: CommentWithReplies[];
}

export function SessionDetailClient({ session, initialComments }: Props) {
  const playerRef = useRef<VideoPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [filterPart, setFilterPart] = useState<Part | 'all'>('all');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSeek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds);
  }, []);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    // Update duration periodically
    const dur = playerRef.current?.getDuration() ?? 0;
    if (dur > 0) setDuration(dur);
  }, []);

  const handleReply = useCallback((commentId: string) => {
    setReplyTo(commentId);
  }, []);

  const handleCommentSubmitted = useCallback(() => {
    setReplyTo(null);
  }, []);

  const visibleCount =
    filterPart === 'all'
      ? initialComments.length
      : initialComments.filter((c) => c.author_part === filterPart).length;

  return (
    <ProfileProvider>
      <div className="flex flex-1 flex-col pb-20">
        {/* Back button */}
        <div className="px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground active:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            목록
          </Link>
        </div>

        {/* Video — edge to edge within container */}
        <VideoPlayer
          ref={playerRef}
          videoUrl={session.video_url}
          videoType={session.video_type}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Timeline markers */}
        <TimelineMarkers
          comments={initialComments}
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
        />

        {/* Session info */}
        <div className="px-5 pb-3">
          <h1 className="text-base font-bold leading-snug">{session.title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{session.date}</p>
        </div>

        {/* Part filter — horizontal scroll */}
        <div className="border-b border-border/40 px-5 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterPart('all')}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                filterPart === 'all'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              전체 {initialComments.length}
            </button>
            {PARTS.map((p) => {
              const count = initialComments.filter((c) => c.author_part === p.value).length;
              if (count === 0) return null;
              return (
                <button
                  key={p.value}
                  onClick={() => setFilterPart(p.value)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                    filterPart === p.value
                      ? `${p.color} border`
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {p.emoji} {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comments */}
        <div className="flex-1 px-5">
          <p className="py-3 text-xs text-muted-foreground">
            피드백 {visibleCount}개
          </p>
          <CommentList
            comments={initialComments}
            filterPart={filterPart}
            onSeek={handleSeek}
            onReply={handleReply}
          />
        </div>
      </div>

      {/* Fixed bottom comment input — like a chat app */}
      {!replyTo && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="mx-auto w-full min-w-[380px] max-w-[540px] px-4 py-2.5">
            <CommentForm
              sessionId={session.id}
              currentTime={currentTime}
              onSubmitted={handleCommentSubmitted}
            />
          </div>
        </div>
      )}

      {/* Reply bottom sheet */}
      {replyTo && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md shadow-lg"
          style={{ animation: 'slideUp 0.18s ease-out' }}
        >
          <div className="mx-auto w-full min-w-[380px] max-w-[540px] px-4 py-2.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">답글 달기</span>
              <button
                onClick={() => setReplyTo(null)}
                className="rounded-full p-1 text-muted-foreground active:bg-muted"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <CommentForm
              sessionId={session.id}
              currentTime={currentTime}
              parentId={replyTo}
              onSubmitted={handleCommentSubmitted}
              onCancel={() => setReplyTo(null)}
            />
          </div>
        </div>
      )}
    </ProfileProvider>
  );
}
